import React, {createContext, useContext, useState, PropsWithChildren} from 'react';
import {UserAccount} from "../types.ts";

interface ClientState {
  userAccount?: UserAccount
}

export interface RhoV2Data {
  state: ClientState,
  setState: (newState: ClientState) => void
}

const getInitialState = (): RhoV2Data => {
  return {
    state: {
      userAccount: undefined
    },
    setState: () => {},
  }
}

const defaultState = getInitialState()
const UserDataContext = createContext(defaultState);

export const useClientData = () => useContext(UserDataContext);

export const ClientDataProvider: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [ state, setState ] = useState<ClientState>(defaultState.state)

  return <UserDataContext.Provider value={{
    state,
    setState,
  }}>
    {children}
  </UserDataContext.Provider>
};
