import React, { createContext, useReducer } from "react";
import { initialState, reducer } from "../reducer/orderreducer";
export const OrderContext = createContext();

export const OrderContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
};
