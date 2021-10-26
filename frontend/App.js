import React, { useEffect } from "react";
import { StyleSheet, View, LogBox } from "react-native";
import ProductContainer from "./Screens/Products/ProductContainer";
import Header from "./Shared/Header";
import { NavigationContainer } from "@react-navigation/native";
import * as Font from "expo-font";
import Toast from "react-native-toast-message";
//Redux
import { Provider } from "react-redux";
import store from "./Redux/store";
//Navigators
import Main from "./Navigators/Main";

//Context API

import Auth from "./Context/store/Auth";
LogBox.ignoreAllLogs(true);

export default function App() {
  return (
    <Auth>
      <Provider store={store}>
        <NavigationContainer>
          <Header />
          <Main />
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </NavigationContainer>
      </Provider>
    </Auth>
  );
}
