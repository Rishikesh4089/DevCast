# from sklearn.base import BaseEstimator, TransformerMixin
# import numpy as np
# import pandas as pd
# import joblib

# class ExperienceTransformer(BaseEstimator, TransformerMixin):
#     def __init__(self):
#         self.exp_features = [
#             'Programmers experience in programming language',
#             'Project manager experience'
#         ]
#         self.feature_names_ = None
        
#     def fit(self, X, y=None):
#         # Store original feature names
#         self.feature_names_ = list(X.columns)
#         return self
        
#     def transform(self, X):
#         X = X.copy()
#         # Ensure all original features are present
#         missing = set(self.feature_names_) - set(X.columns)
#         if missing:
#             raise ValueError(f"Missing features: {missing}")
            
#         # Apply transformations
#         for feature in self.exp_features:
#             if feature in X.columns:
#                 X[f"{feature}_productivity"] = 1 / (1 + np.exp(-(X[feature]-3)/2))
        
#         # Return with original features + new productivity features
#         return X[self.feature_names_ + [f"{f}_productivity" for f in self.exp_features]]
    
#     def get_feature_names_out(self, input_features=None):
#         """Return complete feature list including productivity features"""
#         if input_features is None:
#             return self.feature_names_ + [f"{f}_productivity" for f in self.exp_features]
#         return input_features + [f"{f}_productivity" for f in self.exp_features]