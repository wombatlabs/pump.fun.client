export interface UserAccount {
  id: string
  address: string
  username: string
  createdAt: string
  updatedAt: string
}

export interface UserComment {
  id: string
  text: string
  token: Token
  user: UserAccount
  createdAt: string
}

export interface TokenUriData {
  userAddress: string
  name: string
  ticker: string
  description: string
  image: string
}

export interface Token {
  id: string;
  txnHash: string
  blockNumber: number
  address: string
  name: string
  symbol: string
  uri: string
  uriData: TokenUriData | null
  timestamp: string
  createdAt: string
  updatedAt: string
  user: UserAccount | null
}

export interface TokenMetadata {
  userAddress: string
  name: string
  symbol: string
  description: string
  image: string
}

export type TokenTradeType = 'buy' | 'sell'

export interface TokenTrade {
  id: string
  txnHash: string
  blockNumber: number
  type: TokenTradeType
  user: UserAccount
  amountIn: string
  amountOut: string
  fee: string
  timestamp: string
  createdAt: string
}
