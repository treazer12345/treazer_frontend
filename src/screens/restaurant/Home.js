import React, { useContext, useState, useEffect } from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import {
  StyleSheet,
  Dimensions,
  View,
  FlatList,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Refresh from "../refresh";
import Axios from "axios";
import BASE_URL from "../../api";
import { ProductContext } from "../../context/productcontext";
import { RestaurentContext } from "../../context/restaurentContext";
import { LocationContext } from "../../context/locationcontext";
import { useNavigation } from "@react-navigation/native";
import Header from "./header";
import ImageSlider from "./imageSlider";
import Restaurantlist from "./restaurantlist";
import Restaurantcard from "./restaurantcard";

const { width, height } = Dimensions.get("window");

const Home = () => {
  // const resturantId = user && user.resturantId?._id;
  // console.log(width, height);
  const { state: productState, dispatch: productDispatch } =
    useContext(ProductContext);
  const navigation = useNavigation();
  const [dishFilterReq, setDishFilterReq] = useState(true);

  const { state: restaurentState, dispatch: restaurentDispatch } =
    useContext(RestaurentContext);
  const { state: locationState } = useContext(LocationContext);
  useEffect(() => {
    if (
      !restaurentState.allRestaurent ||
      restaurentState.allRestaurent.length === 0
    ) {
      getAllRestaurent();
    }
  }, []);
  const [restLoading, setRestLoading] = useState(true);
  const getAllRestaurent = () => {
    setRestLoading(false);
    Axios.post(`${BASE_URL}/api/resturant/getNearbyResturant`, {
      longitude: locationState.longitude ? locationState.longitude : "",
      latitude: locationState.latitude ? locationState.latitude : "",
    })
      .then((res) => {
        // console.log(res.data);
        const { data } = res.data;
        // console.log(nearestResturants);
        restaurentDispatch({
          type: "GET_ALL_RESTAURENT",
          payload: data,
        });
        setRestLoading(true);
      })
      .catch((err) => console.log(err));
  };
  const categoryData = [
    {
      id: 1,
      name: "Rice",
      icon: require("../../assets/icons/Rice.webp"),

    },
    {
      id: 2,
      name: "Noodles",
      icon: require("../../assets/icons/noodles.webp"),
    },
    {
      id: 3,
      name: "Mughlai",
      icon: require("../../assets/icons/muglai.webp"),
    },
    {
      id: 4,
      name: "Fast Food",
      icon: require("../../assets/icons/fast food.webp"),
    },
    {
      id: 5,
      name: "Chinese",
      icon: require("../../assets/icons/Chainese.webp"),
    },
    {
      id: 6,
      name: "Cake",
      icon: require("../../assets/icons/Cake.webp"),
    },
    {
      id: 7,
      name: "Tandoori",
      icon: require("../../assets/icons/Tanduri.webp"),
    },
    {
      id: 8,
      name: "Thali",
      icon: require("../../assets/icons/Thali.webp"),
    },
    {
      id: 9,
      name: "Desserts",
      icon: require("../../assets/icons/desert.webp"),
    },
    {
      id: 10,
      name: "Others",
      icon: require("../../assets/icons/Others.webp"),
    },
  ];

  const onSelectCategory = (category) => {
    //filter restaurant
    if (
      productState.filtered_products &&
      productState.filtered_products[0] &&
      productState.filtered_products[0].category === category
    ) {
      navigation.navigate("Home", {
        screen: "Filter_product",
        params: { name: category },
      });
    } else {
      setDishFilterReq(false);
      Axios.post(`${BASE_URL}/api/product/filterCategory`, { category })
        .then((res) => {
          // console.log(res.data);
          const { products } = res.data;
          productDispatch({ type: "FILTER_PRODUCT", payload: products });
          setDishFilterReq(true);
          navigation.navigate("Home", {
            screen: "Filter_product",
            params: { name: category },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const renderHeader = () => {
    return <Header />;
  };

  const renderMainCategories = () => {
    const images = [
      require("../../assets/images/IMG-20210330-WA0001.webp"),
      require("../../assets/images/preview.webp"),
    ];

    const renderItem = ({ item }) => {
      return (
        <Restaurantlist
          item={item}
          onSelectCategory={onSelectCategory}
          dishFilterReq={dishFilterReq}
        />
      );
    };

    return (
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: "#ffffff",
          height: 330,
          flexGrow: 0,
        }}>
        <ImageSlider images={images} />

        <FlatList
          data={categoryData}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{
            marginTop: 5,
            paddingTop: 10,
            paddingBottom: 10,
            height: 120,
          }}
        />
      </View>
    );
  };

  return (
    <Refresh>
      <SafeAreaView
        style={{
          backgroundColor: "#ffffff",
          marginBottom: 5,
          height: height * 0.95,
        }}>
        {renderHeader()}
        <ScrollView>
          {renderMainCategories()}
          <View
            style={{
              backgroundColor: "#ffffff",
              paddingHorizontal: 20,
              marginTop: 10,
            }}>
            {restLoading ? (
              <Restaurantcard />
            ) : (
              <View
                style={{
                  width: width * 0.8,
                  height: height * 0.3,
                  justifyContent: "space-between",
                  marginHorizontal: "auto",
                  marginVertical: "auto",
                  backgroundColor: "#ffffff",
                  // alignItems: "center",
                }}>
                <Skeleton variant='text' animation='wave' />
                <Skeleton
                  variant='circle'
                  width={60}
                  height={60}
                  animation='wave'
                />
                <Skeleton variant='text' animation='wave' />
                <Skeleton variant='text' animation='wave' />
                <Skeleton variant='text' animation='wave' />
                <Skeleton
                  variant='rect'
                  width={width * 0.8}
                  height={height * 0.2}
                  animation='wave'
                />
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Refresh>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
});

export default Home;
