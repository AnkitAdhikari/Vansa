import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { loginSchema, LoginFormData } from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LoginScreen() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const { control, handleSubmit, formState: { errors }, reset } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setSubmitError(null);
    try {
      await login(data.email, data.password);
      reset(); // Clear form
      router.back(); // Dismiss modal
    } catch (error: any) {
      setSubmitError(error.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Login</ThemedText>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <View style={[styles.inputContainer, styles.firstInput]}>
            <Ionicons name="mail" size={20} color="#687076" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        )}
      />
      {errors.email && <ThemedText style={styles.error}>{errors.email.message}</ThemedText>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#687076" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={value}
              onChangeText={onChange}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#687076"
                style={styles.iconRight}
              />
            </TouchableOpacity>
          </View>
        )}
      />
      {errors.password && <ThemedText style={styles.error}>{errors.password.message}</ThemedText>}

        {submitError && <ThemedText style={styles.submitError}>{submitError}</ThemedText>}

        <View style={styles.button} onTouchEnd={handleSubmit(onSubmit)}>
          <ThemedText type="defaultSemiBold">Login</ThemedText>
        </View>

        <Link href="/signup" style={styles.link}>
          <ThemedText type="link">Don't have an account? Sign Up</ThemedText>
        </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  firstInput: {
    marginTop: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
  },
  firstInput: {
    marginTop: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  submitError: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  link: {
    alignSelf: 'center',
  },
});