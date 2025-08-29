from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from flask_cors import CORS

tokenizer = AutoTokenizer.from_pretrained("saved_multilabel_model/")
model = AutoModelForSequenceClassification.from_pretrained("saved_multilabel_model/")

app = Flask(__name__)
CORS(app)

def predict_review(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    outputs = model(**inputs)
    probs = torch.sigmoid(outputs.logits).detach().numpy()[0]
    print(probs)

    return probs


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    review = data.get("review" , 'No message received')
    label = predict_review(review)
    print(label)
    return jsonify({"satisfied":float(label[0]),"relevant":float(label[1]),"spam":float(label[2])})


if __name__ == '__main__':
    app.run(debug=True)
