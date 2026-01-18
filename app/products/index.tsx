import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Plus } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useGroups } from "@/hooks/useGroups";
import { useProducts } from "@/hooks/useProducts";

export default function ProductsScreen() {
  const { currentGroup } = useGroups();
  const { products, deleteProduct } = useProducts(currentGroup?.id);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        filterCategory === "All" || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, filterCategory]);

  const handleDelete = (productId: string) => {
    Alert.alert("Delete Product", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", onPress: () => deleteProduct(productId) },
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "inStock":
        return "#28a745";
      case "low":
        return "#ffc107";
      case "out":
        return "#dc3545";
      case "needed":
        return "#007bff";
      default:
        return "#6c757d";
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
      <ThemedText type="title">Products</ThemedText>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#687076" style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filterContainer}>
        {["All", "Kitchen", "Bathroom", "Groceries"].map((cat) => (
          <View
            key={cat}
            style={[
              styles.filterButton,
              filterCategory === cat && styles.activeFilter,
            ]}
            onTouchEnd={() => setFilterCategory(cat)}
          >
            <ThemedText
              style={
                filterCategory === cat ? styles.activeText : styles.filterText
              }
            >
              {cat}
            </ThemedText>
          </View>
        ))}
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <View style={styles.productInfo}>
              <ThemedText style={styles.productName}>{item.name}</ThemedText>
              <ThemedText style={styles.productCategory}>
                {item.category}
              </ThemedText>
              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                />
                <ThemedText style={styles.statusText}>
                  {item.status} ({item.quantityPercent}%)
                </ThemedText>
              </View>
            </View>
            <View style={styles.actions}>
              <Link
                href={`/products/edit?id=${item.id}`}
                style={styles.actionButton}
              >
                <Ionicons name="pencil" size={20} color="#0a7ea4" />
              </Link>
              <View
                style={styles.actionButton}
                onTouchEnd={() => handleDelete(item.id)}
              >
                <Ionicons name="trash" size={20} color="#dc3545" />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<ThemedText>No products found.</ThemedText>}
        style={styles.list}
      />

      <Link href="/products/add" style={styles.addButton}>
        <Plus style={styles.addIcon} color="white" size={28} />
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  filterButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#f8f9fa",
  },
  activeFilter: {
    backgroundColor: "#0a7ea4",
  },
  filterText: {
    color: "#333",
  },
  activeText: {
    color: "#fff",
  },
  list: {
    flex: 1,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productCategory: {
    fontSize: 14,
    color: "#666",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#0a7ea4",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
});
