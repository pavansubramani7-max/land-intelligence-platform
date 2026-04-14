import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { api } from "../services/api";

const LAND_TYPES = ["agricultural", "residential", "commercial", "industrial"];
const ZONES = ["A", "B", "C", "D"];

export default function ValuationScreen() {
  const [form, setForm] = useState({ survey_number: "", area_sqft: "", land_type: "residential", zone: "A", infrastructure_score: "5", district: "Mumbai", near_water: false, near_highway: false, road_access: true });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/valuation/predict", { ...form, area_sqft: Number(form.area_sqft), infrastructure_score: Number(form.infrastructure_score) });
      setResult(data.data);
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Valuation failed");
    } finally { setLoading(false); }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AI Valuation</Text>
      {[["Survey Number", "survey_number", "default"], ["Area (sq.ft)", "area_sqft", "numeric"], ["District", "district", "default"]].map(([label, key, kb]) => (
        <View key={key} style={styles.formGroup}>
          <Text style={styles.label}>{label}</Text>
          <TextInput style={styles.input} value={form[key]} onChangeText={(v) => setForm({ ...form, [key]: v })} keyboardType={kb} />
        </View>
      ))}
      <TouchableOpacity style={styles.btn} onPress={handlePredict} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>🤖 Get Valuation</Text>}
      </TouchableOpacity>
      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultPrice}>₹{result.predicted_price?.toLocaleString("en-IN")}</Text>
          <Text style={styles.resultLabel}>Predicted Price</Text>
          <Text style={[styles.recommendation, { color: result.recommendation?.action === "BUY" ? "#2e7d32" : result.recommendation?.action === "AVOID" ? "#c62828" : "#f57f17" }]}>
            {result.recommendation?.action || "HOLD"}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa", padding: 16 },
  title: { fontSize: 22, fontWeight: "800", color: "#1a237e", marginBottom: 16 },
  formGroup: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 4, color: "#374151" },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 12, borderWidth: 1, borderColor: "#e5e7eb", fontSize: 15 },
  btn: { backgroundColor: "#1a237e", borderRadius: 10, padding: 16, alignItems: "center", marginTop: 8 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  resultCard: { backgroundColor: "#fff", borderRadius: 12, padding: 20, marginTop: 16, alignItems: "center" },
  resultPrice: { fontSize: 28, fontWeight: "800", color: "#1a237e" },
  resultLabel: { color: "#6b7280", marginTop: 4 },
  recommendation: { fontSize: 22, fontWeight: "800", marginTop: 12 },
});
