from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import logging
from sklearn.base import BaseEstimator, TransformerMixin

app = Flask(__name__)
CORS(app)

# Setup logger
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


class ExperienceTransformer(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.exp_features = [
            'Programmers experience in programming language',
            'Project manager experience'
        ]
        self.feature_names_ = None

    def fit(self, X, y=None):
        self.feature_names_ = list(X.columns)
        return self

    def transform(self, X):
        if self.feature_names_ is None:
            raise ValueError("Transformer not fitted yet.")
        X = X.copy()
        missing = set(self.feature_names_) - set(X.columns)
        if missing:
            raise ValueError(f"Missing features during transform: {missing}")
        for feature in self.exp_features:
            if feature in X.columns:
                capped = np.minimum(X[feature], 5)
                X[feature] = 1.0 - (0.3 * capped / 5)
        return X[self.feature_names_]

    def get_feature_names_out(self, input_features=None):
        return self.feature_names_


def enforce_experience_effect(X, base_pred):
    prog_exp = np.minimum(X['Programmers experience in programming language'], 5)
    pm_exp = np.minimum(X['Project manager experience'], 5)
    exp_factor = 1.0 - (0.06 * (prog_exp + pm_exp) / 2)
    return np.maximum(base_pred * exp_factor, base_pred * 0.7)


# Load both model files
try:
    # Ensemble model components
    ensemble_data = joblib.load('improved_software_cost_estimator.pkl')
    xgb_model = ensemble_data['xgb_model']
    rf_model = ensemble_data['rf_model']
    lr_pipe = ensemble_data['lr_pipe']
    ensemble_weights = ensemble_data['ensemble_weights']
    exp_transformer_ensemble = ensemble_data['exp_transformer']
    feature_order_ensemble = ensemble_data['features']

    if getattr(exp_transformer_ensemble, 'feature_names_', None) is None:
        exp_transformer_ensemble.fit(pd.DataFrame(columns=feature_order_ensemble))

    # SVR model loading and transformer fitting
    svr_model = joblib.load('svr_effort_model_tuned.pkl')
    exp_transformer_svr = ExperienceTransformer()
    feature_order_svr = feature_order_ensemble  # or a separate one if SVR model uses different
    exp_transformer_svr.fit(pd.DataFrame(columns=feature_order_svr))

    logger.info("✅ All models loaded successfully.")

except Exception as e:
    logger.error("❌ Failed to load model(s): %s", str(e), exc_info=True)
    raise


@app.route('/estimate', methods=['POST'])
def estimate():
    try:
        input_data = request.json
        logger.debug("Received input: %s", input_data)

        model_choice = input_data.get('model_choice', 'ensemble')
        logger.debug("Model selected: %s", model_choice)

        required_features = [
            'Size of organization',
            'Team size',
            'Daily working hours',
            'Object points',
            '# Multiple programing languages',
            'Programmers experience in programming language',
            'Project manager experience',
            'Requirment stability'
        ]

        for feature in required_features:
            if feature not in input_data:
                return jsonify({
                    "error": f"Missing required field: {feature}",
                    "status": "error"
                }), 400

        input_df = pd.DataFrame([input_data])[required_features]
        logger.debug("Constructed DataFrame:\n%s", input_df)

        if model_choice == 'ensemble':
            transformed = exp_transformer_ensemble.transform(input_df)
            xgb_val = float(xgb_model.predict(transformed).item())
            rf_val = float(rf_model.predict(transformed).item())
            lr_val = float(lr_pipe.predict(transformed).item())

            raw_effort = (
                ensemble_weights['xgb'] * xgb_val +
                ensemble_weights['rf'] * rf_val +
                ensemble_weights['lr'] * lr_val
            )

            adjusted_effort = float(enforce_experience_effect(input_df, raw_effort))

        elif model_choice == 'svm':
            transformed = exp_transformer_svr.transform(input_df)
            raw_effort = float(svr_model.predict(transformed).item())
            adjusted_effort = float(enforce_experience_effect(input_df, raw_effort))

        else:
            return jsonify({
                "error": f"Unsupported model choice: {model_choice}",
                "status": "error"
            }), 400

        logger.info(f"🔍 Final Effort - Model: {model_choice}, Raw: {raw_effort:.2f}, Adjusted: {adjusted_effort:.2f}")

        return jsonify({
            "estimated_effort": round(adjusted_effort, 2),
            "status": "success"
        })

    except Exception as e:
        logger.error("Estimation error: %s", str(e), exc_info=True)
        return jsonify({
            "error": "Internal server error",
            "details": str(e),
            "status": "error"
        }), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
