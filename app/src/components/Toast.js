import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Toast({ message, type }) {
  return (
    <View
      style={[
        styles.toast,
        type === "success" ? styles.success : styles.error,
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
    borderRadius: 5,
    zIndex: 999,
    minWidth: 200,
  },
  text: { color: "white", fontWeight: "bold" },
  success: { backgroundColor: "green" },
  error: { backgroundColor: "red" },
});
