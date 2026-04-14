import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { api } from "../services/api";

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [heatPoints, setHeatPoints] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }
    })();
    api.get("/geo/heatmap").then((r) => setHeatPoints(r.data.data || [])).catch(() => {});
  }, []);

  const region = location
    ? { latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.1, longitudeDelta: 0.1 }
    : { latitude: 19.076, longitude: 72.877, latitudeDelta: 0.5, longitudeDelta: 0.5 };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation>
        {location && <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="Your Location" />}
        {heatPoints.map((p, i) => (
          <Circle key={i} center={{ latitude: p.lat, longitude: p.lng }}
            radius={500} fillColor={p.intensity > 0.7 ? "rgba(198,40,40,0.3)" : "rgba(76,175,80,0.3)"}
            strokeColor="transparent" />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
