import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { produtoService } from "../services/api";
import Toast from "../components/Toast";

export default function RotaProdutoScreen() {
  const { produtoId } = useLocalSearchParams();
  const [produto, setProduto] = useState(null);
  const [rota, setRota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState(null); // { message: "", type: "success" | "error" }

  const etapas = [
    { id: 1, titulo: "Coleta do produto no estoque" },
    { id: 2, titulo: "Transporte do produto para setor logístico" },
    { id: 3, titulo: "Despache do produto para entrega" },
    { id: 4, titulo: "Entrega do produto para o cliente" },
  ];

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await produtoService.getProdbyId(produtoId);
        setProduto(response.data);
        setRota(Number(response.data.rota));
      } catch (error) {
        console.log(error);
        showToast("Não foi possível carregar o produto", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [produtoId]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const atualizarRota = async (data) => {
    if (updating) return;

    setUpdating(true);

    try {
      const response = await produtoService.updateProdRota(produtoId, data);

      if (response.data?.rota !== undefined) {
        setRota(Number(response.data.rota));
        showToast(`Rota atualizada para ${response.data.rota}`, "success");
      } else {
        setRota(data.rota);
        showToast(`Rota atualizada para ${data.rota}`, "success");
      }
    } catch (error) {
      console.log("Erro API:", error);
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      }
      showToast("Não foi possível atualizar a rota no servidor", "error");
    } finally {
      setUpdating(false);
    }
  };

  const getCorStatus = (valorEtapa) => {
    if (rota >= valorEtapa) return "#4CAF50";
    if (rota + 0.5 === valorEtapa) return "#FFEB3B";
    return "#9E9E9E";
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Carregando produto...</Text>
      </View>
    );
  }

  if (!produto) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "#fff" }}>Produto não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de rota do produto</Text>

      <View style={styles.cardInfo}>
        <Text style={styles.info}>Id: {produto.codigo}</Text>
        <Text style={styles.info}>Setor: {produto.setor}</Text>
        <Text style={styles.info}>Data de saída: {produto.dataSaida}</Text>
      </View>

      {etapas.map((etapa) => (
        <View key={etapa.id} style={styles.etapaContainer}>
          <View style={[styles.status, { backgroundColor: getCorStatus(etapa.id) }]} />
          <Text style={styles.texto}>{etapa.titulo}</Text>

          <TouchableOpacity
            style={[
              styles.botao,
              { backgroundColor: rota >= etapa.id ? "#4CAF50" : "#BDBDBD" },
            ]}
            onPress={() => atualizarRota({ rota: etapa.id })}
            disabled={updating}
          >
            <Text style={styles.textoBotao}>
              {updating && rota !== etapa.id ? "Atualizando..." : "Confirmar"}
            </Text>
          </TouchableOpacity>

          {rota + 0.5 === etapa.id && (
            <Text style={styles.andamento}>Em andamento...</Text>
          )}
        </View>
      ))}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#212121", padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 15 },
  cardInfo: {
    backgroundColor: "#424242",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  info: { color: "#fff", fontSize: 16 },
  etapaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  status: { width: 20, height: 20, borderRadius: 10, marginRight: 10 },
  texto: { flex: 1, color: "#fff", fontSize: 16 },
  botao: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  textoBotao: { color: "#fff", fontWeight: "bold" },
  andamento: { marginLeft: 10, color: "#FFEB3B", fontWeight: "bold" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#212121",
  },
});
