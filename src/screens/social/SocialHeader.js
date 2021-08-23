import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Badge } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/userContext";
import { NotificationContext } from "../../context/notificationContext";
const SocialHeader = () => {
  const navigation = useNavigation();
  const { state: userState } = useContext(AuthContext);
  const { state: notiState } = useContext(NotificationContext);

  return (
    <View style={{ backgroundColor: "#ffffff" }}>
      <View
        style={{
          coureser: "pointer",
          flexDirection: "row",
          height: 50,
          backgroundColor: "white",
        }}>
        <View
          style={{
            flex: 1,
          }}>
          <img
            src={require("../../assets/images/brand_logo.png")}
            alt='Treazer'
            style={{
              marginLeft: 10,
              marginTop: 10,
              width: 140,
              height: 40,
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Notification")}
          style={{
            width: 50,
            paddingRight: 15,
            justifyContent: "center",
          }}>
          <View>
            <svg
              aria-hidden='true'
              focusable='false'
              data-prefix='fas'
              data-icon='bell'
              className='svg-inline--fa fa-bell fa-w-14'
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 448 512'
              width={20}
              height={20}
              style={{
                marginTop: 10
              }}
            >
              <path
                fill='#00A7FF'
                d='M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z'></path>
            </svg>

            {userState &&
              userState.notifications &&
              userState.notifications.length > 0 && (
                <Badge
                  status='error'
                  value={userState.notifications.length}
                  containerStyle={{
                    position: "absolute",
                    top: 2,
                    right: 6,
                  }}
                />
              )}
            {notiState &&
              notiState.userNotifications &&
              notiState.restaurantNotifications ? (
              <Badge
                status='error'
                value={
                  notiState.userNotifications.length +
                  notiState.restaurantNotifications.length
                }
                containerStyle={{
                  position: "absolute",
                  top: 2,
                  right: 6,
                }}
              />
            ) : notiState && notiState.restaurantNotifications ? (
              <Badge
                status='error'
                value={notiState.restaurantNotifications.length}
                containerStyle={{
                  position: "absolute",
                  top: 2,
                  right: 6,
                }}
              />
            ) : notiState && notiState.userNotifications ? (
              <Badge
                status='error'
                value={notiState.userNotifications.length}
                containerStyle={{
                  position: "absolute",
                  top: 2,
                  right: 6,
                }}
              />
            ) : (
              <Badge
                status='error'
                value={0}
                containerStyle={{
                  position: "absolute",
                  top: 2,
                  right: 6,
                }}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SocialHeader;

const styles = StyleSheet.create({});
