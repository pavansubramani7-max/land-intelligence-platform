import networkx as nx
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from datetime import date, timedelta

from app.models.ownership import OwnershipHistory


def build_ownership_graph(land_id: int, db: Session) -> nx.DiGraph:
    records = (
        db.query(OwnershipHistory)
        .filter(OwnershipHistory.land_id == land_id)
        .order_by(OwnershipHistory.transfer_date)
        .all()
    )

    G = nx.DiGraph()
    for i, record in enumerate(records):
        G.add_node(record.owner_name, transfer_date=str(record.transfer_date),
                   transfer_price=record.transfer_price)
        if i > 0:
            prev = records[i - 1]
            days_diff = (record.transfer_date - prev.transfer_date).days
            G.add_edge(prev.owner_name, record.owner_name,
                       land_id=land_id, days_between=days_diff,
                       transfer_date=str(record.transfer_date))
    return G


def detect_circular_patterns(G: nx.DiGraph) -> List[List[str]]:
    try:
        cycles = list(nx.simple_cycles(G))
        return cycles
    except Exception:
        return []


def detect_suspicious_transfers(G: nx.DiGraph, threshold_days: int = 90) -> List[Dict]:
    suspicious = []
    for u, v, data in G.edges(data=True):
        if data.get("days_between", 999) < threshold_days:
            suspicious.append({
                "from_owner": u,
                "to_owner": v,
                "days_between": data["days_between"],
                "transfer_date": data.get("transfer_date"),
            })
    return suspicious


def compute_ownership_risk_score(cycles: List, suspicious: List) -> float:
    score = 0.0
    score += len(cycles) * 30.0
    score += len(suspicious) * 15.0
    return min(100.0, score)


def graph_to_json(G: nx.DiGraph) -> Dict[str, Any]:
    return {
        "nodes": [{"id": n, **G.nodes[n]} for n in G.nodes()],
        "edges": [{"source": u, "target": v, **d} for u, v, d in G.edges(data=True)],
    }


def analyze_ownership(land_id: int, db: Session) -> Dict[str, Any]:
    G = build_ownership_graph(land_id, db)
    cycles = detect_circular_patterns(G)
    suspicious = detect_suspicious_transfers(G)
    risk_score = compute_ownership_risk_score(cycles, suspicious)

    return {
        "land_id": land_id,
        "graph": graph_to_json(G),
        "circular_patterns": cycles,
        "suspicious_transfers": suspicious,
        "risk_score": risk_score,
        "total_owners": G.number_of_nodes(),
        "total_transfers": G.number_of_edges(),
    }
