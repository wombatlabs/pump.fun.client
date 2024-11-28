import {Box, Text} from "grommet";
import {useEffect, useState} from "react";
import {TokenWinner} from "../../types.ts";
import {getTokenWinners} from "../../api";
import {Image} from "antd";
import moment from "moment/moment";
import {UserTag} from "../../components/UserTag.tsx";
import Decimal from "decimal.js";

export const Leaderboard = () => {
  const [winnerTokens, setWinnerTokens] = useState<TokenWinner[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const items = await getTokenWinners({ limit: 10 })
        setWinnerTokens(items)
      } catch (e) {
        console.error('Failed to load winners', e)
      }
    }
    loadData()
  }, []);

  return <Box align={'center'}>
    <Box>
      <Text size={'20px'} color={'golden'}>Daily Winners 👑</Text>
      <Box gap={'8px'} margin={{ top: '16px' }}>
        {winnerTokens.map(item => {
          const marketCap = new Decimal(item.token.marketCap)

          return <Box justify={'between'}>
            <Box justify={'between'} direction={'row'} gap={'16px'}>
              <Box>
                <Image width={'100px'} src={item.token.uriData?.image} />
              </Box>
              <Box>
                <Text weight={500}>{moment(+item.timestamp * 1000).format('MMM DD, YYYY')}</Text>
                <Text>{item.token.name} ({item.token.symbol})</Text>
                <Text>Market Cap: {marketCap.toFixed(4)} ONE</Text>
                <Text>Created by <UserTag user={item.token.user} /> </Text>
              </Box>
            </Box>
          </Box>
        })}
      </Box>
    </Box>
  </Box>
}
