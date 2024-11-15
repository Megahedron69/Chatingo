import { useState, type FC } from "react";
import { View, Text, TextInput, Image, StyleSheet, Alert } from "react-native";
import { Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Onboarding from "react-native-onboarding-swiper";

type Props = {};

const Next = ({ ...props }) => (
  <Button
    icon={<Entypo name="chevron-right" size={24} color="black" />}
    containerStyle={{
      marginVertical: 10,
      width: 70,
    }}
    buttonStyle={{
      backgroundColor: "transparent",
    }}
    {...props}
  />
);

const DoneButt = ({ ...props }) => (
  <Button
    icon={<Entypo name="controller-fast-forward" size={24} color="black" />}
    containerStyle={{
      marginVertical: 10,
      width: 70,
    }}
    buttonStyle={{
      backgroundColor: "transparent",
    }}
    {...props}
  />
);

type InpComponentTypes = {
  userName: string;
  setUserName: any;
};
const InpComponent: FC<InpComponentTypes> = ({ userName, setUserName }) => {
  const handleChange = (text: string) => {
    setUserName(text);
  };
  return (
    <View>
      <TextInput
        placeholder="Enter your chat username"
        placeholderTextColor="#4A4A4A"
        style={styles.input}
        onChangeText={handleChange}
        value={userName}
      />
    </View>
  );
};

const OnBoardingScreens = (props: Props) => {
  const [userName, setUserName] = useState("");
  const navigation = useNavigation();

  const handleDone = async () => {
    if (userName.trim() === "Helen" || userName.trim() === "Alex") {
      try {
        await AsyncStorage.setItem("username", userName.trim());
        navigation.navigate("Newchat");
      } catch (error) {
        console.error("Error saving data to AsyncStorage:", error);
      }
    } else {
      Alert.alert(
        "Invalid Username",
        "No such user exists. Please choose either 'Helen' or 'Alex'.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }
  };

  return (
    <View style={styles.container}>
      <Onboarding
        pages={[
          {
            backgroundColor: "#F8BBD0",
            image: (
              <Image
                source={require("../../assets/Images/onboarding.png")}
                style={{ width: 400, height: 400 }}
                resizeMode="center"
                alt="onboarder"
              />
            ),
            title: (
              <Text style={{ fontWeight: 600, fontSize: 56 }}>Chatingo</Text>
            ),
            subtitle: "Let's get you boarded to a chatty world!",
          },
          {
            backgroundColor: "#A8E6CF",
            image: (
              <Image
                source={require("../../assets/Images/nameType.png")}
                style={{ position: "absolute", top: 0 }}
                resizeMode="center"
                alt="typeName"
              />
            ),
            title: (
              <Text style={[styles.title, { color: "#333" }]}>Username</Text>
            ),
            subtitle: (
              <View style={styles.subtitle}>
                <InpComponent userName={userName} setUserName={setUserName} />
              </View>
            ),
          },
        ]}
        onDone={handleDone}
        showSkip={false}
        bottomBarHighlight={false}
        NextButtonComponent={Next}
        DoneButtonComponent={DoneButt}
      />
    </View>
  );
};

export default OnBoardingScreens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  title: {
    fontWeight: "600",
    fontSize: 56,
    position: "absolute",
    top: 60,
    alignSelf: "center",
  },
  subtitle: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    top: 140,
    alignSelf: "center",
  },
  input: {
    width: "80%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    fontSize: 18,
    color: "#333333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 4,
  },
});
