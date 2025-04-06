import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import xgboost as xgb
from sklearn.base import BaseEstimator, TransformerMixin
from typing import Tuple

# ======== Custom Transformers ========
class ExperienceTransformer(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.exp_features = [
            'Programmers experience in programming language',
            'Project manager experience'
        ]

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        return X.copy()

# ======== Data Preparation ========
def load_and_prepare_data(filepath: str, features: list, target: str) -> Tuple[pd.DataFrame, pd.Series]:
    df = pd.read_csv(filepath)
    df.columns = df.columns.str.strip()

    final_df = df[features + [target]].copy()

    # Replace '?' and other non-numeric with NaN
    final_df.replace('?', np.nan, inplace=True)

    for col in features + [target]:
        final_df[col] = pd.to_numeric(final_df[col], errors='coerce')
        if final_df[col].isnull().any():
            median_val = pd.to_numeric(final_df[col], errors='coerce').median()
            final_df[col].fillna(median_val, inplace=True)

    return final_df[features], final_df[target]

# ======== Monotonic Constraints ========
def create_monotonic_constraints(X: pd.DataFrame) -> Tuple[int]:
    constraints = {col: 0 for col in X.columns}
    constraints['Programmers experience in programming language'] = -1
    constraints['Project manager experience'] = -1
    return tuple(constraints[col] for col in X.columns)

# ======== Experience Effect Enforcement ========
def enforce_experience_effect(X: pd.DataFrame, preds: np.ndarray) -> np.ndarray:
    prog_exp = np.minimum(X['Programmers experience in programming language'], 5)
    pm_exp = np.minimum(X['Project manager experience'], 5)
    exp_factor = 1.0 - 0.04 * (prog_exp + pm_exp)
    exp_factor = np.maximum(exp_factor, 0.6)
    return preds * exp_factor

# ======== Train Models ========
def train_models(X_train: pd.DataFrame, y_train: pd.Series, constraints: Tuple[int]):
    xgb_model = xgb.XGBRegressor(
        objective='reg:squarederror',
        random_state=42,
        n_estimators=500,
        learning_rate=0.03,
        max_depth=5,
        subsample=0.8,
        colsample_bytree=0.8,
        min_child_weight=3,
        gamma=0.1,
        monotone_constraints=constraints
    )

    rf_model = RandomForestRegressor(
        random_state=42,
        n_estimators=300,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        max_features=0.8
    )

    lr_pipe = Pipeline([
        ('scaler', StandardScaler()),
        ('regressor', LinearRegression())
    ])

    xgb_model.fit(X_train, y_train)
    rf_model.fit(X_train, y_train)
    lr_pipe.fit(X_train, y_train)

    return xgb_model, rf_model, lr_pipe

# ======== Ensemble Prediction ========
def predict_ensemble(xgb_model, rf_model, lr_pipe, X: pd.DataFrame) -> np.ndarray:
    return (
        0.5 * xgb_model.predict(X) +
        0.3 * rf_model.predict(X) +
        0.2 * lr_pipe.predict(X)
    )

# ======== Validation Test ========
def run_experience_validation(exp_transformer, models, features: list) -> Tuple[pd.DataFrame, bool]:
    xgb_model, rf_model, lr_pipe = models
    test_exp = [1, 3, 5, 7, 9]
    test_df = pd.DataFrame({
        'Size of organization': 20,
        'Team size': 5,
        'Daily working hours': 8,
        'Object points': 140,
        '# Multiple programing languages': 2,
        'Programmers experience in programming language': test_exp,
        'Project manager experience': test_exp,
        'Requirment stability': 5
    })

    test_transformed = exp_transformer.transform(test_df)
    raw = predict_ensemble(xgb_model, rf_model, lr_pipe, test_transformed)
    adjusted = enforce_experience_effect(test_transformed, raw)

    result = pd.DataFrame({
        'Experience': test_exp,
        'Raw Effort': raw,
        'Constrained Effort': adjusted,
        'Reduction %': (1 - adjusted/raw) * 100
    })
    is_valid = all(np.diff(adjusted) <= 0)
    return result, is_valid

# ======== Main Workflow ========
def main():
    target = 'Actual effort'
    features = [
        'Size of organization', 
        'Team size',
        'Daily working hours',
        'Object points', 
        '# Multiple programing languages',
        'Programmers experience in programming language', 
        'Project manager experience',
        'Requirment stability'
    ]

    # Load and prepare
    X, y = load_and_prepare_data("cleaned_seera_dataset.csv", features, target)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Transform
    exp_transformer = ExperienceTransformer()
    X_train_trans = exp_transformer.fit_transform(X_train)
    X_test_trans = exp_transformer.transform(X_test)

    # Train
    monotonic_constraints = create_monotonic_constraints(X_train_trans)
    xgb_model, rf_model, lr_pipe = train_models(X_train_trans, y_train, monotonic_constraints)

    # Predict
    ensemble_pred = predict_ensemble(xgb_model, rf_model, lr_pipe, X_test_trans)
    final_pred = enforce_experience_effect(X_test_trans, ensemble_pred)

    # Evaluate
    mae = mean_absolute_error(y_test, final_pred)
    rmse = np.sqrt(mean_squared_error(y_test, final_pred))

    # Feature Importance
    importance_df = pd.DataFrame({
        'feature': X_train_trans.columns,
        'importance': xgb_model.feature_importances_
    }).sort_values('importance', ascending=False)

    # Validate experience logic
    validation_result, is_valid = run_experience_validation(exp_transformer, (xgb_model, rf_model, lr_pipe), features)

    # Terminal Logs
    print("\n====== 🔍 Model Evaluation Metrics ======")
    print(f"Mean Absolute Error (MAE): {mae:.2f}")
    print(f"Root Mean Squared Error (RMSE): {rmse:.2f}")

    print("\n====== 📊 XGBoost Feature Importance ======")
    print(importance_df.to_string(index=False))

    print("\n====== 📉 Experience Impact Validation Table ======")
    print(validation_result.to_string(index=False))

    print("\n====== ✅ Experience Constraint Check ======")
    print("✔️ Validation Passed: Effort decreases with increasing experience." if is_valid else "❌ Validation Failed.")

# Entry point
if __name__ == "__main__":
    main()
