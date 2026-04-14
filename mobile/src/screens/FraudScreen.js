import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { api } from "../services/api";

export default function FraudScreen() {
  const [form, setForm] = useState({ price_change_pct: "0", days_since_last_sale: "365", ownership_changes_30d: "0", price_vs_area_median_ratio: "1.0" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const detect = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/fraud/detect", { price_change_pct: Number(form.price_change_pct), days_since_last_sale: Number(form.days_since_last_sale), ownership_changes_30d: Number(form.ownership_changes_30d), price_vs_area_median_ratio: Number(form.price_vs_area_median_ratio) });
      setResult(data.data);
    } catch { Alert.alert("Error", "Detection failed"); }
    finally { setLoading(false); }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fraud Detection</Text>
      {[["Price Change %", "price_change_pct"], ["Days Since Last Sale", "days_since_last_sale"], ["Ownership Changes (30d)", "ownership_changes_30d"], ["Price vs Median Ratio", "price_vs_area_median_ratio"]].map(([l, k]) => (
        <View key={k} style={styles.formGroup}>
          <Text style={styles.label}>{l}</Text>
          <TextInput style={styles.input} value={form[k]} onChangeText={(v) => setForm({ ...form, [k]: v })} keyboardType="numeric" />
        </View>
      ))}
      <TouchableOpacity style={styles.btn} onPress={detect} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Detect Fraud</Text>}
      </TouchableOpacity>
      {result && (
        <View style={[styles.resultCard, { borderColor: result.is_fraud ? "#c62828" : "#4caf50" }]}>
          <Text style={{ fontSize: 20, fontWeight: "800", color: result.is_fraud ? "#c62828" : "#2e7d32" }}>
            {result.is_fraud ? "⚠️ FRAUD DETECTED" : "✅ NORMAL"}
          </Text>
          <Text style={{ color: "#6b7280", marginTop: 8 }}>Probability: {(result.fraud_probability * 100).toFixed(1)}%</Text>
          <Text style={{ color: "#6b7280" }}>Type: {result.fraud_type}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa", padding: 16 },
  title: { fontSize: 22, fontWeight: "800", color: "#1a237e", marginBottom: 16 },
  formGroup: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 4 },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 12, borderWidth: 1, borderColor: "#e5e7eb" },
  btn: { backgroundColor: "#1a237e", borderRadius: 10, padding: 16, alignItems: "center", marginTop: 8 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  resultCard: { backgroundColor: "#fff", borderRadius: 12, padding: 20, marginTop: 16, alignItems: "center", borderWidth: 2 },
});
