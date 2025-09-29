import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { produtoService } from "../services/api";

export default function ColetaScreen() {
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const { data } = await produtoService.getProd();
        console.log("Produtos recebidos da API:", data); // debug
        setProdutos(data); // talvez precise de data.content, depende do backend
      } catch (error) {
        console.error("Erro ao buscar produtos:", error.message);
      }
    };
    fetchProdutos();
  }, []);

  const getStatusInfo = (status) => {
    switch (status) {
      case "em movimento":
        return { color: "yellow", label: "em movimento" };
      case "entregue":
        return { color: "green", label: "entregue" };
      case "em estoque":
        return { color: "red", label: "em estoque" };
      default:
        return { color: "gray", label: "desconhecido" };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Agendamento de coleta de produto</Text>

      {/* Botão de agendar */}
      <TouchableOpacity style={styles.botao} onPress={() => router.push("./agendar")}>
        <Text style={styles.textoBotao}>Agendar</Text>
      </TouchableOpacity>

      {/* Caixa com os produtos */}
      <View style={styles.caixa}>
        <Text style={styles.subtitulo}>• Produtos registrados</Text>
        <ScrollView style={{ width: "100%" }}>
          {produtos.map((p, index) => {
            const statusInfo = getStatusInfo(p.status);
            return (
              <View key={index} style={styles.cardProduto}>
                <Text style={styles.info}>Id: {p.id}</Text>
                <Text style={styles.info}>Setor: {p.setor}</Text>
                <Text style={styles.info}>Data de saída: {p.dataSaida}</Text>
                <View style={styles.statusLinha}>
                  <View style={[styles.statusBolinha, { backgroundColor: statusInfo.color }]} />
                  <Text style={styles.info}>{statusInfo.label}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  botao: {
    backgroundColor: "#c0c0c0",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  textoBotao: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  caixa: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#d4a373",
    borderRadius: 8,
    padding: 10,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  cardProduto: {
    backgroundColor: "#a9adb8",
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    color: "black",
  },
  statusLinha: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  statusBolinha: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
});
