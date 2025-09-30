import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { operadorService } from '../services/api';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from "../components/Toast";

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [toast, setToast] = useState({ visible: false, message: "", type: "error" });
  const router = useRouter();

  // Função para exibir mensagens
  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "error" }), 3000);
  };

  const handleLogin = async () => {

    if(!email || !senha) {
      showToast("Preencha todos os campos.", "error");
      return;
    }

    try {
      const { data } = await operadorService.loginOp({ email, senha });

      if (data === 'Login realizado com sucesso!') {
        router.push('./home');
      } else {
        showToast('Falha no login', 'Email ou senha incorretos');
        return;
      }

    } catch (error) {
      console.error(error);
      showToast('Erro', 'Não foi possível conectar ao servidor');
      return;
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.card}>
        {/* Ícone vermelho */}
        <View style={styles.iconCircle}>
          <Ionicons name="person" size={50} color="white" />
        </View>

        <Text style={styles.title}>Tela de entrada</Text>

        {/* Campo Email */}
        <Text style={styles.label}>Email de acesso:</Text>
        <TextInput
          placeholder="Digite seu email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        {/* Campo Senha */}
        <Text style={styles.label}>Senha:</Text>
        <TextInput
          placeholder="Digite sua senha"
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        {/* Botão Entrar */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
      
      {toast.visible && <Toast message={toast.message} type={toast.type} />}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#1c1c1c', // cor do background
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#bfbfbf',
    borderRadius: 8,
    padding: 20,
    width: '85%',
    alignItems: 'center',
    elevation: 5,
  },
  iconCircle: {
    backgroundColor: '#d9534f',
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    marginBottom: 5,
    color: '#d9534f',
  },
  input: {
    backgroundColor: '#f5f5f5',
    width: '100%',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  button: {
    backgroundColor: '#d9534f',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignSelf: 'flex-end', // posição do botão de entrar
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});