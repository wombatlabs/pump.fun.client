import React, {createContext, useContext, useState, PropsWithChildren} from 'react';
import {JWTTokensPair, Token, TokenTrade, UserAccount} from "../types.ts";
import {useDisconnect} from "wagmi";
import {clearJWTTokens} from "../utils/localStorage.ts";

interface ClientState {
  jwtTokens?: JWTTokensPair
  userAccount?: UserAccount
  latestTrade?: TokenTrade
  latestToken?: Token
}

export interface RhoV2Data {
  state: ClientState,
  setState: (newState: ClientState) => void
  onDisconnect: () => void
}

const getInitialState = (): RhoV2Data => {
  return {
    state: {
      jwtTokens: undefined,
      userAccount: undefined,
    },
    setState: () => {},
    onDisconnect: () => {},
  }
}

const defaultState = getInitialState()
const UserDataContext = createContext(defaultState);

export const useClientData = () => useContext(UserDataContext);

export const ClientDataProvider: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [ state, setState ] = useState<ClientState>(defaultState.state)
  const { disconnect } = useDisconnect()

  const onDisconnect = async () => {
    setState(current => {
      return {
        ...current,
        userAccount: undefined,
        jwtTokens: undefined,
      }
    })
    clearJWTTokens()
    disconnect()
    console.log('User account disconnected')
  };

  return <UserDataContext.Provider value={{
    state,
    setState,
    onDisconnect
  }}>
    {children}
  </UserDataContext.Provider>
};
