import os
import json
import joblib
from datetime import datetime
from typing import Any, Dict, Optional
from pathlib import Path

# Resolve models dir: prefer env var, then look for repo-root models/, then backend/models/
_env_override = os.environ.get("MODELS_DIR", "").strip()
if _env_override:
    MODELS_DIR = Path(_env_override)
else:
    _default = Path(__file__).resolve().parents[3] / "models"
    MODELS_DIR = _default


def save_model(model: Any, name: str, metadata: Optional[Dict] = None) -> str:
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    version = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{name}_v{version}.joblib"
    filepath = MODELS_DIR / filename
    joblib.dump(model, filepath)

    meta = metadata or {}
    meta.update({"name": name, "version": version, "filename": filename, "saved_at": version})
    meta_path = MODELS_DIR / f"{name}_latest.json"
    with open(meta_path, "w") as f:
        json.dump(meta, f, indent=2)

    latest_path = MODELS_DIR / f"{name}_latest.joblib"
    joblib.dump(model, latest_path)
    return str(filepath)


def load_model(name: str, version: Optional[str] = None) -> Any:
    if version:
        filepath = MODELS_DIR / f"{name}_v{version}.joblib"
    else:
        filepath = MODELS_DIR / f"{name}_latest.joblib"
    if not filepath.exists():
        raise FileNotFoundError(f"Model {name} not found at {filepath}")
    return joblib.load(filepath)


def get_model_metadata(name: str) -> Optional[Dict]:
    meta_path = MODELS_DIR / f"{name}_latest.json"
    if not meta_path.exists():
        return None
    with open(meta_path) as f:
        return json.load(f)


def list_models() -> Dict[str, Any]:
    if not MODELS_DIR.exists():
        return {}
    models = {}
    for meta_file in MODELS_DIR.glob("*_latest.json"):
        name = meta_file.stem.replace("_latest", "")
        with open(meta_file) as f:
            models[name] = json.load(f)
    return models
