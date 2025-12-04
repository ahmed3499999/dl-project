from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model import classify
import base64
import io
from PIL import Image
from pydantic import BaseModel

# Label Overview
classes = { 0:'Speed limit (20km/h)',
            1:'Speed limit (30km/h)',
            2:'Speed limit (50km/h)',
            3:'Speed limit (60km/h)',
            4:'Speed limit (70km/h)',
            5:'Speed limit (80km/h)',
            6:'End of speed limit (80km/h)',
            7:'Speed limit (100km/h)',
            8:'Speed limit (120km/h)',
            9:'No passing',
            10:'No passing veh over 3.5 tons',
            11:'Right-of-way at intersection',
            12:'Priority road',
            13:'Yield',
            14:'Stop',
            15:'No vehicles',
            16:'Veh > 3.5 tons prohibited',
            17:'No entry',
            18:'General caution',
            19:'Dangerous curve left',
            20:'Dangerous curve right',
            21:'Double curve',
            22:'Bumpy road',
            23:'Slippery road',
            24:'Road narrows on the right',
            25:'Road work',
            26:'Traffic signals',
            27:'Pedestrians',
            28:'Children crossing',
            29:'Bicycles crossing',
            30:'Beware of ice/snow',
            31:'Wild animals crossing',
            32:'End speed + passing limits',
            33:'Turn right ahead',
            34:'Turn left ahead',
            35:'Ahead only',
            36:'Go straight or right',
            37:'Go straight or left',
            38:'Keep right',
            39:'Keep left',
            40:'Roundabout mandatory',
            41:'End of no passing',
            42:'End no passing veh > 3.5 tons' }

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def image_to_b64(image: Image.Image):
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG")
    return base64.b64encode(buffer.getvalue()).decode()

class ImageRequest(BaseModel):
    base64Image: str

@app.post("/")
async def create_item(base64Image: ImageRequest):
    imageBytes = io.BytesIO(base64.b64decode(base64Image.base64Image))
    image = Image.open(imageBytes).convert("RGB")
    dd, predictions, cropped_images = classify(image)
    cropped_images = [image_to_b64(img) for img in cropped_images]
    print(predictions)
    signs = []
    for idx, (label, confidence) in enumerate(predictions):
        if label == "Unknown":
            continue
        
        signs.append({
            "name": classes.get(int(label), "Unknown"),
            "confidence": confidence,
            "image": cropped_images[idx]
        })

    return {"image": image_to_b64(dd), "cropped_images": signs}    
