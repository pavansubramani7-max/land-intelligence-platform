import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { api } from "../services/api";

export default function ReportScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get("/valuation/history").then((r) => setHistory(r.data.data || [])).catch(() => {});
  }, []);

  const handleDownload = (id) => Alert.alert("Report", `PDF download for ${id} — open in browser at /api/report/pdf/${id}`);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      <FlatList data={history} keyExtractor={(r) => r._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.survey}>{item.land_id?.survey_number || "—"}</Text>
              <Text style={styles.price}>₹{item.predicted_price?.toLocaleString("en-IN")}</Text>
            </View>
            <TouchableOpacity style={styles.dlBtn} onPress={() => handleDownload(item._id)}>
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>PDF</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: "#6b7280", textAlign: "center", marginTop: 40 }}>No valuations yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa", padding: 16 },
  title: { fontSize: 22, fontWeight: "800", color: "#1a237e", marginBottom: 16 },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 14, marginBottom: 10, flexDirection: "row", alignItems: "center" },
  survey: { fontWeight: "600", fontSize: 14 },
  price: { color: "#1a237e", fontWeight: "700", fontSize: 16, marginTop: 2 },
  dlBtn: { backgroundColor: "#1a237e", borderRadius: 8, padding: 10 },
});
