import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { api } from "../services/api";
import RiskBadge from "../components/RiskBadge";

export default function RiskScreen() {
  const [form, setForm] = useState({ ownership_changes_count: "0", litigation_history_count: "0" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const assess = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/risk/assess", { ownership_changes_count: Number(form.ownership_changes_count), litigation_history_count: Number(form.litigation_history_count), survey_conflict: false, boundary_disputes: false, multiple_claimants: false });
      setResult(data.data);
    } catch { Alert.alert("Error", "Assessment failed"); }
    finally { setLoading(false); }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Risk Assessment</Text>
      {[["Ownership Changes", "ownership_changes_count"], ["Litigation Count", "litigation_history_count"]].map(([l, k]) => (
        <View key={k} style={styles.formGroup}>
          <Text style={styles.label}>{l}</Text>
          <TextInput style={styles.input} value={form[k]} onChangeText={(v) => setForm({ ...form, [k]: v })} keyboardType="numeric" />
        </View>
      ))}
      <TouchableOpacity style={styles.btn} onPress={assess} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Assess Risk</Text>}
      </TouchableOpacity>
      {result && <RiskBadge score={result.risk_score} category={result.risk_category} />}
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
});
