import {Box, Text} from "grommet";
import {useEffect, useState} from "react";
import {Token, TokenBalance} from "../../types.ts";
import {getTokenBalances} from "../../api";
import Decimal from 'decimal.js'

export const TokenHolders = (props: {
  token?: Token
}) => {
  const { token } = props
  const [holders, setHolders] = useState<TokenBalance[]>([])

  useEffect(() => {
    const loadData = async () => {
      if(token) {
        try {
          const data = await getTokenBalances({ tokenAddress: token.address, limit: 20 })
          setHolders(data)
          console.log('Token holders: ', data)
        } catch (e) {
          console.error('Failed to load holders', e)
        }
      }
    }
    loadData()
  }, [token?.address]);

  return <Box>
    <Box>
      <Text size={'20px'}>Holder distribution</Text>
    </Box>
    <Box margin={{ top: '16px' }}>
      <table>
        <tbody>
        {holders.map((item, index) => {
          const percent = token
            ? new Decimal(item.balance).div(token.totalSupply).mul(100).toFixed(3)
            : '0'
          return <tr>
            <td>
              <Text size={'16px'}>{index + 1}. {item.user.username}</Text>
            </td>
            <td>
              <Text size={'16px'}>{percent}%</Text>
            </td>
          </tr>
        })}
        </tbody>
      </table>
    </Box>
  </Box>
}
