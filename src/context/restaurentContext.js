import React, { createContext, useReducer } from "react";
import { initialState, reducer } from "../reducer/restaurentReducer";
export const RestaurentContext = createContext();

export const RestaurentContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <RestaurentContext.Provider value={{ state, dispatch }}>
      {children}
    </RestaurentContext.Provider>
  );
};
