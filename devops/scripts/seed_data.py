"""
Seed MongoDB with sample land records and a default admin user.
Run: python devops/scripts/seed_data.py
"""
import os
import sys
import asyncio
from datetime import datetime, timedelta
import random

# Requires: pip install motor bcrypt
try:
    import motor.motor_asyncio
    import bcrypt
except ImportError:
    print("Install: pip install motor bcrypt")
    sys.exit(1)

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/land_intelligence")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
db = client.land_intelligence

DISTRICTS = ["Mumbai", "Pune", "Nashik", "Nagpur", "Aurangabad"]
LAND_TYPES = ["agricultural", "residential", "commercial", "industrial"]
ZONES = ["A", "B", "C", "D"]


async def seed():
    print("Seeding database...")

    # Admin user
    existing = await db.users.find_one({"email": "admin@landiq.com"})
    if not existing:
        hashed = bcrypt.hashpw(b"admin123", bcrypt.gensalt()).decode()
        await db.users.insert_one({
            "name": "Admin User",
            "email": "admin@landiq.com",
            "password": hashed,
            "role": "admin",
            "isVerified": True,
            "createdAt": datetime.utcnow(),
        })
        print("  ✓ Admin user created (admin@landiq.com / admin123)")

    # Land records
    count = await db.landrecords.count_documents({})
    if count < 10:
        records = []
        for i in range(50):
            district = random.choice(DISTRICTS)
            records.append({
                "survey_number": f"SRV-{1000 + i}",
                "location": {
                    "lat": 18.5 + random.uniform(-1, 2),
                    "lng": 73.8 + random.uniform(-1, 2),
                    "district": district,
                    "state": "Maharashtra",
                },
                "area_sqft": random.randint(500, 50000),
                "land_type": random.choice(LAND_TYPES),
                "zone": random.choice(ZONES),
                "infrastructure_score": random.randint(1, 10),
                "near_water": random.choice([True, False]),
                "near_highway": random.choice([True, False]),
                "road_access": random.choice([True, False]),
                "is_disputed": random.random() < 0.15,
                "price_history": [{"price": random.randint(500000, 10000000), "date": datetime.utcnow() - timedelta(days=random.randint(0, 365))}],
                "createdAt": datetime.utcnow(),
            })
        await db.landrecords.insert_many(records)
        print(f"  ✓ {len(records)} land records seeded")

    print("✅ Seeding complete!")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
