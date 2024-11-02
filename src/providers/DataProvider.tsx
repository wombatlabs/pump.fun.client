import React, {createContext, useContext, useState, PropsWithChildren, useEffect} from 'react';
import {UserAccount} from "../types.ts";
import {useAccount, useDisconnect} from "wagmi";
import {getUserByAddress} from "../api";

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
  const account = useAccount()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    const autoLogin = async () => {
      try {
        if(account.address) {
          const data = await getUserByAddress({ address: account.address })
          setState(current => {
            return {
              ...current,
              userAccount: data
            }
          })
          console.log('Autologin: connected user account', data)
        }
      } catch (e) {
        console.error('Autologin failed, disconnect wallet', e)
        disconnect()
      }
    }
    if(account.address && !state.userAccount?.address) {
      autoLogin()
    }
  }, [account.address, state.userAccount?.address]);

  return <UserDataContext.Provider value={{
    state,
    setState,
  }}>
    {children}
  </UserDataContext.Provider>
};
