# 🔐Securing Cloud Data Using AES and Honey Encryption

A full-stack web application project that secures sensitive cloud data using Advanced Encryption Standard (AES) combined with Honey Encryption (HE) to provide dual-layer protection against brute-force and dictionary attacks.

# 🚀Overview
This project was developed as part of my Master's in Computer Science at California State University, Sacramento. It demonstrates a novel approach to data security by integrating:

AES: A standard symmetric-key algorithm used for encrypting actual data.

Honey Encryption: An advanced technique that returns plausible fake data when incorrect keys are used, deceiving attackers during brute-force attempts.

![Secure_Cloud_Data_Using_AES_HE](https://github.com/user-attachments/assets/3effe11c-37da-4526-888b-71ee8daddd1d)
# 🛡 Key Features
### 🔒 Dual-layer encryption using AES + Honey Encryption

### 📁 Honeyword generation to mislead brute-force attackers

### 🌐 Secure upload and retrieval of data files through a web interface

### 🧪 Simulated attacker model to test resilience against incorrect decryption attempts

### 📊 User activity logging and response feedback on encryption attempts


# 🧰 Tech Stack
Frontend

React.js

HTML, CSS (Tailwind)

Backend

Python

Django Framework

Encryption Logic

PyCrypto / Cryptography package for AES

Custom implementation of Honey Encryption using a distribution-transforming encoder (DTE)

Database

SQLite3

Deployment

AWS EC2

GitHub for version control

# 🔍 Project Structure
![image](https://github.com/user-attachments/assets/dd076e6d-4ffe-4585-bd23-7d6d1a51a9b6)

# 🧪 How to Run Locally
## 1. Clone the repo
`git clone https://github.com/yourusername/Securing_Cloud_Data.git`

`cd Securing_Cloud_Data`

## 2. Backend Setup
`cd backend`

`pip install -r requirements.txt`

`source venv/bin/activate`

`python manage.py runserver`

## 3. Frontend Setup

`cd frontend`

`npm install`

`npm start`
