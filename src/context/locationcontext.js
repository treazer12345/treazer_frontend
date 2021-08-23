import React, { createContext, useReducer } from "react";
import { initialState, reducer } from "../reducer/locationReducer";
export const LocationContext = createContext();

export const LocationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <LocationContext.Provider value={{ state, dispatch }}>
      {children}
    </LocationContext.Provider>
  );
};
