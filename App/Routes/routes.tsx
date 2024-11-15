import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NewChatScreen from "../Screens/NewChatScreen";
import OnBoardingScreens from "../Screens/OnBoardingScreens";
const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName={"Onboarding"}>
      <Stack.Screen
        name="Onboarding"
        component={OnBoardingScreens}
        options={{
          header: () => null,
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="Newchat"
        component={NewChatScreen}
        options={{
          header: () => null,
          animation: "slide_from_bottom",
        }}
      />
    </Stack.Navigator>
  );
}
