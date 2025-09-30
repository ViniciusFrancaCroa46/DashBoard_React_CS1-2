import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { equipamentoService } from "../services/api";

const getStatusInfo = (status) => {
  switch (status) {
    case 0:
      return { color: "red", label: "Desligado" };
    case 1:
      return { color: "green", label: "Ligado" };
    case 2:
      return { color: "yellow", label: "Em andamento" };
    default:
      return { color: "gray", label: "Desconhecido" };
  }
};

export default function HomeScreen() {
  const [equipamentos, setEquipamentos] = useState([]);

  // Adiciona consumo inicial a cada equipamento
  useEffect(() => {
    equipamentoService
      .getEA()
      .then((response) => {
        const dataComConsumo = response.data.map((e) => ({
          ...e,
          consumo: 0.0, // consumo inicial
        }));
        setEquipamentos(dataComConsumo);
      })
      .catch((error) => {
        console.error("Erro ao buscar equipamentos:", error);
      });
  }, []);

  // Simula consumo aleatório
  const simularConsumo = () => {
    setEquipamentos((prev) =>
      prev.map((e) => {
        // só aumenta se estiver ligado/andamento
        if (e.status === 1 || e.status === 2) {
          return { ...e, consumo: parseFloat((e.consumo + Math.random() * 0.5).toFixed(2)) };
        }
        return e;
      })
    );
  };

  const renderEquipamento = (item) => {
    const status = getStatusInfo(item.status);
    return (
      <View key={item.id} style={styles.equipamentoBox}>
        <Text style={styles.infoText}>
          Id: {item.id} Setor: {item.setor}
        </Text>
        <View style={styles.row}>
          <View style={[styles.statusCircle, { backgroundColor: status.color }]} />
          <Text style={styles.statusLabel}>{status.label}</Text>
        </View>
        <Text style={styles.consumo}>{item.consumo.toFixed(2)} kW/h</Text>
      </View>
    );
  };

  const esteiras = equipamentos.filter((e) => e.tipo === "esteira");
  const agvs = equipamentos.filter((e) => e.tipo === "AGV");

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Registro do consumo de energia dos setores</Text>

      <View style={styles.listaContainer}>
        <Text style={styles.titulo}>Esteiras</Text>
        <View style={styles.grid}>
          {esteiras.map((item) => renderEquipamento(item))}
        </View>

        <Text style={styles.titulo}>AGV's</Text>
        <View style={styles.grid}>
          {agvs.map((item) => renderEquipamento(item))}
        </View>
      </View>

      <TouchableOpacity style={styles.btnSimular} onPress={simularConsumo}>
        <Text style={styles.btnText}>Simular Consumo</Text>
      </TouchableOpacity>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  equipamentoBox: {
    width: "48%",
    backgroundColor: "#c2c7d1",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  infoText: { fontSize: 14, color: "#000", marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "center" },
  statusCircle: { width: 14, height: 14, borderRadius: 7, marginRight: 6 },
  statusLabel: { fontSize: 14, color: "#000" },
  consumo: { marginTop: 6, fontWeight: "bold", color: "#000" },
  btnSimular: {
    marginTop: 20,
    backgroundColor: "#d49f5f",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#000", fontWeight: "bold" },
});
