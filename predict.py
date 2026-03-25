import numpy as np
import os
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

MODEL_PATH = "model/trained_model.h5"

model = None

# SAFE LOAD
try:
    print("Checking model path:", os.path.exists(MODEL_PATH))
    model = load_model(MODEL_PATH)
    print("Model loaded successfully")

    # Warm-up
    model.predict(np.zeros((1, 224, 224, 3)), verbose=0)

except Exception as e:
    print("Model load failed:", e)


def predict_image(img_path):

    if model is None:
        return {"error": "Model not loaded"}

    img = image.load_img(img_path, target_size=(224, 224))
    img = image.img_to_array(img) / 255.0
    img = np.expand_dims(img, axis=0)

    pred = model.predict(img, verbose=0)[0][0]
    pred = float(pred)

    if pred > 0.5:
        return {
            "label": "Fake",
            "confidence": round(pred * 100, 2)
        }
    else:
        return {
            "label": "Real",
            "confidence": round((1 - pred) * 100, 2)
        }