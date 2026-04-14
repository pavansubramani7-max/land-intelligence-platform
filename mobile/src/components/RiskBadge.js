import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

const COLORS = { Low: "#2e7d32", Medium: "#f57f17", High: "#c62828", Critical: "#6a1b9a" };

export default function RiskBadge({ score, category }) {
  const color = COLORS[category] || "#666";
  return (
    <View style={[styles.container, { borderColor: color }]}>
      <Text style={[styles.score, { color }]}>{score}</Text>
      <Text style={[styles.category, { color }]}>{category} Risk</Text>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${score}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

RiskBadge.propTypes = { score: PropTypes.number, category: PropTypes.string };

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", borderRadius: 12, padding: 20, marginTop: 16, alignItems: "center", borderWidth: 2 },
  score: { fontSize: 36, fontWeight: "800" },
  category: { fontSize: 16, fontWeight: "600", marginTop: 4 },
  bar: { width: "100%", height: 8, backgroundColor: "#e5e7eb", borderRadius: 4, marginTop: 12, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 4 },
});
