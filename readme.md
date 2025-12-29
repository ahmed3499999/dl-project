# 🛑 GTSRB Traffic Sign Classification


## 📌 Overview

This project focuses on building Model
capable of classifying German traffic signs using the **GTSRB (German
Traffic Sign Recognition Benchmark)** dataset. Traffic sign recognition
is essential for autonomous vehicles, ADAS systems, and computer vision
applications.

## 👥 Team 




  **Nour Youssef ElSayed**        Data preparation (loading, cleaning, augmentation)

  **Donia Khaled Haras**           Model evaluation, metrics, confusion matrix, classification report

  **Basil Mohamed Ahmed**          Model architecture,
                                   documentation, complete pipeline

  **ِِِِAhmed Hamouda**                Frontend using React and TailwindCSS , backend ,documentation

  **Mousa Mohamed Elsayed**        model training

## 📝 Problem Definition
The objective of this project is to develop a deep learning model capable of accurately classifying German traffic signs using the GTSRB (German Traffic Sign Recognition Benchmark) dataset. Traffic sign recognition is a critical component in autonomous driving systems and Advanced Driver Assistance Systems (ADAS), where vehicles must quickly and reliably interpret visual road signs to make safe driving decisions.


## 📂 Dataset Description

The GTSRB dataset contains:

-   **43 classes** of traffic signs
-   **50,000+ images**
-   Various lighting, angles, resolutions, and backgrounds
-   Real-world diversity → ideal for training robust models

Dataset source: *German Traffic Sign Recognition Benchmark*

## 🛠️ Data Preparation

### ✔️ Steps:

-   Re-organized folders so each class has its directory
-   Loaded using `ImageFolder`
-   Applied preprocessing transforms:
    -   Resize → 48×48
    -   ToTensor
    -   Normalize






## 🧠 Model Architecture


A custom **Convolutional Neural Network (CNN)** was created to extract
spatial features and classify traffic signs.

### 🔧 Layer Summary:

-   **Conv2d + ReLU + MaxPool**
-   **BatchNorm2d** for stable training
-   **Dropout** to minimize overfitting
-   **Fully Connected layers** for classification

### 🧱 Architecture Diagram:

    Conv2d → ReLU → BatchNorm2d → Conv2d → ReLU → BatchNorm2d → MaxPool → Dropout   
    Conv2d → ReLU → BatchNorm2d → Conv2d → ReLU → BatchNorm2d → MaxPool → Dropout   
    Conv2d → ReLU → BatchNorm2d → MaxPool → Dropout   
    FC → ReLU
    Dropout
    FC → Softmax (43 classes)

## 🚀 Training

**Implemented by: Basil Mohamed Ahmed**

### ⚙️ Hyperparameters:

-   **Loss Function:** CrossEntropyLoss
-   **Optimizer:** Adam
-   **Batch Size:** 64
-   **Epochs:** 30
-   **Scheduler:** StepLR (learning rate decay)

### 🔄 Training Loop:

1.  Forward pass
2.  Compute loss
3.  Backpropagation
4.  Update weights
5.  Track accuracy & loss each epoch

## 📊 Model Evaluation


### ✔️ Metrics:

-   **Accuracy**
-   **Classification Report** (Precision, Recall, F1-score)
-   **Confusion Matrix**

### 📈 Results:

-   **Training Accuracy:** \~98%
-   **Test Accuracy:** **95--99%**



## 🧾 Conclusion

The CNN model achieved high performance in classifying 43 traffic sign
classes, demonstrating that deep learning is highly effective for
real-world vision tasks such as autonomous driving.

