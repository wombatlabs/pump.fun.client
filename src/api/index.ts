import axios from 'axios'
import {Token, TokenMetadata, TokenTrade, UserAccount, UserComment} from "../types.ts";
import {appConfig} from "../config.ts";

const baseURL = appConfig.apiUrl

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
  search?: string
  limit?: number
  offset?: number
}

export const getTokens = async (params: GetTokensParams = {}) => {
  const {limit = 100, offset = 0, search = ''} = params

  const {data} = await client.get<Token[]>('/tokens', {
    params: {
      search,
      limit,
      offset
    }
  })
  return data
}

export interface GetCommentsParams {
  tokenAddress: string
  limit?: number
  offset?: number
}

export const getTokenComments = async (params: GetCommentsParams) => {
  const {limit = 100, offset = 0, tokenAddress} = params

  const {data} = await client.get<UserComment[]>('/comments', {
    params: {
      tokenAddress,
      limit,
      offset
    }
  })
  return data
}

export interface PostCommentParams {
  tokenAddress: string
  userAddress: string
  text: string
}

export const addComment = async (params: PostCommentParams) => {
  const {data} = await client.post<number>('/comment', params)
  return data
}

export const addTokenMetadata = async (payload: TokenMetadata) => {
  const {data} = await client.post<UserAccount>('/metadata', payload)
  return data
}

export interface GetTradeParams {
  tokenAddress: string
  offset?: number
  limit?: number
}

export const getTrades = async (params: GetTradeParams) => {
  const {limit = 100, offset = 0} = params

  const {data} = await client.get<TokenTrade[]>('/trades', {
    params: {
      ...params,
      limit,
      offset
    }
  })
  return data
}
