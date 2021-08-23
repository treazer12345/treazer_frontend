import React, { useContext } from "react";
import {
  View
} from "react-native";
import { AuthContext } from "../../context/userContext";
import { NotificationContext } from "../../context/notificationContext";

import NoNotifications from "./noNotifications"
import AllNotifications from "./allNotifications";
import Axios from "axios";
import BASE_URL from "../../api";


const Notification = () => {
  const { state: userState } = useContext(AuthContext);
  const { state: notiState, dispatch: notiDispatch } = useContext(
    NotificationContext
  );

  const user = JSON.parse(localStorage.getItem("user"));
  const resturantId = user && user.resturantId?._id;
  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");

  const deleteNotification = (notiId, resNotiId, notiUserId) => {
    // console.log(notiId, resNotiId, notiUserId);
    let reqBody = {};
    if (
      resNotiId !== undefined
    ) {
      reqBody = { notiId, resturantId: resNotiId };
    } else if (
      notiUserId !== undefined
    ) {
      reqBody = { notiId, userId: notiUserId };
    }
    Axios.post(`${BASE_URL}/api/notification/deleteNotification`, reqBody, {
      headers: {
        "x-token": token,
        "x-refresh-token": refreshtoken,
      },
    })
      .then((res) => {
        console.log(res.data.msg, notiId);
        if (
          resNotiId !== undefined &&
          resturantId.toString() === resNotiId.toString()
        ) {
          notiDispatch({
            type: "DELETE_RESTAURANT_NOTIFICATION",
            payload: notiId,
          });
        } else if (
          notiUserId !== undefined &&
          notiUserId.toString() === user._id.toString()
        ) {
          notiDispatch({
            type: "DELETE_USER_NOTIFICATION",
            payload: notiId,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };



  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff", width: "100%" }}>
      <AllNotifications notiState={notiState} deleteNotification={deleteNotification} />
      {notiState.userNotifications === null && (
        <NoNotifications isLogin={userState.isLogin} />
      )}
      {notiState.userNotifications && notiState.userNotifications.length === 0 && (
        <NoNotifications isLogin={userState.isLogin} />
      )}
    </View>
  );
};

export default Notification;

