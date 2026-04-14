import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

from app.ml.train_valuation import train_valuation_models
from app.ml.train_dispute import train_dispute_models
from app.ml.train_fraud import train_fraud_models
from app.ml.train_forecast import train_forecast_models

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'sample_land_data.csv')


def main():
    print("=" * 60)
    print("LAND INTELLIGENCE PLATFORM - MODEL TRAINING")
    print("=" * 60)

    if not os.path.exists(DATA_PATH):
        print("Data file not found. Generating synthetic data first...")
        import importlib.util
        spec = importlib.util.spec_from_file_location(
            "generate", os.path.join(os.path.dirname(__file__), "generate_synthetic_data.py")
        )
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)

    print("\n[1/4] Training Valuation Models (RF + XGBoost + ANN)...")
    try:
        metrics = train_valuation_models(DATA_PATH)
        print(f"  Ensemble R²: {metrics['ensemble']['r2']:.4f}")
    except Exception as e:
        print(f"  ERROR: {e}")

    print("\n[2/4] Training Dispute Risk Models...")
    try:
        train_dispute_models(DATA_PATH)
        print("  Done.")
    except Exception as e:
        print(f"  ERROR: {e}")

    print("\n[3/4] Training Fraud Detection Models...")
    try:
        train_fraud_models(DATA_PATH)
        print("  Done.")
    except Exception as e:
        print(f"  ERROR: {e}")

    print("\n[4/4] Training Forecast Models (ARIMA)...")
    try:
        train_forecast_models(DATA_PATH)
        print("  Done.")
    except Exception as e:
        print(f"  ERROR: {e}")

    print("\n" + "=" * 60)
    print("ALL MODELS TRAINED SUCCESSFULLY")
    print("Models saved to: backend/models/")
    print("=" * 60)


if __name__ == "__main__":
    main()
