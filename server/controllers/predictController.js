import axios from "axios";

const AI_MODEL_SERVICE_URL =
  process.env.AI_MODEL_SERVICE_URL || "http://localhost:5001";

const predictDisease = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Symptoms are required and must be an array.",
      });
    }

    const aiResponse = await axios.post(`${AI_MODEL_SERVICE_URL}/predict`, {
      symptoms: symptoms,
    });

    const predictionResult =
      aiResponse.data.prediction ||
      aiResponse.data.predicted_disease ||
      "Prediction Unavailable";

    res.status(200).json({
      success: true,
      message: "Disease prediction successful.",
      data: {
        prediction: predictionResult,
      },
    });
  } catch (error) {
    console.error("Error during disease prediction:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to get disease prediction.";

    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
};

const getSymptoms = async (req, res) => {
  try {
    const aiResponse = await axios.get(`${AI_MODEL_SERVICE_URL}/symptoms`);
    console.log(AI_MODEL_SERVICE_URL);

    if (!aiResponse.data.success) {
      return res.status(500).json({
        success: false,
        error:
          aiResponse.data.error || "Failed to fetch symptoms from AI model.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Symptoms fetched successfully.",
      data: {
        symptoms: aiResponse.data.symptoms,
      },
    });
  } catch (error) {
    console.error("Error fetching symptoms:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch symptoms.";

    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
};

export { predictDisease, getSymptoms };
