"""Feature engineering: encoding + scaling + imputation."""
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler


class Preprocessor:
    def __init__(self, cat_cols: list, num_cols: list):
        self.cat_cols = cat_cols
        self.num_cols = num_cols
        self.encoders = {c: LabelEncoder() for c in cat_cols}
        self.scaler = StandardScaler()
        self._fitted = False

    def fit_transform(self, df: pd.DataFrame) -> np.ndarray:
        df = df.copy()
        # Impute
        for c in self.num_cols:
            df[c] = df[c].fillna(df[c].median())
        for c in self.cat_cols:
            df[c] = df[c].fillna(df[c].mode()[0])
            df[c] = self.encoders[c].fit_transform(df[c].astype(str))
        X = df[self.cat_cols + self.num_cols].values.astype(float)
        self._fitted = True
        return self.scaler.fit_transform(X)

    def transform(self, df: pd.DataFrame) -> np.ndarray:
        df = df.copy()
        for c in self.num_cols:
            df[c] = df[c].fillna(0)
        for c in self.cat_cols:
            df[c] = df[c].fillna("unknown")
            try:
                df[c] = self.encoders[c].transform(df[c].astype(str))
            except ValueError:
                df[c] = 0
        X = df[self.cat_cols + self.num_cols].values.astype(float)
        return self.scaler.transform(X)
