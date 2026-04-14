import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { api } from "../services/api";
import ValuationCard from "../components/ValuationCard";

export default function DashboardScreen({ navigation }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get("/valuation/history").then((r) => setHistory(r.data.data || [])).catch(() => {});
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.statsRow}>
        {[["Valuations", history.length], ["BUY", history.filter((r) => r.recommendation === "BUY").length], ["AVOID", history.filter((r) => r.recommendation === "AVOID").length]].map(([l, v]) => (
          <View key={l} style={styles.statCard}>
            <Text style={styles.statValue}>{v}</Text>
            <Text style={styles.statLabel}>{l}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.sectionTitle}>Recent Valuations</Text>
      {history.slice(0, 5).map((r) => <ValuationCard key={r._id} record={r} />)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa", padding: 16 },
  title: { fontSize: 24, fontWeight: "800", color: "#1a237e", marginBottom: 16 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: "#fff", borderRadius: 12, padding: 16, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statValue: { fontSize: 24, fontWeight: "800", color: "#1a237e" },
  statLabel: { fontSize: 12, color: "#6b7280", marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
});
