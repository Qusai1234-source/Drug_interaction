import re
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout, GRU, Embedding, Bidirectional
from tensorflow.keras.optimizers import RMSprop
from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score, confusion_matrix
from keras.models import load_model
import pickle
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('punkt_tab')
with open(r'C:\Projects\Drug_interaction\model\tokenizer.pkl', 'rb') as f:
    tokenizer = pickle.load(f)
model=load_model(r'C:\Projects\Drug_interaction\model\drug_classification_model.h5')
def preprocess_text(text, tokenizer):
    """ Preprocess input text for prediction. """
    stop_words = set(stopwords.words('english'))

    words = word_tokenize(text)
    processed_text = ' '.join([word for word in words if word.lower() not in stop_words])

    sequence = tokenizer.texts_to_sequences([processed_text])
    max_length=max(len(seq) for seq in sequence)
    padded_sequence = pad_sequences(sequence, maxlen=max_length, padding='post')

    return padded_sequence

new_text = "Warfarin	CYP2C9*3"

processed_input = preprocess_text(new_text, tokenizer)
prediction = model.predict(processed_input)
print(prediction)
