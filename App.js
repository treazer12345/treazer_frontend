import React from "react";
import dynamic from "next/dynamic";
import { useClearCache } from "react-clear-cache";
import { Dimensions, View, ActivityIndicator } from "react-native";
const { width, height } = Dimensions.get("window");
const Rootnavigation = dynamic(
  () => import("./src/navigation/rootnavigation"),
  {
    loading: () => (
      <View
        style={{
          width,
          height,
          justifyContent: "center",
          marginHorizontal: "auto",
          marginVertical: "auto",
          backgroundColor: "#ffffff",
          alignItems: "center",
        }}>
        <ActivityIndicator
          size='large'
          color='#82b1ff'
          style={{
            margin: "auto",
          }}
        />
      </View>
    ),
    ssr: false,
  }
);
// import Rootnavigation from "./src/navigation/rootnavigation";
import { UserContextProvider } from "./src/context/userContext";
import { RestaurentContextProvider } from "./src/context/restaurentContext";
import { ProductContextProvider } from "./src/context/productcontext";
import { CartContextProvider } from "./src/context/cartContext";
import { LocationContextProvider } from "./src/context/locationcontext";
import { OrderContextProvider } from "./src/context/ordercontext";
import { NotificationContextProvider } from "./src/context/notificationContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-native-paper";
import { StylesProvider } from "@material-ui/styles";
import { PostContextProvider } from "./src/context/postContext";

const Main = () => {

  return (
    <StylesProvider injectFirst>
      <Provider>
        <SafeAreaProvider>
          <PostContextProvider>
            <NotificationContextProvider>
              <OrderContextProvider>
                <LocationContextProvider>
                  <CartContextProvider>
                    <ProductContextProvider>
                      <RestaurentContextProvider>
                        <UserContextProvider>
                          <Rootnavigation />
                        </UserContextProvider>
                      </RestaurentContextProvider>
                    </ProductContextProvider>
                  </CartContextProvider>
                </LocationContextProvider>
              </OrderContextProvider>
            </NotificationContextProvider>
          </PostContextProvider>
        </SafeAreaProvider>
      </Provider>
    </StylesProvider>
  );
};

const App = () => {
  const { isLatestVersion, emptyCacheStorage } = useClearCache();
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {!isLatestVersion ? (
        <p>
          <a
            href='#'
            onClick={(e) => {
              e.preventDefault();
              emptyCacheStorage();
            }}>
            Update version
          </a>
        </p>
      ) : (
        <Main />
      )}
    </View>
  );
};
export default App;


