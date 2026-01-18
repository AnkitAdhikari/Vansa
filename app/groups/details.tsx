import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { IconSymbol } from '@/components/ui/icon-symbol';

import { useGroups } from '@/hooks/useGroups';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function GroupDetailsScreen() {
  const { currentGroup, leaveGroup } = useGroups();
  const [memberEmails, setMemberEmails] = useState<{[uid: string]: string}>({});

  useEffect(() => {
    if (currentGroup?.members && currentGroup.members.length > 0) {
      const fetchEmails = async () => {
        const q = query(collection(db, 'users'), where('uid', 'in', currentGroup.members));
        const snapshot = await getDocs(q);
        const emails: {[uid: string]: string} = {};
        snapshot.forEach(doc => {
          const data = doc.data();
          emails[data.uid] = data.email;
        });
        setMemberEmails(emails);
      };
      fetchEmails();
    }
  }, [currentGroup?.members]);

  useEffect(() => {
    if (currentGroup?.members && currentGroup.members.length > 0) {
      const fetchEmails = async () => {
        const q = query(collection(db, 'users'), where('uid', 'in', currentGroup.members));
        const snapshot = await getDocs(q);
        const emails: {[uid: string]: string} = {};
        snapshot.forEach(doc => {
          const data = doc.data();
          emails[data.uid] = data.email;
        });
        setMemberEmails(emails);
      };
      fetchEmails();
    }
  }, [currentGroup?.members]);

  const handleLeave = async () => {
    Alert.alert("Leave Group", "Are you sure you want to leave this group?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: async () => {
          try {
            await leaveGroup();
            Alert.alert("Success", "Left group");
          } catch (error) {
            // Error handled
          }
        },
      },
    ]);
  };

  if (!currentGroup) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">No Group</ThemedText>
        <ThemedText>You are not part of any group.</ThemedText>
        <Link href="create" style={styles.link}>
          <ThemedText type="link">Create or Join a Group</ThemedText>
        </Link>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{currentGroup.name}</ThemedText>
      {currentGroup.description && (
        <ThemedText style={styles.description}>
          {currentGroup.description}
        </ThemedText>
      )}
      <View style={styles.infoContainer}>
        <IconSymbol name="key.fill" size={20} color="#687076" />
        <ThemedText style={styles.info}>
          Invite Code: {currentGroup.inviteCode}
        </ThemedText>
      </View>
      <View style={styles.infoContainer}>
        <IconSymbol name="person.3.fill" size={20} color="#687076" />
        <ThemedText style={styles.info}>
          Members: {currentGroup.members.length}
        </ThemedText>
      </View>
      <ThemedText style={styles.membersTitle}>Members:</ThemedText>
      <FlatList
        data={currentGroup.members}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.memberItem}>
            <ThemedText style={styles.iconText}>👤</ThemedText>
            <ThemedText>{memberEmails[item] || item}</ThemedText>
          </View>
        )}
        style={styles.membersList}
      />
      <View style={styles.button} onTouchEnd={handleLeave}>
        <ThemedText type="defaultSemiBold">Leave Group</ThemedText>
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
  description: {
    marginBottom: 20,
    fontStyle: "italic",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  info: {
    marginLeft: 10,
  },
  membersTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  membersList: {
    maxHeight: 200,
    marginBottom: 20,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  iconText: {
    fontSize: 16,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#d9534f",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
  },
  link: {
    marginTop: 20,
    alignSelf: "center",
  },
});
