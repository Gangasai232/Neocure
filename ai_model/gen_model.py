import pandas as pd
import numpy as np
import joblib
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.model_selection import cross_val_score
from sklearn.metrics import accuracy_score
import random

TRAIN_PATH = "Training.csv"
TEST_PATH = "Testing.csv"
MODEL_PATH = "model.pkl"

# --- Noise/Overlap Config ---
OVERLAP_SYMPTOMS_PER_DISEASE = 2  # Number of symptoms shared across diseases
NOISE_FLIP_PROB = 0.05            # 5% chance to flip each symptom (0→1 or 1→0)

def add_symptom_overlap(df, overlap_count=2):
    """Randomly share some symptoms across multiple diseases to simulate overlap."""
    symptom_cols = df.columns[:-1]
    disease_vals = df.iloc[:, -1].unique()

    for disease in disease_vals:
        # Choose random symptoms to overlap with other diseases
        overlap_symptoms = random.sample(list(symptom_cols), overlap_count)
        # Randomly pick other diseases to inject this symptom
        other_diseases = [d for d in disease_vals if d != disease]
        for od in other_diseases:
            idx = df[df.iloc[:, -1] == od].index
            df.loc[idx, overlap_symptoms] = df.loc[df[df.iloc[:, -1] == disease].index, overlap_symptoms].sample(len(idx), replace=True).values
    return df

def add_random_noise(df, noise_prob=0.05):
    """Randomly flip some symptom values to simulate imperfect reporting."""
    symptom_cols = df.columns[:-1]
    for col in symptom_cols:
        mask = np.random.rand(len(df)) < noise_prob
        df.loc[mask, col] = 1 - df.loc[mask, col]  # Flip 0 ↔ 1
    return df

def train_and_save_model():
    # Load datasets
    train_df = pd.read_csv(TRAIN_PATH)
    test_df = pd.read_csv(TEST_PATH)

    # Inject overlap and noise
    train_df = add_symptom_overlap(train_df, OVERLAP_SYMPTOMS_PER_DISEASE)
    train_df = add_random_noise(train_df, NOISE_FLIP_PROB)
    test_df = add_random_noise(test_df, NOISE_FLIP_PROB)  # Optional, simulate real-world variance

    X_train, y_train = train_df.iloc[:, :-1], train_df.iloc[:, -1]
    X_test, y_test = test_df.iloc[:, :-1], test_df.iloc[:, -1]

    symptoms_list = list(X_train.columns)
    unique_diseases = sorted(y_train.unique())
    diseases_map = {i: d for i, d in enumerate(unique_diseases)}

    models = {
        "DecisionTree": DecisionTreeClassifier(random_state=42),
        "RandomForest": RandomForestClassifier(random_state=42),
        "NaiveBayes": GaussianNB(),
    }

    best_model = None
    best_acc = 0.0

    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)

        acc = accuracy_score(y_test, y_pred)
        cv_acc = cross_val_score(model, X_train, y_train, cv=5).mean()

        print(f"\n🔍 {name}")
        print(f"   Test Accuracy: {acc:.2f}")
        print(f"   Cross-val Mean Accuracy: {cv_acc:.2f}")

        if cv_acc > best_acc:
            best_acc = cv_acc
            best_model = model

    # Save best model
    joblib.dump({
        "model": best_model,
        "symptoms_list": symptoms_list,
        "diseases_map": diseases_map
    }, MODEL_PATH)

    print(f"\n🏆 Best Model: {type(best_model).__name__} with CV accuracy {best_acc:.2f}")
    print(f"📦 Saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_and_save_model()
