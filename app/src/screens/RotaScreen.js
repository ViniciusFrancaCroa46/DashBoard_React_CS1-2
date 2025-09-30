import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { produtoService } from "../services/api";
import { Ionicons } from "@expo/vector-icons";

const getStatusInfo = (status) => {
  switch (status) {
    case "em movimento":
      return { color: "yellow", label: "em movimento" };
    case "entregue":
      return { color: "green", label: "entregue" };
    default:
      return { color: "gray", label: "desconhecido" };
  }
};

export default function RegistroRotaScreen() {
  const [produtos, setProdutos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    produtoService
      .getProd()
      .then((response) => {
        setProdutos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar produtos:", error);
      });
  }, []);

  const handleOpenRota = (item) => {
    // envia params para a rota /rotaProduto
    router.push({
      pathname: "/rotaProduto",
      params: {
        produtoId: String(item.id),
        codigo: item.id,
        setor: item.setor,
        dataSaida: item.dataSaida,
      },
    });
  };

  const renderProduto = (item) => {
    const status = getStatusInfo(item.status);
    return (
      <View key={item.id} style={styles.produtoBox}>
        <View style={{ flex: 1 }}>
          <Text style={styles.infoText}>Id: {item.id}</Text>
          <Text style={styles.infoText}>Setor: {item.setor}</Text>
          <Text style={styles.infoText}>Data de saída: {item.dataSaida}</Text>

          <View style={styles.row}>
            <View style={[styles.statusCircle, { backgroundColor: status.color }]} />
            <Text style={styles.statusLabel}>{status.label}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => handleOpenRota(item)}
        >
          <Ionicons name="information-circle-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Registro de rota dos produto</Text>

      <View style={styles.listaContainer}>
        <Text style={styles.titulo}>• Produtos registrados</Text>
        {produtos.map((item) => renderProduto(item))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  header: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  listaContainer: {
    borderWidth: 2,
    borderColor: "#d49f5f",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#1e1e1e",
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },
  produtoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#c2c7d1",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  infoText: { fontSize: 14, color: "#000", marginBottom: 2 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  statusCircle: { width: 14, height: 14, borderRadius: 7, marginRight: 6 },
  statusLabel: { fontSize: 14, color: "#000" },
  infoButton: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});