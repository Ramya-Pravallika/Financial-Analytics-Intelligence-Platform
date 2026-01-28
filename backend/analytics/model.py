# analytics/model.py
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from joblib import dump, load
import os
from dotenv import load_dotenv

load_dotenv()
MODEL_PATH = os.getenv("MODEL_PATH", "./models/isolation_forest.joblib")

def prepare_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create numeric features for anomaly detection:
    expects columns: amount, timestamp, merchant, category, account_id (user_id)
    """
    df_local = df.copy()
    # Timestamp to hour/day/month
    if 'timestamp' in df_local.columns:
        df_local['timestamp'] = pd.to_datetime(df_local['timestamp'], errors='coerce')
        df_local['hour'] = df_local['timestamp'].dt.hour.fillna(0).astype(int)
        df_local['day'] = df_local['timestamp'].dt.day.fillna(0).astype(int)
        df_local['month'] = df_local['timestamp'].dt.to_period('M').astype(str)
        # Convert month to numeric index
        df_local['month_index'] = pd.to_datetime(df_local['timestamp']).dt.month.fillna(0).astype(int)
    else:
        df_local['hour'] = 0
        df_local['day'] = 0
        df_local['month_index'] = 0

    # amount
    df_local['amount'] = pd.to_numeric(df_local.get('amount', 0), errors='coerce').fillna(0.0)

    # frequency encoding for categorical fields
    for col in ['merchant', 'category', 'account_id', 'user_id']:
        if col in df_local.columns:
            freq = df_local[col].value_counts(normalize=True)
            df_local[col + '_freq'] = df_local[col].map(freq).fillna(0.0)
    features = ['amount','hour','day','month_index'] + [c for c in df_local.columns if c.endswith('_freq')]
    # ensure features exist
    features = [f for f in features if f in df_local.columns]
    X = df_local[features].fillna(0.0)
    return X

def train_model(df: pd.DataFrame, n_estimators: int = 100) -> str:
    X = prepare_features(df)
    scaler = StandardScaler()
    Xs = scaler.fit_transform(X)
    model = IsolationForest(n_estimators=n_estimators, contamination=0.02, random_state=42)
    model.fit(Xs)
    # Persist scaler, model and features
    dirpath = os.path.dirname(MODEL_PATH)
    if dirpath and not os.path.exists(dirpath):
        os.makedirs(dirpath, exist_ok=True)
    dump({'model': model, 'scaler': scaler, 'features': list(X.columns)}, MODEL_PATH)
    return MODEL_PATH

def load_model():
    if not os.path.exists(MODEL_PATH):
        return None
    obj = load(MODEL_PATH)
    return obj

def predict_with_scores(df: pd.DataFrame):
    """
    Returns dataframe with:
      - anomaly (1 if anomaly else 0)
      - raw_score (decision_function)
      - risk (scaled 0-1 where higher is more risky)
    """
    obj = load_model()
    if obj is None:
        raise RuntimeError("Model not trained")
    features = obj['features']
    X = prepare_features(df)
    # ensure same columns
    X = X.reindex(columns=features, fill_value=0.0)
    Xs = obj['scaler'].transform(X)
    model = obj['model']
    preds = model.predict(Xs)  # -1 anomaly, 1 normal
    raw_scores = model.decision_function(Xs)  # higher = more normal
    # Convert decision_function to risk: invert & scale to 0-1
    # lower decision_function -> more anomalous -> higher risk
    # risk_raw = -raw_scores
    # scale to 0..1
    min_s = raw_scores.min()
    max_s = raw_scores.max()
    if max_s - min_s == 0:
        norm = (raw_scores - min_s) * 0.0
    else:
        norm = (raw_scores - min_s) / (max_s - min_s)
    # norm: 0 = most anomalous, 1 = most normal -> invert
    risk = 1.0 - norm
    df_out = df.copy()
    df_out['anomaly'] = (preds == -1).astype(int)
    df_out['raw_score'] = raw_scores.tolist()
    df_out['risk_score'] = risk.tolist()
    return df_out
