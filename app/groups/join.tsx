import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useGroups } from "@/hooks/useGroups";
import { JoinGroupFormData, joinGroupSchema } from "@/utils/validation";

export default function JoinGroupScreen() {
  const { joinGroup } = useGroups();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinGroupFormData>({
    resolver: zodResolver(joinGroupSchema),
  });

  const onSubmit = async (data: JoinGroupFormData) => {
    try {
      await joinGroup(data.inviteCode);
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Join Group</ThemedText>

      <Controller
        control={control}
        name="inviteCode"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <Ionicons
              name="key"
              size={20}
              color="#687076"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Invite Code (6 characters)"
              value={value}
              onChangeText={(text) => onChange(text.toUpperCase())}
              maxLength={6}
              autoCapitalize="characters"
            />
          </View>
        )}
      />
      {errors.inviteCode && (
        <ThemedText style={styles.error}>
          {errors.inviteCode.message}
        </ThemedText>
      )}

      <View style={styles.button} onTouchEnd={handleSubmit(onSubmit)}>
        <ThemedText type="defaultSemiBold">Join Group</ThemedText>
      </View>

      <Link href="create" style={styles.link}>
        <ThemedText type="link">Create new group instead</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
    letterSpacing: 2,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0a7ea4",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
  },
  link: {
    alignSelf: "center",
  },
});
