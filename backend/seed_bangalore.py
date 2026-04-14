"""Seed Bangalore land records with real GPS coordinates."""
import sys
sys.path.insert(0, ".")

from app.database import SessionLocal, Base, engine
from app.models.land import LandRecord, ZoneType
from app.models.user import User

Base.metadata.create_all(bind=engine)
db = SessionLocal()

admin = db.query(User).filter(User.email == "admin@landiq.com").first()
if not admin:
    print("Admin user not found. Run seed_admin.py first.")
    sys.exit(1)

# Clear existing land records
existing = db.query(LandRecord).count()
if existing >= 50:
    print(f"Already have {existing} land records. Skipping.")
    db.close()
    sys.exit(0)

BANGALORE_LANDS = [
    ("Koramangala Plot",     12.9352, 77.6245, 2400,  ZoneType.residential,  0.5,  88, 2015, "red laterite", False, 4800000),
    ("Indiranagar Villa",    12.9784, 77.6408, 1800,  ZoneType.residential,  0.3,  91, 2010, "alluvial",     False, 7200000),
    ("Whitefield IT Park",   12.9698, 77.7500, 5000,  ZoneType.commercial,   1.2,  85, 2008, "sandy loam",   False, 18000000),
    ("HSR Layout Home",      12.9116, 77.6389, 2200,  ZoneType.residential,  0.8,  86, 2012, "red laterite", False, 5500000),
    ("BTM Layout Site",      12.9166, 77.6101, 1600,  ZoneType.residential,  0.9,  83, 2018, "black cotton", False, 4200000),
    ("Marathahalli Apt",     12.9591, 77.6974, 1200,  ZoneType.residential,  1.5,  80, 2016, "rocky",        False, 3600000),
    ("Bellandur Tech",       12.9256, 77.6762, 3000,  ZoneType.commercial,   1.1,  79, 2014, "alluvial",     False, 9000000),
    ("Sarjapur Farm",        12.9010, 77.6849, 10000, ZoneType.agricultural, 2.0,  65, 2000, "red laterite", False, 5000000),
    ("Electronic City IT",   12.8399, 77.6770, 4000,  ZoneType.commercial,   1.8,  72, 2011, "rocky",        False, 10000000),
    ("Hebbal Lake View",     13.0358, 77.5970, 2800,  ZoneType.residential,  1.0,  81, 2013, "alluvial",     False, 7000000),
    ("Yelahanka New Town",   13.1007, 77.5963, 3000,  ZoneType.residential,  2.0,  74, 2017, "sandy loam",   False, 4500000),
    ("Devanahalli Airport",  13.2480, 77.7120, 5000,  ZoneType.commercial,   2.5,  70, 2019, "red laterite", False, 12000000),
    ("Malleshwaram Classic", 13.0035, 77.5710, 1500,  ZoneType.residential,  0.5,  87, 2005, "black cotton", False, 6000000),
    ("Rajajinagar Layout",   12.9900, 77.5560, 1800,  ZoneType.residential,  0.8,  84, 2008, "alluvial",     False, 5800000),
    ("Jayanagar 4th Block",  12.9308, 77.5838, 2000,  ZoneType.residential,  0.7,  88, 2003, "red laterite", False, 7500000),
    ("JP Nagar Phase 2",     12.9063, 77.5857, 2200,  ZoneType.residential,  1.0,  85, 2010, "rocky",        False, 6200000),
    ("Banashankari Temple",  12.9252, 77.5468, 1700,  ZoneType.residential,  1.1,  82, 2012, "black cotton", False, 5000000),
    ("Nagarbhavi Site",      12.9600, 77.5100, 2500,  ZoneType.residential,  1.5,  76, 2015, "alluvial",     False, 4800000),
    ("Kengeri Satellite",    12.9074, 77.4800, 3000,  ZoneType.residential,  2.0,  71, 2016, "sandy loam",   False, 3800000),
    ("Mysore Road Plot",     12.9500, 77.4800, 2000,  ZoneType.residential,  1.8,  73, 2014, "red laterite", False, 4000000),
    ("MG Road Commercial",   12.9756, 77.6197, 800,   ZoneType.commercial,   0.1,  95, 2000, "rocky",        False, 25000000),
    ("Brigade Road Shop",    12.9719, 77.6074, 600,   ZoneType.commercial,   0.1,  94, 2002, "alluvial",     False, 22000000),
    ("Sadashivanagar Bungalow",13.0100,77.5700, 4000, ZoneType.residential,  0.4,  90, 1998, "red laterite", False, 20000000),
    ("Basavanagudi Home",    12.9400, 77.5700, 1800,  ZoneType.residential,  0.6,  87, 2006, "black cotton", False, 8000000),
    ("Frazer Town Villa",    12.9800, 77.6100, 2000,  ZoneType.residential,  0.5,  85, 2008, "alluvial",     False, 9000000),
    ("Nagawara Layout",      13.0450, 77.6200, 2200,  ZoneType.residential,  1.2,  78, 2016, "sandy loam",   False, 5500000),
    ("Hennur Road Site",     13.0500, 77.6400, 2500,  ZoneType.residential,  1.5,  76, 2017, "red laterite", False, 5000000),
    ("Kalyan Nagar Plot",    13.0200, 77.6400, 1900,  ZoneType.residential,  1.0,  80, 2014, "alluvial",     False, 6000000),
    ("RT Nagar House",       13.0200, 77.5900, 1600,  ZoneType.residential,  0.9,  81, 2010, "rocky",        False, 6500000),
    ("Domlur Layout",        12.9600, 77.6380, 1500,  ZoneType.residential,  0.7,  86, 2009, "red laterite", False, 7800000),
    ("Brookefield Villa",    12.9700, 77.7200, 2600,  ZoneType.residential,  1.3,  80, 2015, "alluvial",     False, 6500000),
    ("Mahadevapura IT",      12.9900, 77.7100, 3500,  ZoneType.commercial,   1.5,  78, 2013, "sandy loam",   False, 11000000),
    ("KR Puram Site",        13.0000, 77.6900, 2000,  ZoneType.residential,  1.8,  74, 2016, "black cotton", False, 4800000),
    ("Banaswadi Plot",       13.0100, 77.6500, 1800,  ZoneType.residential,  1.2,  78, 2015, "red laterite", False, 5500000),
    ("Varthur Lake View",    12.9400, 77.7500, 2500,  ZoneType.residential,  2.0,  72, 2017, "rocky",        False, 4500000),
    ("Ejipura Layout",       12.9500, 77.6200, 1500,  ZoneType.residential,  0.7,  85, 2011, "alluvial",     False, 8500000),
    ("CV Raman Nagar",       12.9900, 77.6600, 1800,  ZoneType.residential,  0.9,  80, 2012, "red laterite", False, 7000000),
    ("Sanjaynagar Plot",     13.0200, 77.5900, 1700,  ZoneType.residential,  0.9,  80, 2013, "alluvial",     False, 6800000),
    ("Vijayanagar Site",     12.9700, 77.5300, 1800,  ZoneType.residential,  0.9,  82, 2011, "black cotton", False, 6500000),
    ("Yeshwanthpur Layout",  13.0200, 77.5400, 2000,  ZoneType.residential,  1.0,  79, 2014, "sandy loam",   False, 5800000),
    ("Peenya Industrial",    13.0300, 77.5200, 5000,  ZoneType.industrial,   2.0,  68, 2005, "rocky",        False, 8000000),
    ("Dollars Colony Home",  13.0400, 77.5900, 2200,  ZoneType.residential,  0.8,  82, 2012, "alluvial",     False, 7500000),
    ("Richmond Town Apt",    12.9600, 77.6000, 1400,  ZoneType.residential,  0.3,  91, 2008, "red laterite", False, 12000000),
    ("Langford Town Villa",  12.9600, 77.6000, 1600,  ZoneType.residential,  0.4,  89, 2006, "alluvial",     False, 11000000),
    ("Lalbagh Road Site",    12.9500, 77.5900, 1600,  ZoneType.residential,  0.5,  87, 2007, "black cotton", False, 9500000),
    ("Jigani Industrial",    12.7900, 77.6300, 8000,  ZoneType.industrial,   3.0,  62, 2010, "rocky",        False, 6000000),
    ("Bommasandra Factory",  12.8100, 77.6800, 6000,  ZoneType.industrial,   2.5,  64, 2008, "sandy loam",   False, 7000000),
    ("Chandapura Layout",    12.8200, 77.6800, 3000,  ZoneType.residential,  2.5,  64, 2016, "red laterite", False, 3500000),
    ("Begur Road Plot",      12.8700, 77.6200, 2500,  ZoneType.residential,  2.0,  72, 2015, "alluvial",     False, 4500000),
    ("Hulimavu Site",        12.8800, 77.6000, 2200,  ZoneType.residential,  1.8,  73, 2016, "black cotton", False, 4800000),
    ("Haralur Road Villa",   12.8900, 77.6800, 2400,  ZoneType.residential,  1.7,  74, 2017, "red laterite", False, 5000000),
    ("Nandi Hills Farm",     13.3700, 77.6800, 20000, ZoneType.agricultural, 5.0,  60, 2010, "rocky",        False, 8000000),
    ("Doddaballapur Land",   13.2900, 77.5400, 15000, ZoneType.agricultural, 4.0,  58, 2012, "alluvial",     False, 6000000),
    ("Magadi Road Plot",     12.9600, 77.4600, 2500,  ZoneType.residential,  2.0,  68, 2015, "sandy loam",   False, 4000000),
    ("Rajarajeshwari Site",  12.9200, 77.5000, 2200,  ZoneType.residential,  1.8,  74, 2016, "red laterite", False, 4500000),
    ("Girinagar Layout",     12.9400, 77.5500, 1700,  ZoneType.residential,  1.0,  79, 2013, "alluvial",     False, 6000000),
    ("Padmanabhanagar Home", 12.9300, 77.5500, 1900,  ZoneType.residential,  1.1,  78, 2012, "black cotton", False, 5800000),
    ("Uttarahalli Plot",     12.9000, 77.5300, 2000,  ZoneType.residential,  1.8,  71, 2017, "rocky",        False, 4200000),
    ("Subramanyapura Site",  12.9100, 77.5200, 2000,  ZoneType.residential,  1.6,  72, 2016, "sandy loam",   False, 4500000),
    ("Ejipura Commercial",   12.9500, 77.6200, 1200,  ZoneType.commercial,   0.7,  84, 2010, "alluvial",     False, 14000000),
    ("Horamavu Layout",      13.0300, 77.6600, 2000,  ZoneType.residential,  1.5,  75, 2016, "red laterite", False, 5200000),
    ("Ramamurthy Nagar",     13.0200, 77.6700, 2000,  ZoneType.residential,  1.5,  74, 2017, "black cotton", False, 5000000),
    ("Virgonagar Plot",      13.0100, 77.7000, 2500,  ZoneType.residential,  2.0,  71, 2018, "alluvial",     False, 4500000),
    ("Budigere Farm",        13.1000, 77.7500, 8000,  ZoneType.agricultural, 3.0,  63, 2015, "sandy loam",   False, 5000000),
    ("Kadugodi Layout",      12.9800, 77.7700, 2800,  ZoneType.residential,  2.5,  70, 2017, "rocky",        False, 4200000),
    ("Varthur Commercial",   12.9400, 77.7500, 2000,  ZoneType.commercial,   2.0,  72, 2016, "red laterite", False, 7000000),
    ("Carmelaram Villa",     12.8900, 77.7100, 2600,  ZoneType.residential,  2.2,  71, 2017, "alluvial",     False, 4500000),
    ("Bommanahalli Site",    12.9000, 77.6200, 2000,  ZoneType.residential,  1.5,  75, 2016, "black cotton", False, 5200000),
    ("Hongasandra Plot",     12.8900, 77.6100, 2000,  ZoneType.residential,  1.7,  72, 2017, "sandy loam",   False, 4800000),
    ("Akshayanagar Home",    12.8700, 77.6100, 2200,  ZoneType.residential,  1.8,  71, 2018, "red laterite", False, 4500000),
    ("Bilekahalli Layout",   12.8900, 77.6100, 2000,  ZoneType.residential,  1.7,  72, 2017, "alluvial",     False, 4800000),
    ("Gottigere Site",       12.8600, 77.5900, 2200,  ZoneType.residential,  2.0,  70, 2018, "rocky",        False, 4200000),
    ("Arekere Layout",       12.8800, 77.6000, 2200,  ZoneType.residential,  1.8,  71, 2017, "black cotton", False, 4500000),
    ("Attibele Farm",        12.7800, 77.7600, 10000, ZoneType.agricultural, 4.5,  58, 2014, "sandy loam",   False, 4000000),
    ("Anekal Land",          12.7100, 77.6900, 12000, ZoneType.agricultural, 5.0,  55, 2013, "red laterite", False, 3500000),
    ("Hebbagodi Industrial", 12.8300, 77.6700, 5000,  ZoneType.industrial,   2.8,  65, 2010, "rocky",        False, 5500000),
    ("Bagalur Farm",         13.1500, 77.7000, 15000, ZoneType.agricultural, 4.0,  60, 2015, "alluvial",     False, 5000000),
    ("Nelamangala Land",     13.1000, 77.3900, 10000, ZoneType.agricultural, 4.5,  55, 2014, "black cotton", False, 4000000),
    ("Dasarahalli Plot",     13.0500, 77.5100, 2500,  ZoneType.residential,  2.5,  66, 2017, "sandy loam",   False, 3800000),
    ("Jalahalli Layout",     13.0500, 77.5300, 2000,  ZoneType.residential,  1.5,  74, 2016, "red laterite", False, 5000000),
    ("Mathikere Site",       13.0300, 77.5600, 1800,  ZoneType.residential,  1.0,  78, 2015, "alluvial",     False, 5800000),
    ("HBR Layout Home",      13.0300, 77.6400, 1900,  ZoneType.residential,  1.0,  79, 2014, "black cotton", False, 6000000),
    ("Kammanahalli Plot",    13.0100, 77.6500, 1800,  ZoneType.residential,  1.1,  78, 2015, "rocky",        False, 5800000),
    ("Palace Orchards",      13.0100, 77.5800, 2500,  ZoneType.residential,  0.7,  84, 2010, "alluvial",     False, 9000000),
    ("Cunningham Road",      12.9900, 77.5900, 1400,  ZoneType.commercial,   0.2,  91, 2005, "red laterite", False, 18000000),
    ("Wilson Garden Home",   12.9500, 77.6000, 1500,  ZoneType.residential,  0.6,  85, 2008, "alluvial",     False, 9000000),
    ("Shanthinagar Apt",     12.9600, 77.6000, 1400,  ZoneType.residential,  0.5,  86, 2007, "black cotton", False, 10000000),
    ("Mysore Bank Colony",   12.9300, 77.5600, 1800,  ZoneType.residential,  1.1,  78, 2012, "sandy loam",   False, 6000000),
    ("Dollars Layout Home",  12.9200, 77.5700, 1900,  ZoneType.residential,  1.0,  79, 2013, "red laterite", False, 6200000),
    ("Bannerghatta Road",    12.8600, 77.5800, 3000,  ZoneType.residential,  2.5,  68, 2016, "alluvial",     False, 4000000),
    ("Kathriguppe Layout",   12.9300, 77.5400, 1800,  ZoneType.residential,  1.3,  76, 2014, "rocky",        False, 5500000),
    ("Kumaraswamy Layout",   12.9100, 77.5600, 1800,  ZoneType.residential,  1.2,  77, 2013, "black cotton", False, 5800000),
    ("Vivek Nagar Plot",     12.9600, 77.6300, 1700,  ZoneType.residential,  0.9,  83, 2012, "alluvial",     False, 7500000),
    ("Shivajinagar Comm",    12.9800, 77.6000, 1200,  ZoneType.commercial,   0.3,  86, 2005, "red laterite", False, 15000000),
    ("Frazer Town Comm",     12.9800, 77.6100, 1000,  ZoneType.commercial,   0.5,  84, 2007, "alluvial",     False, 13000000),
    ("Hoskote Layout",       13.0700, 77.7980, 3500,  ZoneType.residential,  3.0,  65, 2018, "sandy loam",   False, 3200000),
    ("Sarjapur Commercial",  12.9010, 77.6849, 2000,  ZoneType.commercial,   2.0,  78, 2015, "red laterite", False, 8000000),
    ("Tumkur Road Plot",     13.0600, 77.5200, 2000,  ZoneType.residential,  2.5,  68, 2017, "black cotton", False, 3500000),
    ("Bannerghatta Eco",     12.8600, 77.5800, 5000,  ZoneType.agricultural, 3.0,  65, 2015, "rocky",        False, 3000000),
]

added = 0
for title, lat, lng, area, zone, road, infra, year, soil, flood, price in BANGALORE_LANDS:
    land = LandRecord(
        title=title, location=title, latitude=lat, longitude=lng,
        area_sqft=float(area), zone_type=zone,
        road_proximity_km=road, infrastructure_score=float(infra),
        year_established=year, soil_type=soil, flood_risk=flood,
        market_price=float(price), owner_id=admin.id,
    )
    db.add(land)
    added += 1

db.commit()
print(f"Seeded {added} Bangalore land records with GPS coordinates.")
print(f"Total land records: {db.query(LandRecord).count()}")
db.close()
