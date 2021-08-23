import BASE_URL from "../api";

import Axios from "axios";
import { getNotifications } from "./notificationfunction";
import * as Speech from "expo-speech";
import * as PusherPushNotifications from "@pusher/push-notifications-web";



const beamsClient = new PusherPushNotifications.Client({
  instanceId: "36674458-c456-44a3-823b-616088fa88e1",
});

const speak = (name) => {
  const thingToSay = `Welcome ${name}`;
  Speech.speak(thingToSay);
};

const singleUser = (userId, token, refreshtoken, dispatch, navigation) => {
  Axios.get(`${BASE_URL}/api/user/${userId}/profile`, {
    headers: {
      // Authorization: `Bearer ${token}`,
      "x-token": token,
      "x-refresh-token": refreshtoken,
    },
  })
    .then((res) => {
      const { user } = res.data;
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "USER_PROFILE", payload: user });
      navigation.navigate("User", {
        screen: "Profile",
        params: { userId: user._id.toString() },
      });
    })
    .catch((err) => console.log(err));
};
const handleLogin = (
  phoneNo,
  password,
  dispatch,
  setPhoneNo,
  setPassword,
  toggleDrawer,
  setSendReq,
  setPhoneError,
  setPassError,
  navigation
) => {
  setSendReq(false);
  Axios.post(`${BASE_URL}/api/user/login`, { phone: phoneNo, password })
    .then((res) => {
      const { user, token, refreshtoken } = res.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("refresh-token", refreshtoken);
      setPhoneNo("");
      setPassword("");
      setSendReq(true);
      toggleDrawer();
      dispatch({ type: "ADD_USER", payload: user });
      navigation.navigate("User", {screen:"Profile",params: { userId: user._id.toString() }})
      if (user) {
        beamsClient
          .start()
          .then((deviceId) =>
            console.log(
              "Successfully registered with Beams. Device ID:",
              deviceId
            )
          ).then(() => {
            const beamsTokenProvider = new PusherPushNotifications.TokenProvider({
              url: `${BASE_URL}/pusher/beams-auth`,
              headers: {
                "x-token": token,
                "x-refresh-token": refreshtoken,
              },
            })
            beamsClient.addDeviceInterest(user._id.toString())
              .then(() => console.log("Successfully registered and subscribed!"))
              .then(() => beamsClient.getDeviceInterests())
              .then((interests) => {
                console.log("Current interests:", interests);
              })
              .then(() =>
                beamsClient.setUserId(user._id.toString(), beamsTokenProvider)
              )
              .then(() => {
                speak(user.username);
                console.log("User ID has been set");
              })
              .then(() => beamsClient.getUserId())
              .catch((e) => console.error("Could not authenticate with Beams:", e));
          })
      }
    })
    .catch((err) => {
      const error = err.response && err.response.data;
      setSendReq(true);
      if (error && error.phone) {
        setPhoneError(error.phone);
      }
      if (error && error.password) {
        setPassError(error.password);
      }
    });
};

//
const handleSignup = (
  username,
  password_2,
  confirmPassword,
  phoneNo_2,
  setUsername,
  setPassword_2,
  setConfirmPassword,
  setPhoneNo_2,
  setUsernameError,
  setPasswordError,
  setConfirmPassError,
  setPhoneError2,
  setOpen,
  setSignedIn,
  setSendReq,
  setDrawer_2,
  notiDispatch,
  setSignupError,
  photo,
  setPhoto

) => {
  // console.log(username, phoneNo_2, password_2, confirmPassword);
  let phoneMatch = /^\d{10}$/;
  // let usernameMatch = /^[a-z][^\W_]{7,14}$/;
  // let passwordMatch = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  if (!username) {
    setUsernameError("Put username");
  } else if (!password_2) {
    setPasswordError("Put password");
  } else if (!confirmPassword || password_2 !== confirmPassword) {
    setConfirmPassError("Please re-type password");
  } else if (!phoneNo_2 || !phoneMatch.test(phoneNo_2)) {
    setPhoneError2("Please enter 10 digit phone no.");
  } else {
    setSendReq(false);
    Axios.post(`${BASE_URL}/api/user/signup`, {
      username,
      password: password_2,
      phone: phoneNo_2,
      photo
    })
      .then((res) => {
        const { user, success } = res.data;
        getNotifications(user._id, undefined, notiDispatch);

        setSignedIn(success);
        setUsername("");
        setPassword_2("");
        setConfirmPassword("");
        setPhoneNo_2("");
        setPhoto("");
        setOpen(true);
        setSendReq(true);
        setDrawer_2(false);
      })
      .catch((err) => {
        let error;
        if (err.response && err.response.data.username) {
          error = err.response.data.username;
          console.log(error);
          setUsernameError(error);
        } else {
          setSignupError(err.response.data);
          console.log(err);
        }

        setSendReq(true);
      });
  }
};
export { singleUser, handleLogin, handleSignup };

