import React, { createContext, useReducer } from "react";
import { initialState, reducer } from "../reducer/userReducer";
export const AuthContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
