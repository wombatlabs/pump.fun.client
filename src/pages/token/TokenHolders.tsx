import {Box, Text} from "grommet";
import {useEffect, useState} from "react";
import {Token, TokenBalance} from "../../types.ts";
import {getTokenBalances} from "../../api";
import Decimal from 'decimal.js'
import {UserTag} from "../../components/UserTag.tsx";
import usePoller from "../../hooks/usePoller.ts";
import useActiveTab from "../../hooks/useActiveTab.ts";

export const TokenHolders = (props: {
  token?: Token
}) => {
  const { token } = props

  const isTabActive = useActiveTab()
  const [holders, setHolders] = useState<TokenBalance[]>([])

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

  useEffect(() => {
    loadData()
  }, [token?.address]);

  usePoller(() => {
    if(isTabActive) {
      loadData()
    }
  }, 2000)

  return <Box>
    <Box>
      <Text size={'20px'}>Holder distribution</Text>
    </Box>
    <Box margin={{ top: '16px' }}>
      {holders.length === 0 &&
        <Text>No holders found</Text>
      }
      <table>
        <tbody>
        {holders.map((item, index) => {
          const percent = token && new Decimal(token.totalSupply).gt(0)
            ? new Decimal(item.balance).div(token.totalSupply).mul(100).toFixed(3)
            : '0'
          return <tr key={item.id}>
            <td>
              <Text size={'16px'}>{index + 1}. <UserTag user={item.user} /></Text>
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
