import pytest
from app.utils.geo_utils import haversine_distance, calculate_proximity_score


def test_haversine_same_point():
    dist = haversine_distance(28.6, 77.2, 28.6, 77.2)
    assert dist == pytest.approx(0.0, abs=0.001)


def test_haversine_known_distance():
    dist = haversine_distance(28.6139, 77.2090, 19.0760, 72.8777)
    assert 1100 < dist < 1200


def test_proximity_score_no_amenities():
    score = calculate_proximity_score(28.6, 77.2, [])
    assert score == 50.0


def test_proximity_score_nearby():
    amenities = [(28.61, 77.21), (28.62, 77.22)]
    score = calculate_proximity_score(28.6, 77.2, amenities)
    assert 0 <= score <= 100
