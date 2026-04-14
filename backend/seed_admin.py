import sys
sys.path.insert(0, ".")
from app.database import SessionLocal, Base, engine
from app.models.user import User
from app.models.land import LandRecord
from app.utils.security import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()

users_to_seed = [
    dict(name="Admin", email="admin@landiq.com", password="admin1234", role="admin"),
    dict(name="Analyst", email="analyst@landiq.com", password="analyst1234", role="analyst"),
    dict(name="Demo User", email="demo@landiq.com", password="demo1234", role="viewer"),
]

for u_data in users_to_seed:
    existing = db.query(User).filter(User.email == u_data["email"]).first()
    if existing:
        print(f"  exists: {u_data['email']}")
    else:
        u = User(
            name=u_data["name"],
            email=u_data["email"],
            hashed_password=hash_password(u_data["password"]),
            role=u_data["role"],
            is_active=True,
            is_verified=True,
        )
        db.add(u)
        db.commit()
        db.refresh(u)
        print(f"  created: {u_data['email']} (id={u.id})")

# Seed a sample land record owned by admin
admin = db.query(User).filter(User.email == "admin@landiq.com").first()
if admin and db.query(LandRecord).count() == 0:
    from app.models.land import ZoneType
    lands = [
        LandRecord(title="Whitefield Plot", location="Whitefield, Bangalore", latitude=12.9698,
                   longitude=77.7500, area_sqft=2400, zone_type=ZoneType.residential,
                   road_proximity_km=0.5, infrastructure_score=82, year_established=2015,
                   soil_type="loam", flood_risk=False, market_price=4800000, owner_id=admin.id),
        LandRecord(title="Koramangala Commercial", location="Koramangala, Bangalore", latitude=12.9352,
                   longitude=77.6245, area_sqft=1800, zone_type=ZoneType.commercial,
                   road_proximity_km=0.2, infrastructure_score=91, year_established=2010,
                   soil_type="clay", flood_risk=False, market_price=12000000, owner_id=admin.id),
        LandRecord(title="Yelahanka Agricultural", location="Yelahanka, Bangalore", latitude=13.1007,
                   longitude=77.5963, area_sqft=10000, zone_type=ZoneType.agricultural,
                   road_proximity_km=3.0, infrastructure_score=45, year_established=2000,
                   soil_type="loam", flood_risk=True, market_price=2500000, owner_id=admin.id),
    ]
    for land in lands:
        db.add(land)
    db.commit()
    print(f"  seeded {len(lands)} land records")

db.close()
print("\nDone! Login credentials:")
print("  admin@landiq.com   / admin1234   (role: admin)")
print("  analyst@landiq.com / analyst1234 (role: analyst)")
print("  demo@landiq.com    / demo1234    (role: viewer)")
