import React from "react";
import { Icon } from "react-native-elements";
import {
  StyleSheet,
  // Dimensions,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import SwipeableViews from "react-swipeable-views";
import { useNavigation } from "@react-navigation/native";
import "./mui.css";
import Myorder from "./myorder";
import Restaurentorderlist from "../restaurant/restaurentorderlist";
import Refresh from "../refresh";

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: "#eceff1",
    margin: "auto",
    boxShadow: "0 2px 4px 0 #bdbdbd, 0 3px 6px 0 #bdbdbd",
    borderRadius: 20,
  },
}));
// const { height } = Dimensions.get("window");
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}>
      {value === index && <Box p={2}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

const Orderist = () => {
  const navigation = useNavigation();
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  return (
    <Refresh>
      <View
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
        }}>
        <div className={classes.root}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#ffffff",
              marginBottom: 20,
              marginTop: 10,
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("User", { screen: "Profile" })}
              style={{
                width: 20,
                marginLeft: 15,
                marginTop: 10,
              }}>
              <Icon
                name='angle-left'
                type='font-awesome-5'
                color='#517fa4'
                size={26}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                fontFamily: "Open Sans",
                color: "#455a64",
                marginHorizontal: 20,
                marginTop: 10,
              }}>
              O R D E R S
            </Text>
          </View>
          <AppBar position='static' color='default' className={classes.appbar}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant='scrollable'
              scrollButtons='on'
              indicatorColor='primary'
              textColor='primary'
              aria-label='scrollable force tabs example'>
              <Tab
                icon={
                  <Icon
                    name='clipboard'
                    type='font-awesome-5'
                    color='#517fa4'
                    size={26}
                  />
                }
                {...a11yProps(0)}
              />
              <Tab
                icon={
                  <Icon
                    name='store'
                    type='font-awesome-5'
                    color='#517fa4'
                    size={26}
                  />
                }
                {...a11yProps(1)}
              />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}>
            <TabPanel value={value} index={0} dir={theme.direction}>
              <Myorder />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <Restaurentorderlist />
            </TabPanel>
          </SwipeableViews>
        </div>
      </View>
    </Refresh>
  );
};

export default Orderist;

const styles = StyleSheet.create({});
