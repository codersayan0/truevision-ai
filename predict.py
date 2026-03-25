import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

MODEL_PATH = "model/trained_model.h5"

model = load_model(MODEL_PATH)

# Warm-up
model.predict(np.zeros((1,224,224,3)), verbose=0)


def predict_image(img_path):
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