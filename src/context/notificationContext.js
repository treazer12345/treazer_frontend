import React, { createContext, useReducer } from "react";
import { initialState, reducer } from "../reducer/notificationReducer";
export const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};
