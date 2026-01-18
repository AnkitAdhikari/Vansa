import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useGroups } from "@/hooks/useGroups";
import { CreateGroupFormData, createGroupSchema } from "@/utils/validation";

export default function CreateGroupScreen() {
  const { createGroup } = useGroups();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
  });

  const onSubmit = async (data: CreateGroupFormData) => {
    try {
      const newGroup = await createGroup(data.name, data.description);
      Alert.alert(
        "Success",
        `Group created! Invite code: ${newGroup.inviteCode}`,
        [{ text: "OK", onPress: () => router.replace("/(tabs)") }],
      );
    } catch (error) {
      // Error handled in hook
      console.log(error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText type="title">Create Group</ThemedText>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <Ionicons
                name="people"
                size={20}
                color="#687076"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Group Name"
                value={value}
                onChangeText={onChange}
              />
            </View>
          )}
        />
        {errors.name && (
          <ThemedText style={styles.error}>{errors.name.message}</ThemedText>
        )}

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <View style={styles.textAreaContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="document-text" size={20} color="#687076" />
              </View>
              <TextInput
                style={styles.textArea}
                placeholder="Description (optional)"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          )}
        />
        {errors.description && (
          <ThemedText style={styles.error}>
            {errors.description.message}
          </ThemedText>
        )}

        <View style={styles.button} onTouchEnd={handleSubmit(onSubmit)}>
          <ThemedText type="defaultSemiBold">Create Group</ThemedText>
        </View>

        <Link href="join" style={styles.link}>
          <ThemedText type="link">Join existing group instead</ThemedText>
        </Link>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
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
  textAreaContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  iconContainer: {
    marginRight: 10,
    marginTop: 8,
  },
  input: {
    flex: 1,
  },
  textArea: {
    flex: 1,
    height: 80,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#333",
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
