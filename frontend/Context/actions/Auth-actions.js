import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-community/async-storage";
import Toast from "react-native-toast-message";

export const SET_CURRENT_USER = "SET_CURRENT_USER";

export const loginuser = (user, dispatch) => {
  let data = {
    method: "POST",
    credentials: "same-origin",
    mode: "same-origin",
    body: JSON.stringify(user),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  fetch(`https://easybuy0.herokuapp.com/api/v1/users/login`, data)
    .then((response) => response.json()) // promise
    .then((data) => {
      if (data) {
        const token = data.token;
        AsyncStorage.setItem("jwt", token);
        const decoded = jwt_decode(token);
        dispatch(setCurrentUser(decoded, user));
      } else {
        logoutUser(dispatch);
      }
    })
    .catch((err) => {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please provide correct credentials",
        text2: "",
      });
      logoutUser(dispatch);
    });
};

export const getUserProfile = (id) => {
  fetch(`https://easybuy0.herokuapp.com/api/v1/users/${id}`, {
    method: "GET",
    body: JSON.stringify(user),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
};

export const logoutUser = (dispatch) => {
  AsyncStorage.removeItem("jwt");
  dispatch(setCurrentUser({}));
};

export const setCurrentUser = (decoded, user) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
    userProfile: user,
  };
};
