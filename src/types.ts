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

export interface Token {
  id: string;
  txnHash: string
  blockNumber: string
  address: string
  symbol: string
  name: string
  timestamp: string
  createdAt: string
  updatedAt: string
  user: UserAccount | null
}

export interface TokenMetadata {
  userAddress: string
  name: string
  ticker: string
  description: string
  image: string
}
