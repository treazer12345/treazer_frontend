import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
import React, { useEffect, useRef, useState, useContext } from "react";
import { TouchableOpacity } from "react-native";
import { Dimensions, View } from "react-native";
import { Icon } from "react-native-elements";
import { LocationContext } from "../../context/locationcontext";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker";
import "./site.css";
import Refresh from "../refresh";
import { useNavigation } from "@react-navigation/native";

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken =
  "pk.eyJ1IjoidHJlYXplciIsImEiOiJja2xxYXJsZmgwMmJwMnBtaXR0M25leTY5In0.Iaj3HteMWU5ZQWCniy4KRA";

const { height } = Dimensions.get("window");

export default function Map() {
  const navigation = useNavigation();
  const { state: locationState } = useContext(LocationContext);
  // const [coords, setCoords] = useState(false);
  const mapContainer = useRef();
  const [lng, setLng] = useState(locationState.longitude);
  const [lat, setLat] = useState(locationState.latitude);
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    const nav = new mapboxgl.NavigationControl({ visualizePitch: true });
    map.addControl(nav, "bottom-left");

    new mapboxgl.Marker({
      color: "#d32f2f",
      draggable: false,
    })
      .setLngLat([locationState.longitude, locationState.latitude])
      .addTo(map);

    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      fitBoundsOptions: {
        maxZoom: 18,
      },
    });
    map.addControl(geolocate);

    geolocate.on("geolocate", (data, err) => {
      // console.log(data);
      setLat(data.coords.latitude);
      setLng(data.coords.longitude);
    });
  }, []);

  return (
    <Refresh>
      <View style={{ height, backgroundColor: "#ffffff" }}>
        <View
          style={{
            width: "100%",
            height: height * 0.92,
          }}>
          <div className='map-container-2' ref={mapContainer} />
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Home", { screen: "Index" });
          }}
          style={{
            position: "absolute",
            top: 0,
            width: 30,
            padding: "auto",
            justifyContent: "center",
            marginHorizontal: 10,
            marginVertical: 10,
            borderRadius: 5,
            backgroundColor: "#ffffff",
          }}>
          <Icon
            name='angle-left'
            type='font-awesome-5'
            color='#757575'
            size={26}
            containerStyle={{
              width: 30,
              borderRadius: 5,
              backgroundColor: "#ffffff",
              border: "2px solid #bdbdbd",
            }}
          />
        </TouchableOpacity>
      </View>
    </Refresh>
  );
}
