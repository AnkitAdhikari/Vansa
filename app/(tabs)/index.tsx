import { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from "@/hooks/useAuth";
import { useGroups } from "@/hooks/useGroups";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { currentGroup } = useGroups();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // Handle error
    }
  };

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Welcome to Vansa</ThemedText>
        <ThemedText>Manage household essentials with your roommates.</ThemedText>
        <View style={styles.authContainer}>
          <Link href="/signup" style={styles.button}>
            <View style={styles.buttonContent}>
              <Ionicons name="person-add" size={20} color="#fff" />
              <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
            </View>
          </Link>
          <Link href="/login" style={styles.button}>
            <View style={styles.buttonContent}>
              <Ionicons name="log-in" size={20} color="#fff" />
              <ThemedText style={styles.buttonText}>Login</ThemedText>
            </View>
          </Link>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Vansa Dashboard</ThemedText>
      <ThemedText>Welcome, {user.email}!</ThemedText>

      {currentGroup ? (
        <View style={styles.groupContainer}>
          <ThemedText type="subtitle">Your Group: {currentGroup.name}</ThemedText>
          <Link href="/groups/details" style={styles.button}>
            <View style={styles.buttonContent}>
              <Ionicons name="eye" size={20} color="#fff" />
              <ThemedText style={styles.buttonText}>View Group</ThemedText>
            </View>
          </Link>
          <Link href="/products" style={styles.button}>
            <View style={styles.buttonContent}>
              <Ionicons name="list" size={20} color="#fff" />
              <ThemedText style={styles.buttonText}>Manage Products</ThemedText>
            </View>
          </Link>
        </View>
      ) : (
        <View style={styles.noGroupContainer}>
          <ThemedText>You are not part of any group.</ThemedText>
          <Link href="/groups/create" style={styles.button}>
            <View style={styles.buttonContent}>
              <Ionicons name="add-circle" size={20} color="#fff" />
              <ThemedText style={styles.buttonText}>Create Group</ThemedText>
            </View>
          </Link>
          <Link href="/groups/join" style={styles.button}>
            <View style={styles.buttonContent}>
              <Ionicons name="enter" size={20} color="#fff" />
              <ThemedText style={styles.buttonText}>Join Group</ThemedText>
            </View>
          </Link>
        </View>
      )}

      <View style={[styles.button, styles.logoutButton]} onTouchEnd={handleLogout}>
        <View style={styles.buttonContent}>
          <Ionicons name="log-out" size={20} color="#fff" />
          <ThemedText style={styles.buttonText}>Logout</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  authContainer: {
    marginTop: 40,
  },
  groupContainer: {
    marginTop: 20,
  },
  noGroupContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 6,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    marginTop: 40,
  },
});
