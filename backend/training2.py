# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import mean_absolute_error, mean_squared_error
# import xgboost as xgb
# import joblib

# # Load dataset
# print("Loading dataset...")
# try:
#     df = pd.read_csv('SEERA.csv')  # Update this path if needed
#     df.columns = df.columns.str.strip()  # Remove any accidental spaces in column names
#     print("Dataset loaded successfully.")
#     print("\nColumn names:", df.columns.tolist())
# except Exception as e:
#     print("Error loading data:", e)
#     raise

# # Define target column
# target_candidates = ['Actual effort', 'Actual_effort', 'Effort', 'actual_effort', 'actual effort', 'Effort (person-months)']
# target = next((col for col in target_candidates if col in df.columns), None)

# if target is None:
#     print("\nERROR: Could not find the target column in the dataset.")
#     print("Available columns:", df.columns.tolist())
#     raise ValueError(f"Target column not found. Expected one of: {target_candidates}")

# print(f"\nUsing target column: '{target}'")

# # Define possible feature names
# possible_features = [
#     'Estimated duration', 
#     'Size of organization', 
#     'Size of IT department',
#     'Object points', 
#     'Team size',
#     'Programmers experience in programming language', 
#     'Project manager experience',
#     'Requirements stability'
# ]

# # Ensure selected features exist in the dataset
# selected_features = [col for col in possible_features if col in df.columns]
# print("\nSelected features:", selected_features)

# if not selected_features:
#     raise ValueError("No valid features found in the dataset.")

# # Prepare final dataset
# final_df = df[selected_features + [target]].copy()

# # Convert columns to numeric
# for col in selected_features + [target]:
#     final_df[col] = pd.to_numeric(final_df[col], errors='coerce')  # Convert to numeric, set errors to NaN

# # Fill missing values with median
# for col in selected_features + [target]:
#     if final_df[col].isna().any():
#         median_value = final_df[col].median()
#         print(f"Filling missing values in {col} with median: {median_value}")
#         final_df[col].fillna(median_value, inplace=True)

# print("\nMissing values after cleaning:\n", final_df.isna().sum())

# # Split data
# X = final_df[selected_features]
# y = final_df[target]
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# print(f"\nTraining samples: {X_train.shape[0]}, Test samples: {X_test.shape[0]}")

# # Train model
# print("\nTraining model...")
# model = xgb.XGBRegressor(
#     objective='reg:squarederror',
#     n_estimators=1000,
#     learning_rate=0.05,
#     max_depth=6,
#     min_child_weight=1,
#     subsample=0.8,
#     colsample_bytree=0.8,
#     gamma=0,
#     reg_alpha=0,
#     reg_lambda=1,
#     random_state=42
# )

# model.fit(X_train, y_train)

# # Evaluate model
# y_pred = model.predict(X_test)
# mae = mean_absolute_error(y_test, y_pred)
# rmse = np.sqrt(mean_squared_error(y_test, y_pred))

# print(f"\nModel Performance:")
# print(f"Mean Absolute Error: {mae:.2f}")
# print(f"Root Mean Squared Error: {rmse:.2f}")

# # Display feature importance
# print("\nFeature importances:")
# for name, importance in zip(selected_features, model.feature_importances_):
#     print(f"{name}: {importance:.4f}")

# # Save model
# joblib.dump(model, 'software_cost_estimator.pkl')
# print("\nModel saved successfully as 'software_cost_estimator.pkl'")
