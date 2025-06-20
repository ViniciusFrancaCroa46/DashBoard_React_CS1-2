import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { equipamentoService } from '../services/api'; // ajuste o caminho se necessário

const getStatusInfo = (status) => {
  switch (status) {
    case 0:
      return { color: 'red', label: 'Desligado' };
    case 1:
      return { color: 'green', label: 'Ligado' };
    case 2:
      return { color: 'yellow', label: 'Em andamento' };
    default:
      return { color: 'gray', label: 'Desconhecido' };
  }
};

const renderEquipamento = ({ item }) => {
  const status = getStatusInfo(item.status);

  return (
    <View style={styles.equipamentoBox}>
      <Text style={styles.infoText}>ID: {item.id} | Setor: {item.setor}</Text>
      <View style={styles.statusRow}>
        <View style={[styles.statusCircle, { backgroundColor: status.color }]} />
        <Text style={styles.statusLabel}>{status.label}</Text>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    equipamentoService.getEA()
      .then((response) => {
        setEquipamentos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar equipamentos:', error);
        setLoading(false);
      });
  }, []);

  const esteiras = equipamentos.filter(e => e.tipo === 'esteira');
  const agvs = equipamentos.filter(e => e.tipo === 'AGV');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="yellow" />
        <Text style={{ color: '#fff' }}>Carregando equipamentos...</Text>
      </View>
    );
  }

    return (
    <ScrollView style={styles.container}>
      <View style={styles.listaContainer}>
        <Text style={styles.titulo}>Esteiras</Text>
        {esteiras.map((item) => (
          <View key={item.id}>{renderEquipamento({ item })}</View>
        ))}

        <Text style={styles.titulo}>AGVs</Text>
        {agvs.map((item) => (
          <View key={item.id}>{renderEquipamento({ item })}</View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  listaContainer: {
    borderWidth: 2,
    borderColor: 'yellow',
    borderRadius: 10,
    padding: 12,
    backgroundColor: 'rgba(30,30,30, 1.0)',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  equipamentoBox: {
    backgroundColor: 'rgba(194,199,209, 1.0)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  statusLabel: {
    fontSize: 16,
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
