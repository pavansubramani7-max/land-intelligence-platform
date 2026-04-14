import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

export default function ValuationCard({ record }) {
  const recColor = record.recommendation === "BUY" ? "#2e7d32" : record.recommendation === "AVOID" ? "#c62828" : "#f57f17";
  return (
    <View style={styles.card}>
      <Text style={styles.survey}>{record.land_id?.survey_number || "—"}</Text>
      <Text style={styles.price}>₹{record.predicted_price?.toLocaleString("en-IN")}</Text>
      <Text style={[styles.rec, { color: recColor }]}>{record.recommendation || "HOLD"}</Text>
    </View>
  );
}

ValuationCard.propTypes = { record: PropTypes.object.isRequired };

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 14, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  survey: { fontWeight: "600", fontSize: 14, flex: 1 },
  price: { color: "#1a237e", fontWeight: "700", fontSize: 15 },
  rec: { fontWeight: "800", fontSize: 14, marginLeft: 12 },
});
