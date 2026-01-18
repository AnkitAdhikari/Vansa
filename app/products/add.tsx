import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

import { addProductSchema, AddProductFormData } from '@/utils/validation';
import { useProducts } from '@/hooks/useProducts';
import { useGroups } from '@/hooks/useGroups';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function AddProductScreen() {
  const { currentGroup } = useGroups();
  const { addProduct } = useProducts(currentGroup?.id);
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
  });

  const onSubmit = async (data: AddProductFormData) => {
    if (!currentGroup) return;
    try {
      await addProduct(data);
      Alert.alert('Success', 'Product added!');
      router.back();
    } catch (error) {
      // Error handled in hook
    }
  };

  if (!currentGroup) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No group selected.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Add Product</ThemedText>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <Ionicons name="pricetag" size={20} color="#687076" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={value}
              onChangeText={onChange}
            />
          </View>
        )}
      />
      {errors.name && <ThemedText style={styles.error}>{errors.name.message}</ThemedText>}

      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <View style={styles.categoryContainer}>
            <Ionicons name="list" size={20} color="#687076" style={styles.icon} />
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={styles.picker}
            >
              <Picker.Item label="Select Category" value="" />
              <Picker.Item label="Kitchen" value="Kitchen" />
              <Picker.Item label="Bathroom" value="Bathroom" />
              <Picker.Item label="Groceries" value="Groceries" />
            </Picker>
          </View>
        )}
      />
      {errors.category && <ThemedText style={styles.error}>{errors.category.message}</ThemedText>}

      <Controller
        control={control}
        name="quantityPercent"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <Ionicons name="stats-chart" size={20} color="#687076" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Quantity % (0-100)"
              value={value?.toString()}
              onChangeText={(text) => onChange(parseInt(text) || 0)}
              keyboardType="numeric"
            />
          </View>
        )}
      />
      {errors.quantityPercent && <ThemedText style={styles.error}>{errors.quantityPercent.message}</ThemedText>}

        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <View style={styles.statusContainer}>
              <View style={styles.statusTabs}>
                {[
                  { label: 'In Stock', value: 'inStock' },
                  { label: 'Low', value: 'low' },
                  { label: 'Out', value: 'out' },
                  { label: 'Needed', value: 'needed' },
                ].map(status => (
                  <TouchableOpacity
                    key={status.value}
                    style={[
                      styles.statusTab,
                      value === status.value && styles.selectedTab,
                    ]}
                    onPress={() => onChange(status.value)}
                  >
                    <ThemedText
                      style={value === status.value ? styles.selectedTabText : styles.statusTabText}
                    >
                      {status.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        />
      {errors.status && <ThemedText style={styles.error}>{errors.status.message}</ThemedText>}

      <View style={styles.button} onTouchEnd={handleSubmit(onSubmit)}>
        <ThemedText type="defaultSemiBold">Add Product</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    height: 80,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    height: 80,
  },
  statusContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    height: 80,
  },
  statusTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  statusTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginHorizontal: 2,
    borderRadius: 4,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  selectedTab: {
    backgroundColor: '#0a7ea4',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  statusTabText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTabText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
});