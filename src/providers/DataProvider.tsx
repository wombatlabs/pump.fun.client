import React, {createContext, useContext, useState, PropsWithChildren} from 'react';
import {JWTTokensPair, Token, TokenTrade, UserAccount} from "../types.ts";
import {useDisconnect} from "wagmi";
import {clearJWTTokens} from "../utils/localStorage.ts";
import usePoller from "../hooks/usePoller.ts";
import {getHarmonyPrice} from "../api/coingecko.ts";

interface ClientState {
  jwtTokens?: JWTTokensPair
  userAccount?: UserAccount
  latestTrade?: TokenTrade
  latestToken?: Token
  feePercent: bigint
  harmonyPrice: number
}

export interface RhoV2Data {
  state: ClientState,
  setState: (newState: ClientState) => void
  onDisconnect: () => void
}

const getInitialState = (): RhoV2Data => {
  return {
    state: {
      harmonyPrice: 0,
      feePercent: 0n,
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

  const updateHarmonyPrice = async () => {
    try {
      const value = await getHarmonyPrice()
      setState(current => ({
        ...current,
        harmonyPrice: value,
      }))
    } catch (e) {
      console.error('Failed to get harmony one token price', e)
    }
  }

  usePoller(() => {
    updateHarmonyPrice()
  }, 60 * 1000)

  // useEffect(() => {
  //   const loadContractParams = async () => {
  //     try {
  //       const feePercent = await readContract(config, {
  //         address: appConfig.tokenFactoryAddress as `0x${string}`,
  //         abi: TokenFactoryABI,
  //         functionName: 'feePercent',
  //         args: []
  //       }) as bigint
  //       setState(current => ({
  //         ...current,
  //         feePercent
  //       }))
  //     } catch (e) {
  //       console.error('Failed to load contract params', e)
  //     }
  //   }
  //   loadContractParams()
  // }, []);

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
