export const initialState = {
  latitude: null,
  longitude: null,
  locality: null,
  landmark: null,
};

export const reducer = (state, action) => {
  if (action.type === "SET_LOCATION") {
    return {
      ...state,
      latitude: action.payload.latitude,
      longitude: action.payload.longitude,
    };
  } else if (action.type === "SET_LOCATION_ADDRESS") {
    return {
      ...state,
      locality: action.payload.locality,
      landmark: action.payload.landmark,
    };
  }
};
