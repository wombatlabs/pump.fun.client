import {JwtTokenPayload} from "../types.ts";

export const decodeJWT = (token: string): JwtTokenPayload => {
  const arrayToken = token.split('.');
  return JSON.parse(atob(arrayToken[1]))
}
