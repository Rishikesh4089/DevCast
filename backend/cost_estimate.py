from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import logging
from sklearn.base import BaseEstimator, TransformerMixin

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

# Configure logging
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
            raise ValueError("ExperienceTransformer must be fitted before calling transform().")

        X = X.copy()
        missing = set(self.feature_names_) - set(X.columns)
        if missing:
            raise ValueError(f"Missing features: {missing}")

        for feature in self.exp_features:
            if feature in X.columns:
                capped_exp = np.minimum(X[feature], 5)
                X[feature] = 1.0 - (0.3 * capped_exp / 5)

        return X[self.feature_names_]

    def get_feature_names_out(self, input_features=None):
        return self.feature_names_

def enforce_experience_effect(X, preds):
    prog_exp = np.minimum(X['Programmers experience in programming language'], 5)
    pm_exp = np.minimum(X['Project manager experience'], 5)
    exp_factor = 1.0 - (0.06 * (prog_exp + pm_exp) / 2)
    exp_factor = np.maximum(exp_factor, 0.7)
    return preds * exp_factor

# Load ensemble model components
try:
    model_data = joblib.load('improved_software_cost_estimator.pkl')
    xgb_model = model_data['xgb_model']
    rf_model = model_data['rf_model']
    lr_pipe = model_data['lr_pipe']
    exp_transformer = model_data['exp_transformer']
    feature_order = model_data['features']
    weights = model_data['ensemble_weights']

    # Ensure transformer is fitted
    if getattr(exp_transformer, 'feature_names_', None) is None:
        exp_transformer.fit(pd.DataFrame(columns=feature_order))

    logger.info("Ensemble models loaded successfully.")
except Exception as e:
    logger.error(f"Error loading model: {e}", exc_info=True)
    raise

@app.route('/estimate', methods=['POST'])
def estimate():
    try:
        input_data = request.json
        logger.debug(f"Incoming request: {input_data}")

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

        input_df = pd.DataFrame([input_data])[required_features]
        logger.debug(f"Input DataFrame:\n{input_df}")

        input_transformed = exp_transformer.transform(input_df)
        logger.debug(f"Transformed features: {input_transformed.columns.tolist()}")

        # Get scalar values
        xgb_val = float(xgb_model.predict(input_transformed).item())
        rf_val = float(rf_model.predict(input_transformed).item())
        lr_val = float(lr_pipe.predict(input_transformed).item())

        # Raw effort from ensemble
        raw_effort = (
            weights['xgb'] * xgb_val +
            weights['rf'] * rf_val +
            weights['lr'] * lr_val
        )

        # Adjusted effort
        final_effort = float(enforce_experience_effect(input_transformed, raw_effort))

        logger.info(f"Prediction successful. Raw: {raw_effort:.2f}, Adjusted: {final_effort:.2f}")
        return jsonify({
            "estimated_effort": round(final_effort, 2),
            "status": "success"
        })

    except Exception as e:
        logger.error(f"Error during estimation: {str(e)}", exc_info=True)
        return jsonify({
            "error": "Internal server error",
            "details": str(e),
            "status": "error"
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
