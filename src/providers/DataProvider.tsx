import React, {createContext, useContext, useState, PropsWithChildren} from 'react';
import {JWTTokensPair, Token, TokenTrade, UserAccount} from "../types.ts";
import {useDisconnect} from "wagmi";
import {getTokens, getTrades} from "../api";
import useIsTabActive from "../hooks/useActiveTab.ts";
import usePoller from "../hooks/usePoller.ts";
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
      latestTrade: undefined,
      latestToken: undefined
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
  const [isLatestDataUpdating, setIsLatestDataUpdating] = useState(false)
  const { disconnect } = useDisconnect()
  const isTabActive = useIsTabActive()

  const updateLatestData = async () => {
    try {
      setIsLatestDataUpdating(true)
      // const offset = Math.random() < 0.5 ? 0 : 1;
      const [trades, tokens] = await Promise.allSettled([
        getTrades({ limit: 1 }),
        getTokens({ limit: 1 }),
      ])
      setState(current => {
        const newState = {...current}
        if(trades.status === 'fulfilled' && trades.value.length > 0) {
          newState.latestTrade = trades.value[0]
        }
        if(tokens.status === 'fulfilled' && tokens.value.length > 0) {
          newState.latestToken = tokens.value[0]
        }
        return newState
      })
    } catch (e) {
      console.error('Failed to update latest data', e)
    } finally {
      setIsLatestDataUpdating(false)
    }
  }

  usePoller(() => {
    if(isTabActive && !isLatestDataUpdating) {
      updateLatestData()
    }
  }, 10 * 1000)

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
