from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from modules.summarizer import apps
from modules.druginteraction import appd

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/upload_report', methods=['POST'])
def upload_report():
    file = request.files['file']
    filepath = os.path.join("uploads", file.filename)
    file.save(filepath)
    
    summary_result = app(filepath)
    return jsonify(summary_result)

@app.route('/upload_prescription', methods=['POST'])
def upload_prescription():
    file = request.files['file']
    prev_medications = request.form.getlist('prev_medications')

    filepath = os.path.join("uploads", file.filename)
    file.save(filepath)

    interaction_result = appd(filepath, prev_medications)
    return jsonify(interaction_result)

if __name__ == '__main__':
    if not os.path.exists("uploads"):
        os.makedirs("uploads")
    app.run(debug=True)
