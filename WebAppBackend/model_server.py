from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import torch
from ultralytics import YOLO
import cv2
import numpy as np
import io
import base64
from PIL import Image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "server/YOLOshrimp.pt"
model = YOLO(MODEL_PATH)

def read_imagefile(file_bytes) -> np.ndarray:
    image = np.frombuffer(file_bytes, np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    return image

def encode_image_to_base64(image: np.ndarray) -> str:
    _, buffer = cv2.imencode('.jpg', image)
    return base64.b64encode(buffer).decode('utf-8')

@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    file_bytes = await image.read()
    img_np = read_imagefile(file_bytes)
    img_rgb = cv2.cvtColor(img_np, cv2.COLOR_BGR2RGB)

    results = model(img_rgb)
    
    # Filter detections based on confidence score > 0.6
    filtered_detections = []
    if results[0].boxes.conf is not None:
        for i, det in enumerate(results[0].boxes.xyxy.cpu().numpy()):
            if results[0].boxes.conf[i].item() > 0.6:
                filtered_detections.append(det)

    shrimp_count = len(filtered_detections)
    calculated_biomass_grams = round(shrimp_count * 0.035, 2)
    recommended_feed_grams = round(calculated_biomass_grams * 0.15, 2)

    for box in filtered_detections:
        x1, y1, x2, y2 = map(int, box[:4])
        cv2.rectangle(img_np, (x1, y1), (x2, y2), (0, 255, 0), 2)

    processed_image_base64 = encode_image_to_base64(img_np)

    json_response = {
        "count": shrimp_count,
        "calculatedBiomassGrams": calculated_biomass_grams,
        "recommendedFeedGrams": recommended_feed_grams,
        "processedImageBase64": processed_image_base64
    }

    return JSONResponse(json_response)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("model_server:app", host="127.0.0.1", port=8000, reload=True)
