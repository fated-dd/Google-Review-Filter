# Multi-Label Review Classification (BERT-based)

This project builds a **multi-label text classification model** using [`bert-base-uncased`](https://huggingface.co/bert-base-uncased), capable of identifying whether a review expresses **satisfaction**, is **relevant**, or is likely **spam**.

## Features

- Fine-tuned BERT model for **multi-label classification**
- Supports `satisfied`, `relevant`, and `spam` labels
- Web-ready: easily integrable with Flask backend and React frontend
- Trained on manually and synthetically labeled Google review data

---

## Dataset Format

Input CSV file: `combined_reviews.csv`

| text                          | satisfied | relevant | spam |
|------------------------------|-----------|----------|------|
| "Great place, would return!" | 1         | 1        | 0    |
| "I don't like the place"     | 0         | 1        | 0    |
| "Buy followers now..."       | 0         | 0        | 1    |

---

## Project Structure

├── multi_label_model_training.ipynb  *# Jupyter notebook for training*   
├── combined_reviews.csv  *# Input dataset*  
├── saved_multilabel_model/  *# Trained model & tokenizer*  
│ ├── config.json  
│ ├── pytorch_model.bin  
│ └── tokenizer_config.json  



---

## How to Train the Model

1. Install dependencies: ```bash pip install torch transformers scikit-learn pandas   ```   
    
2. Run training notebook (multi_label_model_training.ipynb) or convert code to Python script.

---

## Key steps:

### Preprocess the Data
By writing prompts to ChatGPT API like this and passing reviews 10 by 10 from the Original dataset [`Google Maps Restaurant Reviews`](https://www.kaggle.com/datasets/denizbilginn/google-maps-restaurant-reviews)

```python
system_instruction = '''
    I will give you 10 Google reviews with number labels. 
    For each one, return a JSON object with the following keys: 
    - "satisfied": 1 if the customer seems satisfied, 0 if not.
    - "relevant": 1 if the review is relevant to the business/location, 0 if not.
    - "spam": 1 if the review looks like spam or advertisement, 0 if not.
    Return the result in this format: 
    [ { "review": <number>, "firstword" : <The first word>, "satisfied": 1, "relevant": 1, "spam": 0 }, ... ]
    for example: given "Review 5: Generally good."
    return { "review": 5, "firstword" : Generally, "satisfied": 1, "relevant": 1, "spam": 0 }'''
```
ChatGPT API will return a JSON-format file to be directly appended to combined_reviews.csv.
    
   
   
Data will be loaded and sliced by
```python
df = pd.read_csv("combined_reviews.csv")

texts = df["text"].astype(str).tolist()
labels = df[["satisfied", "relevant", "spam"]].astype(int).values.tolist()
```

###  Tokenize
```python
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
encodings = tokenizer(texts, truncation=True, padding=True, max_length=512)
```

### Feed into transformer
```python
from transformers import TrainingArguments, Trainer

training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=2,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    logging_dir="./logs",
    logging_steps=10,
    eval_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="eval_loss"
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
)
trainer.train()
```


###  Save the trained model
```python
model.save_pretrained("saved_multilabel_model/")
tokenizer.save_pretrained("saved_multilabel_model/")
```

---

## Inference Example

```python
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
```

---

## Frontend & Backend

The model is integrated into:

- Flask API for backend inference

- React UI for real-time input and prediction

- Backend Deployment on [`Render`](https://google-review-filter-1.onrender.com), Frontend Deployment on [`Vercel`](https://google-review-filter.vercel.app/)

---

## Metrics
- Loss: Binary Cross Entropy

- Evaluation Strategy: Epoch-based

- Model Type: BERT with Sigmoid for multi-label output

---

## Author

- Made by [`Zhongmin`](https://github.com/fated-dd)
- Based on Hugging Face Transformers and PyTorch.