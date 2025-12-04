import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import transforms, datasets, models
import matplotlib.pyplot as plt
import numpy as np
from transformers import OwlViTProcessor, OwlViTForObjectDetection
from PIL import Image, ImageDraw
import torch
import torchvision.transforms as transforms
import torch    

class GTSRBCNN(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(32),
            nn.Conv2d(32, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(32),
            nn.MaxPool2d(2),
            nn.Dropout(0.25),

            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(64),
            nn.Conv2d(64, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(64),
            nn.MaxPool2d(2),
            nn.Dropout(0.25),

            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(128),
            nn.MaxPool2d(2),
            nn.Dropout(0.25),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 6 * 6, 512),
            nn.ReLU(),
            nn.BatchNorm1d(512),
            nn.Dropout(0.5),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x
    
num_classes = 43
model_c = GTSRBCNN(num_classes)

state_dict = torch.load("gtsrb_cnn_best_.pth", map_location="cpu")
model_c.load_state_dict(state_dict)

processor = OwlViTProcessor.from_pretrained("google/owlvit-base-patch32")
model = OwlViTForObjectDetection.from_pretrained("google/owlvit-base-patch32")
def detect_and_crop_signs(image, text_prompt="traffic sign", threshold=0.1):

    texts = [[text_prompt]]
    inputs = processor(text=texts, images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)

    target_sizes = torch.Tensor([image.size[::-1]])
    results = processor.post_process_object_detection(outputs, target_sizes=target_sizes, threshold=threshold)[0]

    cropped_images = []
    cropped_margin = dict()
    print(f"Found {len(results['boxes'])} potential signs.")

    for i, (box, score, label) in enumerate(zip(results["boxes"], results["scores"], results["labels"])):
        xmin, ymin, xmax, ymax = box.tolist()

        margin = 5
        xmin = max(0, xmin - margin)
        ymin = max(0, ymin - margin)
        xmax = min(image.width, xmax + margin)
        ymax = min(image.height, ymax + margin)
        cropped_margin[i] = [xmin, ymin, xmax, ymax]
        sign_crop = image.crop((xmin, ymin, xmax, ymax))
        cropped_images.append(sign_crop)
      #  sign_crop.save(f'crop{i}.png')
    return cropped_images , cropped_margin

def drawr(image,margin,preds):
    draw = ImageDraw.Draw(image)
    for i,x in enumerate(margin.values()):
      if preds[i][0] != 'Unknown':
        draw.rectangle(x, outline="green", width=6)
    return image

def classify_cropped_signs(cropped_images, model,threshold=0.9):
    TRAIN_CLASS_ORDER = [
        0, 11, 14, 17, 2, 22, 25, 28, 30, 33, 36, 39, 41, 6, 9,
        1, 12, 15, 18, 20, 23, 26, 29, 31, 34, 37, 4, 42, 7,
        10, 13, 16, 19, 21, 24, 27, 3, 32, 35, 38, 40, 5, 8
    ]
    # class_names = TRAIN_CLASS_ORDER
    # class_names = list(range(43))
    class_names = ['0', '1', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '2', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '3', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '4', '40', '41', '42', '5', '6', '7', '8', '9']

    transform = transforms.Compose([
        transforms.Resize((48, 48)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.3403,0.3121,0.3214],
                         std=[0.2724,0.2608,0.2669])  ,
    ])

    predictions = []
    model.eval()

    with torch.no_grad():
        for img in cropped_images:
            input_tensor = transform(img).unsqueeze(0)
            outputs = model(input_tensor)
            probs = torch.softmax(outputs, dim=1)
            max_prob, pred_class = torch.max(probs, dim=1)
            confidence = max_prob.item()

            if confidence < threshold:
                predictions.append(("Unknown", confidence))
            else:
                label = class_names[pred_class.item()]
                predictions.append((label, confidence))

    return predictions

def classify(image):
  cropped_list , margin = detect_and_crop_signs(image)
  preds = classify_cropped_signs(cropped_list, model_c, threshold=0.95)
  dd=drawr(image,margin,preds)

  return dd, preds, cropped_list


