import {JwtTokenPayload} from "../types.ts";
import moment from "moment-timezone";
import {appConfig} from "../config.ts";

const competitionTimezone = 'America/Los_Angeles'

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

export const getCompetitionEndTimestamp = (
  timestampStart: string
) => {
  return (moment(+timestampStart * 1000 + appConfig.competitionDuration)
      .tz(competitionTimezone)
      .unix())
  * 1000
}
