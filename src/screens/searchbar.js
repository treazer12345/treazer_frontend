import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SearchBar } from "react-native-elements";
const Searchbar = () => {
  const [search, setSearch] = useState("");
  const updateSearch = (search1) => {
    setSearch(search1);
  };
  return (
    <SearchBar
      placeholder='Search for restaurants...'
      onChangeText={updateSearch}
      value={search}
      round={true}
      lightTheme={true}
      containerStyle={{
        paddingHorizontal: 30,
        backgroundColor: "#ffffff",
        border: "none",
        textAlign: "center",
      }}
      inputContainerStyle={{
        backgroundColor: "#ffffff",
        borderRadius: 30,
        boxShadow: "1px 4px 8px 1px #C9CCD1",
        elevation: 2,
      }}
      platform='android'
      inputStyle={{
        fontSize: 15,
        marginLeft: 10,
        width: "60%",
      }}
      searchIcon={{
        size: 26,
      }}
      leftIconContainerStyle={{
        marginLeft: 15,
        marginTop: 6,
      }}
    />
  );
};

export default Searchbar;

const styles = StyleSheet.create({});
