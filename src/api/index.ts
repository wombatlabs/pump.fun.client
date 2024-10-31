import axios from 'axios'
import {Token, UserAccount, UserComment} from "../types.ts";

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
