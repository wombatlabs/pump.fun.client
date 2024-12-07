import React, {createContext, useContext, useState, PropsWithChildren, useEffect, useMemo} from 'react';
import {JWTTokensPair, Token, TokenTrade, UserAccount} from "../types.ts";
import {useAccount, useDisconnect} from "wagmi";
import {getTokens, getTrades, signIn} from "../api";
import useIsTabActive from "../hooks/useActiveTab.ts";
import usePoller from "../hooks/usePoller.ts";
import {clearJWTTokens, getJWTTokens} from "../utils/localStorage.ts";
import {decodeJWT} from "../utils";

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
const pageStartTimestamp = Date.now()

export const useClientData = () => useContext(UserDataContext);

export const ClientDataProvider: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [ state, setState ] = useState<ClientState>(defaultState.state)
  const [isLatestDataUpdating, setIsLatestDataUpdating] = useState(false)
  const account = useAccount()
  const { disconnect } = useDisconnect()
  const isTabActive = useIsTabActive()

  const storedJwtTokens = getJWTTokens()
  const jwtUserAddress = useMemo(() => {
    if(storedJwtTokens) {
      try {
        const { address } = decodeJWT(storedJwtTokens.accessToken)
        return address
      } catch (e) {}
    }
    return ''
  }, [storedJwtTokens])

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

  useEffect(() => {
    const autoLogin = async () => {
      try {
        console.log('Autologin: start...')
        if(!storedJwtTokens) {
          console.log('JWT tokens not found in localStorage')
          return
        }
        const data = await signIn({ accessToken: storedJwtTokens.accessToken })
        const { user, tokens } = data
        if(user && tokens) {
          setState(current => {
            return {
              ...current,
              userAccount: user,
              jwtTokens: tokens
            }
          })
          console.log('Autologin: connected user account', data)
        } else {
          console.error('Autologin failed: missing user or tokens', data)
        }
      } catch (e) {
        console.error('Autologin failed, disconnect wallet', e)
        onDisconnect()
      } finally {
      }
    }

    if(
      Date.now() - pageStartTimestamp < 200
      && !storedJwtTokens
      && !state.userAccount?.address
    ) {
      console.log('Metamask not connected, disconnect user')
      onDisconnect()
    } else if(
      Date.now() - pageStartTimestamp < 200
      && account.address
      && !state.userAccount?.address
      && !!storedJwtTokens
      && jwtUserAddress.toLowerCase() === account.address.toLowerCase()
    ) {
      autoLogin()
    }
  }, [
    account.address,
    state.userAccount?.address,
    storedJwtTokens,
    jwtUserAddress,
    pageStartTimestamp
  ]);

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
