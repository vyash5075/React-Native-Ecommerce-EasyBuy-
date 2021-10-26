import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Error from "../../Shared/Error";
import Input from "../../Shared/Form/Input";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
//Context
import AuthGlobal from "../../Context/store/AuthGlobal";
import { loginuser } from "../../Context/actions/Auth-actions";

const Login = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (context.stateUser.isAuthenticated === true) {
      props.navigation.navigate("User Profile");
    }
  }, [context.stateUser.isAuthenticated]);

  const handleSubmit = () => {
    const user = { email, password };

    if (email === "" || password === "") {
      setError("Please fill in your credentials");
    } else {
      loginuser(user, context.dispatch);
      setPassword("");
      setEmail("");
    }
  };

  const onchangetext = (text, c_email, c_password) => {
    if (c_email === null) {
      setPassword(text);
    }
    if (c_password === null) {
      setEmail(text.toLowerCase());
    }
    if (email !== "" && password !== "") {
      setError("");
    }
    if (email === "" || password === "") {
      setError("Please fill in your credentials");
    }
  };
  return (
    <FormContainer title={"Login"}>
      <Input
        placeholder={"Enter Email"}
        name={"email"}
        id={"email"}
        value={email}
        onChangeText={(text) => onchangetext(text, "email", null)}
      />
      <Input
        placeholder={"Enter Password"}
        name={"password"}
        id={"password"}
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => onchangetext(text, null, "password")}
      />
      {error ? <Error message={error}></Error> : null}
      <View style={styles.buttonGroup}>
        <EasyButton primary large onPress={() => handleSubmit()}>
          <Text style={{ color: "white", fontSize: 20 }}>Login</Text>
        </EasyButton>
      </View>
      <View style={[{ marginTop: 40 }, styles.buttonGroup]}>
        <Text style={styles.middleText}>Don't Have an account yet?</Text>
        <EasyButton
          danger
          large
          title="Register"
          onPress={() => props.navigation.navigate("Register")}
        >
          <Text style={{ color: "white", fontSize: 20 }}>Register</Text>
        </EasyButton>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "80%",
    paddingLeft: 0,
    alignItems: "center",
  },
  middleText: {
    marginBottom: 20,
    alignSelf: "center",
  },
});

export default Login;
