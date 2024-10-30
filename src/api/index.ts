import axios from 'axios'
import {Token, UserAccount} from "../types.ts";

const baseURL = 'http://localhost:8085' //'https://pump-fun-backend.fly.dev'

const client = axios.create({
  baseURL
})

export const createUser = async (params: { address: string }) => {
  const {data} = await client.post<UserAccount>('/user', {
    address: params.address
  })
  return data
}

export const getUserByAddress = async (params: { address: string }) => {
  const {data} = await client.get<UserAccount>(`/user/${params.address}`)
  return data
}

export interface GetTokensParams {
  limit?: number
  offset?: number
}

export const getTokens = async (params: GetTokensParams = {}) => {
  const {limit = 100, offset = 0} = params

  const {data} = await client.get<Token[]>('/tokens', {
    params: {
      ...params,
      limit,
      offset
    }
  })
  return data
}
