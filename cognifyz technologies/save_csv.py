"""
Script to extract CSV data from clipboard or user input.
The user's restaurant dataset should be saved as dataset.csv.
"""
import sys
import os

# Check if the user already has a dataset file
target = os.path.join(os.path.dirname(__file__), 'dataset.csv')

print(f"Target file: {target}")
print("Please paste your CSV data h   ere, or the script will check if dataset.csv already exists.")

if os.path.exists(target) and os.path.getsize(target) > 1000:
    print(f"dataset.csv already exists ({os.path.getsize(target)} bytes)")
else:
    print("dataset.csv not found or is empty. Please copy the CSV content into dataset.csv manually.")
    print("You can do this by opening the Data Analysis.pdf or your original CSV source.")
