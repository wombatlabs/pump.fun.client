import {JwtTokenPayload} from "../types.ts";

export const decodeJWT = (token: string): JwtTokenPayload => {
  const arrayToken = token.split('.');
  return JSON.parse(atob(arrayToken[1]))
}

export const shortEthAddress = (address: string) => {
  address = String(address).trim().toLowerCase();
  if (!address.startsWith('0x')) {
    address = '0x' + address;
  }
  return address.slice(0, 6) + '...' + address.slice(-4);
}
