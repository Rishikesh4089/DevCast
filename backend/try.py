# import pandas as pd

# # Load original dataset
# df = pd.read_csv('SEERA.csv')

# # Corrected column names based on actual headers
# input_columns = [
#     'Estimated  duration',
#     'Size of organization',
#     'Team size',
#     'Daily working hours',
#     'Object points',
#     '# Multiple programing languages ',
#     'Programmers experience in programming language',
#     'Project manager experience',
#     'Requirment stability'
# ]

# target_column = 'Actual effort'

# # Filter and clean
# df_filtered = df[input_columns + [target_column]]

# # Drop rows with any missing values
# df_cleaned = df_filtered.dropna()

# # Optionally reset index
# df_cleaned.reset_index(drop=True, inplace=True)

# # Save cleaned dataset
# df_cleaned.to_csv('cleaned_seera_dataset.csv', index=False)

# print("✅ Cleaned dataset saved to 'cleaned_seera_dataset.csv'")
