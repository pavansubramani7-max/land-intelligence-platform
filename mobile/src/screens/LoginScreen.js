import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { api } from "../services/api";
import { storage } from "../utils/storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Error", "Please fill all fields");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      await storage.setToken(data.data.token);
      navigation.replace("Main");
    } catch (err) {
      Alert.alert("Login Failed", err.response?.data?.message || "Invalid credentials");
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏔️ Land Intelligence</Text>
      <Text style={styles.subtitle}>AI-Powered Analytics</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Sign In</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#f5f7fa" },
  title: { fontSize: 28, fontWeight: "800", color: "#1a237e", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#6b7280", textAlign: "center", marginBottom: 32 },
  input: { backgroundColor: "#fff", borderRadius: 10, padding: 14, marginBottom: 12, fontSize: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  btn: { backgroundColor: "#1a237e", borderRadius: 10, padding: 16, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
