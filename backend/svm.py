import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.svm import SVR
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error

# Load and prepare data
filepath = "cleaned_seera_dataset.csv"
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
target = 'Actual effort'

print("[INFO] Loading dataset...")
df = pd.read_csv(filepath)
df.columns = df.columns.str.strip()

final_df = df[features + [target]].copy()
final_df.replace('?', np.nan, inplace=True)

for col in features + [target]:
    final_df[col] = pd.to_numeric(final_df[col], errors='coerce')
    if final_df[col].isnull().any():
        median_val = final_df[col].median()
        final_df[col] = final_df[col].fillna(median_val)

X = final_df[features]
y = final_df[target]

print(f"[INFO] Dataset loaded. Total samples: {len(df)}, Features: {len(features)}")
print(f"[INFO] X shape: {X.shape}, y shape: {y.shape}")

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"[INFO] Training set size: {X_train.shape[0]}, Testing set size: {X_test.shape[0]}")

# Create pipeline
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('svr', SVR())
])

# Define hyperparameter grid
param_grid = {
    'svr__kernel': ['rbf'],
    'svr__C': [1, 10, 100, 1000],
    'svr__gamma': ['scale', 0.01, 0.001],
    'svr__epsilon': [0.01, 0.1, 1]
}

print("[INFO] Starting hyperparameter tuning...")
grid_search = GridSearchCV(pipeline, param_grid, cv=5, scoring='neg_mean_absolute_error', verbose=1, n_jobs=-1)
grid_search.fit(X_train, y_train)

# Best model and parameters
best_model = grid_search.best_estimator_
print(f"[INFO] Best Parameters: {grid_search.best_params_}")

# Predict and evaluate
y_pred = best_model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))

print(f"[RESULT] Fine-tuned MAE: {mae:.4f}")
print(f"[RESULT] Fine-tuned RMSE: {rmse:.4f}")

# Save the trained fine-tuned model
model_filename = "svr_effort_model_tuned.pkl"
joblib.dump(best_model, model_filename)
print(f"[INFO] Fine-tuned model saved to '{model_filename}'")
