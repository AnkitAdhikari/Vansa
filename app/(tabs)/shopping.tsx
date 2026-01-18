import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useGroups } from '@/hooks/useGroups';
import { useProducts, Product } from '@/hooks/useProducts';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ShoppingScreen() {
  const { currentGroup } = useGroups();
  const { products, editProduct } = useProducts(currentGroup?.id);
  const [quantities, setQuantities] = useState<{ [key: string]: number | undefined }>({});

  const shoppingList = products.filter(p => p.status === 'out' || p.status === 'needed');

  const handleBuy = async (product: Product) => {
    const newQuantity = quantities[product.id] || 100;
    try {
      await editProduct(product.id, { status: 'inStock', quantityPercent: newQuantity });
      Alert.alert('Success', `${product.name} updated!`);
      setQuantities(prev => ({ ...prev, [product.id]: undefined }));
    } catch (error) {
      // Error handled
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
      <ThemedText type="title">Shopping List</ThemedText>
      <FlatList
        data={shoppingList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemInfo}>
              <ThemedText style={styles.itemName}>{item.name}</ThemedText>
              <ThemedText style={styles.itemCategory}>{item.category}</ThemedText>
              <View style={styles.quantityContainer}>
                <Ionicons name="stats-chart" size={16} color="#687076" />
                <TextInput
                  style={styles.quantityInput}
                  placeholder="New %"
                  value={quantities[item.id]?.toString() || ''}
                  onChangeText={(text) => setQuantities(prev => ({ ...prev, [item.id]: parseInt(text) || 0 }))}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.buyButton} onTouchEnd={() => handleBuy(item)}>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <ThemedText style={styles.buyText}>Buy</ThemedText>
            </View>
          </View>
        )}
        ListEmptyComponent={<ThemedText>No items to buy.</ThemedText>}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityInput: {
    marginLeft: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 5,
    width: 60,
    textAlign: 'center',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 6,
  },
  buyText: {
    color: '#fff',
    marginLeft: 5,
  },
});