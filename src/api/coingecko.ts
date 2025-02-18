import axios from "axios";

interface CoinGeckoPriceResponse {
  [key: string]: {
    [key: string]: number
  }
}

// Coingecko API docs: https://www.coingecko.com/en/api/documentation
export const getTokensPrice = async (tokens: string[], currency = 'usd')=> {
  const ids = tokens.join(',')
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${currency}`
  const { data } = await axios.get<CoinGeckoPriceResponse>(url)
  return data
}

export const getHarmonyPrice = async () => {
  const data = await getTokensPrice(['harmony'])
  return data['harmony'].usd
}
