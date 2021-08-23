import React, { createContext, useReducer } from "react";
import { initialState, reducer } from "../reducer/postReducer";
export const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <PostContext.Provider value={{ state, dispatch }}>
      {children}
    </PostContext.Provider>
  );
};
