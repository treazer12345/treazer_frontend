import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import { Icon } from "react-native-elements";
import * as Sharing from "expo-sharing";
import "./mui.css";

const Profilelist = ({ route, logout }) => {
  const accountId = route?.params?.userId;

  const navigation = useNavigation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }

    await Sharing.shareAsync(`https://treazer-app.firebaseapp.com/social/friend/${accountId}`);
  };

  return (
    <View>
      <IconButton
        aria-label='more'
        aria-controls='long-menu'
        aria-haspopup='true'
        style={{
          marginRight: 20,
        }}>
        <Icon
          name='cog'
          type='font-awesome-5'
          color='#757575'
          onPress={handleClick}
          size={20}
        />
      </IconButton>
      <Menu
        id='long-menu'
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        style={{
          display: "flex",
        }}
        PaperProps={{
          style: {
            maxHeight: 300,
            width: 70,
            marginTop: 30,
            boxShadow: "none",
            background: "none",
          },
        }}>
        <TouchableOpacity
          onPress={openShareDialogAsync}
          style={{
            marginTop: 10,
          }}>
          <Icon
            name='share-alt'
            type='font-awesome-5'
            color='#757575'
            size={20}
            containerStyle={{
              marginTop: 20,
              width: 40,
              height: 30,
              borderRadius: 25,
              boxShadow: "1px 3px 6px 1px #C9CCD1",
            }}
            iconStyle={{
              marginTop: 5,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("User", { screen: "About" });
            handleClose();
          }}
          style={{
            marginTop: 20,
            marginBottom: 10,
          }}>
          <Icon
            name='check-circle'
            type='font-awesome-5'
            color='#757575'
            size={20}
            containerStyle={{
              width: 40,
              height: 30,
              borderRadius: 25,
              boxShadow: "1px 3px 6px 1px #C9CCD1",
            }}
            iconStyle={{
              marginTop: 5,
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("User", { screen: "PrivecyPolicy" });
            handleClose();
          }}
          style={{
            marginVertical: 10,
          }}>
          <Icon
            name='question-circle'
            type='font-awesome-5'
            color='#757575'
            size={20}
            containerStyle={{
              width: 40,
              height: 30,
              borderRadius: 25,
              boxShadow: "1px 3px 6px 1px #C9CCD1",
            }}
            iconStyle={{
              marginTop: 5,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("User", { screen: "RefundPolicy" });
            handleClose();
          }}
          style={{
            marginVertical: 10,
          }}>
          <Icon
            name='money-bill-alt'
            type='font-awesome-5'
            color='#757575'
            size={20}
            containerStyle={{
              width: 40,
              height: 30,
              borderRadius: 25,
              boxShadow: "1px 3px 6px 1px #C9CCD1",
            }}
            iconStyle={{
              marginTop: 5,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={logout}
          style={{
            marginVertical: 10,
          }}>
          <Icon
            name='sign-out-alt'
            type='font-awesome-5'
            color='#757575'
            size={20}
            containerStyle={{
              width: 40,
              height: 30,
              borderRadius: 25,
              boxShadow: "1px 3px 6px 1px #C9CCD1",
            }}
            iconStyle={{
              marginTop: 5,
            }}
          />
        </TouchableOpacity>
      </Menu>
    </View>
  );
};

export default Profilelist;

const styles = StyleSheet.create({});
