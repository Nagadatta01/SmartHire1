from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import joblib
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os
from datetime import datetime
from bson import ObjectId

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Load the model and scaler
model = joblib.load('hiring_model.pkl')
scaler = joblib.load('scaler.pkl')

# Connect to MongoDB Atlas using URI from .env
MONGO_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGO_URI)
db = client['fullstack']  # ✅ Corrected database name

# Access collections
predictions_collection = db['predictions']
contacts_collection = db['contacts']

# Prediction endpoint
@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    try:
        features = ['Age', 'Gender', 'EducationLevel', 'ExperienceYears', 'PreviousCompanies',
                    'DistanceFromCompany', 'InterviewScore', 'SkillScore', 'PersonalityScore', 'RecruitmentStrategy']
        input_data = pd.DataFrame([[ 
            float(data['age']),
            int(data['gender']),
            int(data['educationLevel']),
            float(data['experienceYears']),
            int(data['previousCompanies']),
            float(data['distanceFromCompany']),
            float(data['interviewScore']),
            float(data['skillScore']),
            float(data['personalityScore']),
            int(data['recruitmentStrategy'])
        ]], columns=features)

        input_scaled = scaler.transform(input_data)

        prediction = model.predict(input_scaled)[0]
        probability = model.predict_proba(input_scaled)[0][1]

        prediction_data = {
            'input': data,
            'prediction': int(prediction),
            'probability': float(probability),
            'timestamp': datetime.utcnow()
        }
        predictions_collection.insert_one(prediction_data)

        return jsonify({
            'prediction': int(prediction),
            'probability': float(probability)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# History endpoint
@app.route('/api/history', methods=['GET'])
def get_history():
    try:
        history = list(predictions_collection.find().sort('timestamp', -1))
        for item in history:
            item['_id'] = str(item['_id'])
        return jsonify(history)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# PDF generation endpoint
@app.route('/api/generate_pdf/<prediction_id>', methods=['GET'])
def generate_pdf(prediction_id):
    try:
        prediction = predictions_collection.find_one({'_id': ObjectId(prediction_id)})
        if not prediction:
            return jsonify({'error': 'Prediction not found'}), 404

        pdf_path = f'reports/prediction_{prediction_id}.pdf'
        os.makedirs('reports', exist_ok=True)
        c = canvas.Canvas(pdf_path, pagesize=letter)
        c.setFont('Helvetica', 12)
        c.drawString(100, 750, 'Smart Hire: Prediction Report')
        c.drawString(100, 730, f"Date: {prediction['timestamp'].strftime('%Y-%m-%d %H:%M:%S')}")
        c.drawString(100, 710, f"Prediction: {'Hired' if prediction['prediction'] else 'Not Hired'}")
        c.drawString(100, 690, f"Probability of Hire: {prediction['probability']:.2%}")
        c.drawString(100, 670, 'Input Data:')
        y = 650
        for key, value in prediction['input'].items():
            c.drawString(100, y, f"{key}: {value}")
            y -= 20
        c.save()

        return send_file(pdf_path, as_attachment=True, download_name=f'prediction_{prediction_id}.pdf')
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Serve static PDF report
@app.route('/reports/<path:filename>')
def serve_report(filename):
    try:
        return send_from_directory('reports', filename)
    except Exception as e:
        return jsonify({'error': 'File not found'}), 404

# Contact form endpoint
@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.json
    try:
        contact_data = {
            'name': data['name'],
            'email': data['email'],
            'message': data['message'],
            'timestamp': datetime.utcnow()
        }
        contacts_collection.insert_one(contact_data)
        return jsonify({'message': 'Contact information submitted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
