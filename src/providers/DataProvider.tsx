import React, {createContext, useContext, useState, PropsWithChildren, useEffect} from 'react';
import {Token, TokenTrade, UserAccount} from "../types.ts";
import {useAccount, useDisconnect} from "wagmi";
import {createUser, getTokens, getTrades, getUserByAddress} from "../api";
import useIsTabActive from "../hooks/useActiveTab.ts";
import usePoller from "../hooks/usePoller.ts";

interface ClientState {
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
  const account = useAccount()
  const { disconnect } = useDisconnect()
  const isTabActive = useIsTabActive()

  const updateLatestData = async () => {
    try {
      setIsLatestDataUpdating(true)
      // const offset = Math.random() < 0.5 ? 0 : 1;
      const [trades, tokens] = await Promise.allSettled([
        getTrades({ limit: 1 }),
        getTokens({ limit: 1 })
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
  }, 1000)

  useEffect(() => {
    const autoLogin = async () => {
      try {
        if(account.address) {
          const userAddress = account.address
          let user = await getUserByAddress({ address: userAddress }).catch(_ => _)
          if(!user) {
            user = await createUser({ address: userAddress })
            console.log('Autologin: create user account', userAddress, user)
          }
          setState(current => {
            return {
              ...current,
              userAccount: user
            }
          })
          console.log('Autologin: connected user account', user)
        }
      } catch (e) {
        console.error('Autologin failed, disconnect wallet', e)
        disconnect()
      } finally {
      }
    }
    if(account.address && !state.userAccount?.address) {
      autoLogin()
    }
  }, [account.address, state.userAccount?.address]);

  const onDisconnect = () => {
    disconnect()
    setState(current => {
      return {
        ...current,
        userAccount: undefined
      }
    })
  };

  return <UserDataContext.Provider value={{
    state,
    setState,
    onDisconnect
  }}>
    {children}
  </UserDataContext.Provider>
};
