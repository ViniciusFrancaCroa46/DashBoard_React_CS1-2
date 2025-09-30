import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { produtoService } from "../services/api";
import Toast from "../components/Toast";

export default function AgendarScreen() {
  const [id, setId] = useState("");
  const [setor, setSetor] = useState("A");
  const [data, setData] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "error" });
  const router = useRouter();

  // Função para exibir mensagens
  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "error" }), 3000);
  };

  const handleConfirmar = async () => {
    // 1. valida ID
    const regex = /^\d{3}[A-Za-z]{3}$/;
    if (!regex.test(id)) {
      showToast("ID inválido! Use o formato 123ABC.", "error");
      return;
    }

    // 2. valida se campos estão preenchidos
    if (!id || !setor || !data) {
      showToast("Preencha todos os campos.", "error");
      return;
    }

    try {
      // 3. checa se ID já existe
      const { data: existentes } = await produtoService.getProd();
      const existe = existentes.some((p) => p.id === id);
      if (existe) {
        showToast("Já existe um produto com esse ID!", "error");
        return;
      }

      // 4. envia para API
      await produtoService.createProd({
        id,
        setor,
        dataSaida: data.toISOString().split("T")[0],
        status: "em estoque",
        rota: 0,
      });

      showToast("Produto registrado com sucesso!", "success");
      setId("");
      setSetor("A");
      setData(new Date());
    } catch (error) {
      console.error(error);
      showToast("Erro ao registrar produto.", "error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Agendamento de coleta de produto</Text>

      <View style={styles.box}>
        <Text style={styles.label}>ID do produto</Text>
        <TextInput
          style={styles.input}
          value={id}
          onChangeText={(text) => setId(text.toUpperCase())}
          placeholder="Ex: 123ABC"
          autoCapitalize= "characters" //forçar letras maiúsculas
          maxLength={6}
        />

        <Text style={styles.label}>Setor do produto</Text>
        <Picker
          selectedValue={setor}
          style={styles.input}
          onValueChange={(value) => setSetor(value)}
        >
          <Picker.Item label="A" value="A" />
          <Picker.Item label="B" value="B" />
        </Picker>

        <Text style={styles.label}>Data da retirada do produto</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{data.toLocaleDateString("pt-BR")}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={data}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setData(selectedDate);
            }}
          />
        )}

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.btnConfirmar} onPress={handleConfirmar}>
            <Text style={styles.btnText}>Confirmar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnCancelar} onPress={() => router.push('./coleta')}>
            <Text style={styles.btnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {toast.visible && <Toast message={toast.message} type={toast.type} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1c1c1c", padding: 20 },
  titulo: { color: "white", fontSize: 22, marginBottom: 15, fontWeight: "bold" },
  box: {
    backgroundColor: "#2b2b2b",
    borderWidth: 2,
    borderColor: "#d49f5f",
    borderRadius: 10,
    padding: 15,
  },
  label: { color: "white", marginTop: 10 },
  input: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buttons: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  btnConfirmar: {
    flex: 1,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  btnCancelar: {
    flex: 1,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  btnText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
