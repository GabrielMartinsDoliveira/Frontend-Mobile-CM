import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';

const UserForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    email: '',
    senha: '',
    role: 'assistente' // Valor padrão
  });

  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpa erro quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.matricula.trim()) newErrors.matricula = 'Matrícula é obrigatória';
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }
    if (!formData.role) newErrors.role = 'Perfil é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <View style={styles.formContainer}>
      {/* Nome */}
      <TextInput
        label="Nome *"
        value={formData.nome}
        onChangeText={(text) => handleChange('nome', text)}
        mode="outlined"
        style={styles.input}
        error={!!errors.nome}
      />
      {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}

      {/* Matrícula */}
      <TextInput
        label="Matrícula *"
        value={formData.matricula}
        onChangeText={(text) => handleChange('matricula', text)}
        mode="outlined"
        style={styles.input}
        error={!!errors.matricula}
      />
      {errors.matricula && <Text style={styles.errorText}>{errors.matricula}</Text>}

      {/* Email */}
      <TextInput
        label="Email *"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        error={!!errors.email}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      {/* Senha */}
      <TextInput
        label="Senha *"
        value={formData.senha}
        onChangeText={(text) => handleChange('senha', text)}
        mode="outlined"
        secureTextEntry
        style={styles.input}
        error={!!errors.senha}
      />
      {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}

      {/* Perfil (Role) */}
      <Text style={styles.label}>Perfil *</Text>
      <RadioButton.Group 
        onValueChange={(value) => handleChange('role', value)} 
        value={formData.role}
      >
        <RadioButton.Item 
          label="Admin" 
          value="admin" 
          style={styles.radioItem}
        />
        <RadioButton.Item 
          label="Perito" 
          value="perito" 
          style={styles.radioItem}
        />
        <RadioButton.Item 
          label="Assistente" 
          value="assistente" 
          style={styles.radioItem}
        />
      </RadioButton.Group>
      {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}

      <Button 
        mode="contained" 
        onPress={handleSubmit} 
        style={styles.button}
        loading={isLoading}
        disabled={isLoading}
      >
        Cadastrar
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    gap: 8,
    padding: 16,
  },
  input: {
    marginBottom: 4,
  backgroundColor: 'white',
  },
  button: {
    marginTop: 16,
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  radioItem: {
    paddingVertical: 4,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    marginTop: -4,
    fontSize: 12,
  },
});

export default UserForm;