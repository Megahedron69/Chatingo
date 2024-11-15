import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserDets, storeChats } from "../db/dbFunc";
import { Avatar } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const NewChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [otherPerson, setOtherPerson] = useState(null);
  const [senderID, setSenderID] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userName = await AsyncStorage.getItem("username");
        if (userName) {
          const user = await getUserDets(userName);
          setUserData(user);
          setSenderID(user?.userID);
          let otherPersonName = userName === "Helen" ? "Alex" : "Helen";
          const otherPersonData = await getUserDets(otherPersonName);
          setOtherPerson(otherPersonData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (senderID && otherPerson?.userID) {
      const chatsQuery = query(
        collection(db, "messages"),
        where("senderId", "in", [senderID, otherPerson.userID]),
        where("receiverId", "in", [senderID, otherPerson.userID])
      );

      const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
        const fetchedMessages = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id || new Date().getTime().toString(),
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: {
              _id: data.senderId,
              name: data.senderId === senderID ? "You" : otherPerson.userName,
              avatar:
                data.senderId === senderID
                  ? userData?.profilePicture
                  : otherPerson.profilePicture,
            },
          };
        });

        fetchedMessages.sort((a, b) => b.createdAt - a.createdAt);
        setMessages(fetchedMessages);
      });

      return () => unsubscribe();
    }
  }, [senderID, otherPerson?.userID]);

  const onSend = useCallback(
    (messages = []) => {
      if (senderID && otherPerson?.userID) {
        const newMessage = {
          _id: messages[0]._id || new Date().getTime().toString(),
          text: messages[0].text,
          createdAt: new Date(),
          senderId: senderID,
          receiverId: otherPerson?.userID,
          user: {
            _id: senderID,
            name: "You",
            avatar: userData?.profilePicture,
          },
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [newMessage])
        );

        storeChats(senderID, otherPerson.userID, messages[0].text).catch(
          (error) => console.error("Error storing chat:", error)
        );
      } else {
        console.warn("Missing senderID or otherPerson.userID");
      }
    },
    [senderID, otherPerson]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#B48AFF" />
      <View style={styles.header}>
        <Avatar
          source={{ uri: otherPerson?.profilePicture || "" }}
          rounded
          size="medium"
          containerStyle={styles.avatar}
        />
        <Text style={styles.headerText}>{otherPerson?.userName || "User"}</Text>
      </View>

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: senderID,
          name: "You",
          avatar: userData?.profilePicture || "",
        }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: "#E5E5EA",
                borderRadius: 20,
                padding: 8,
              },
              right: {
                backgroundColor: "#B48AFF",
                borderRadius: 20,
                padding: 8,
              },
            }}
            textStyle={{
              left: { color: "#333", fontSize: 18 },
              right: { color: "#FFF", fontSize: 18 },
            }}
          />
        )}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={styles.inputToolbar}
            primaryStyle={styles.primaryInput}
          />
        )}
        renderSend={(props) => (
          <View style={styles.sendButton}>
            <Feather
              name="send"
              size={24}
              color="#B48AFF"
              onPress={() => props.onSend({ text: props.text }, true)}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default NewChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B48AFF",
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 12,
  },
  avatar: { backgroundColor: "#fff" },
  inputToolbar: {
    borderTopWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
  },
  primaryInput: {
    backgroundColor: "#E8EAF6",
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  sendButton: { alignSelf: "center", marginRight: 15, paddingVertical: 8 },
  messageContainer: {
    backgroundColor: "#fd2",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  messageUserName: { fontSize: 16, color: "#888", marginLeft: 10 },
  messageAvatar: { marginRight: 10, marginBottom: 10 },
});
