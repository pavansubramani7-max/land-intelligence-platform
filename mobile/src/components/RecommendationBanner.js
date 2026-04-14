import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

const CONFIG = {
  BUY: { bg: "#e8f5e9", color: "#2e7d32", icon: "✅" },
  HOLD: { bg: "#fff8e1", color: "#f57f17", icon: "⏸️" },
  AVOID: { bg: "#ffebee", color: "#c62828", icon: "🚫" },
};

export default function RecommendationBanner({ action, confidence, reason }) {
  const cfg = CONFIG[action] || CONFIG.HOLD;
  return (
    <View style={[styles.container, { backgroundColor: cfg.bg }]}>
      <Text style={styles.icon}>{cfg.icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.action, { color: cfg.color }]}>{action}</Text>
        {reason && <Text style={styles.reason}>{reason}</Text>}
      </View>
      {confidence !== undefined && <Text style={[styles.confidence, { color: cfg.color }]}>{(confidence * 100).toFixed(0)}%</Text>}
    </View>
  );
}

RecommendationBanner.propTypes = { action: PropTypes.string.isRequired, confidence: PropTypes.number, reason: PropTypes.string };

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", borderRadius: 12, padding: 16, gap: 12 },
  icon: { fontSize: 24 },
  action: { fontSize: 20, fontWeight: "800" },
  reason: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  confidence: { fontSize: 18, fontWeight: "700" },
});
