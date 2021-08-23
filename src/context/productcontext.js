import React, { createContext, useReducer } from "react";
import { initialState, reducer } from "../reducer/productreducer";
export const ProductContext = createContext();

export const ProductContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};
