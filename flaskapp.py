from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
tokenizer = AutoTokenizer.from_pretrained("saved_multilabel_model/")
model = AutoModelForSequenceClassification.from_pretrained("saved_multilabel_model/")
from flask_cors import CORS

def predict_review(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    outputs = model(**inputs)
    probs = torch.sigmoid(outputs.logits).detach().numpy()[0]
    print(probs)
    return {
        "satisfied": int(probs[0] > 0.5),
        "relevant": int(probs[1] > 0.5),
        "spam": int(probs[2] > 0.5)
    }


app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    review = data.get("review" , 'No message received')
    label = predict_review(review)
    print(label)
    return jsonify(label)

@app.route('/')
def predictdefault():
    label = predict_review("I love this restaurant")
    print(label)
    return jsonify({"satisfied": label})

if __name__ == '__main__':
    app.run(debug=True)