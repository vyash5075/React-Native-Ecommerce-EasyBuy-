import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Error from "../../Shared/Error";
import Input from "../../Shared/Form/Input";
import axios from "axios";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import Toast from "react-native-toast-message";
const Register = (props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const register = () => {
    if (email === "" || name === "" || phone === "" || password === "") {
      setError("Please fill in the form correctly !!");
    }

    let user = {
      name: name,
      email: email,
      passwordHash: password,
      phone: phone,
      isAdmin: false,
    };
    axios
      .post(`https://easybuy0.herokuapp.com/api/v1/users`, user)
      .then((res) => {
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Registration Succeeded",
          text2: "Please Login into your account",
        });
        setTimeout(() => {
          props.navigation.navigate("Login");
        }, 500);
      })
      .catch((error) => {
        console.warn(error);

        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
  };
  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <FormContainer title="Register">
        <Input
          placeholder={"Name"}
          name={"name"}
          id={"name"}
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder={"Phone Number"}
          name={"phone"}
          id={"phone"}
          keyboardType={"numeric"}
          onChangeText={(text) => setPhone(text)}
        />
        <Input
          placeholder={"Email"}
          name={"email"}
          id={"email"}
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />
        <Input
          placeholder={"Password"}
          name={"password"}
          id={"password"}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        <View>{error ? <Error message={error} /> : null}</View>
        <View style={styles.buttonGroup}>
          <EasyButton primary large onPress={() => register()}>
            <Text style={{ color: "white", fontSize: 20 }}>Register</Text>
          </EasyButton>
        </View>
        <View style={[{ marginTop: 40 }, styles.buttonGroup]}>
          <Text style={styles.middleText}>Already Have an Account?</Text>
          <EasyButton
            large
            danger
            title="Login"
            onPress={() => props.navigation.navigate("Login")}
          >
            <Text style={{ color: "white", fontSize: 20 }}>Login </Text>
          </EasyButton>
        </View>
      </FormContainer>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "80%",
    margin: 10,
    alignItems: "center",
  },
  middleText: {
    marginBottom: 20,
    alignSelf: "center",
  },
});

export default Register;
