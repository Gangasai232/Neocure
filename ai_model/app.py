# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

MODEL_PATH = "model.pkl"
model = None
symptoms_list = []
diseases_map = {}

# --- Load Model ---
try:
    model_data = joblib.load(MODEL_PATH)
    model = model_data["model"]
    symptoms_list = model_data["symptoms_list"]
    diseases_map = model_data["diseases_map"]

    print(f"Model loaded from {MODEL_PATH}")
    print(f"Understands {len(symptoms_list)} symptoms")
    print(f"Can predict {len(diseases_map)} diseases")

except Exception as e:
    print(f"Error loading model: {e}")
    model = None

def preprocess_input(symptoms_from_user):
    """
    Converts a list of symptom names from frontend into a binary feature vector.
    """
    processed = [s.strip().lower().replace(" ", "_") for s in symptoms_from_user]
    row = [1 if col in processed else 0 for col in symptoms_list]
    return np.array(row).reshape(1, -1)

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"success": False, "error": "Model not loaded"}), 500

    data = request.get_json(force=True)
    user_symptoms = data.get("symptoms")

    if not user_symptoms or not isinstance(user_symptoms, list):
        return jsonify({"success": False, "error": "'symptoms' must be a list"}), 400

    try:
        X_input = preprocess_input(user_symptoms)
        prediction = model.predict(X_input)[0]

        return jsonify({
            "success": True,
            "prediction": prediction
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/symptoms", methods=["GET"])
def get_symptoms():
    if not symptoms_list:
        return jsonify({"success": False, "error": "Symptoms list unavailable"}), 500
    
    readable = [s.replace("_", " ").title() for s in symptoms_list]
    return jsonify({"success": True, "symptoms": readable})

@app.route("/", methods=["GET"])
def index():
    return "API is running"

if __name__ == "__main__":
    app.run(debug=True, port=5001)
