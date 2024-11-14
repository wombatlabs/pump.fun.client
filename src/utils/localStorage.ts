import {JWTTokensPair} from "../types.ts";

enum LocalStorageKeys {
  jwtTokens = 'jwtTokens',
}

export const storeJWTTokens = (data: JWTTokensPair) => {
  window.localStorage.setItem(LocalStorageKeys.jwtTokens, JSON.stringify(data))
}

export const getJWTTokens = () => {
  const keys = window.localStorage.getItem(LocalStorageKeys.jwtTokens)
  if(keys) {
    try {
      return JSON.parse(keys) as JWTTokensPair
    } catch (e) {}
  }
  return null
}

export const clearJWTTokens = () => {
  window.localStorage.removeItem(LocalStorageKeys.jwtTokens)
}
