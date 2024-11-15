import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export const getUserDets = async (userName: string) => {
  try {
    const userQuery = query(
      collection(db, "users"),
      where("userName", "==", userName)
    );
    const querySnapshot = await getDocs(userQuery);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0].data();
      return {
        profilePicture: userDoc.profilePicture,
        userID: userDoc.userID,
        userName: userDoc.userName,
      };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error getting user details:", error);
    return null;
  }
};

export const getChats = async (senderID: string, receiverID: string) => {
  try {
    const chatsQuery = query(
      collection(db, "messages"),
      where("senderId", "in", [senderID, receiverID]),
      where("receiverId", "in", [senderID, receiverID])
    );
    const querySnapshot = await getDocs(chatsQuery);
    const chats = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        _id: doc.id || new Date().getTime().toString(),
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.senderId,
          name: data.senderId === senderID ? "You" : "Other",
          avatar: data.senderId === senderID ? "" : data.receiverAvatar,
        },
      };
    });
    return chats;
  } catch (error) {
    console.error("Error getting chats:", error);
    return [];
  }
};

export const storeChats = async (
  senderID: string,
  receiverID: string,
  text: string
) => {
  try {
    const messageData = {
      senderId: senderID,
      receiverId: receiverID,
      text,
      createdAt: new Date(),
    };
    await addDoc(collection(db, "messages"), messageData);
  } catch (error) {
    console.error("Error storing chat:", error);
  }
};
