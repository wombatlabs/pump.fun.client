import {Box, Text} from "grommet";
import {useEffect, useState} from "react";
import {Competition} from "../../types.ts";
import {Image} from "antd";
import moment from "moment/moment";
import {UserTag} from "../../components/UserTag.tsx";
import Decimal from "decimal.js";
import {getCompetitions} from "../../api";

export const Leaderboard = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const items = await getCompetitions()
        setCompetitions(items)
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
        {competitions.map(item => {
          const { winnerToken } = item
          const marketCap = new Decimal(winnerToken?.marketCap || 0)

          return <Box justify={'between'} key={item.id}>
            {winnerToken &&
                <Box justify={'between'} direction={'row'} gap={'16px'}>
                    <Box>
                        <Image width={'100px'} src={winnerToken.uriData?.image} />
                    </Box>
                    <Box>
                        <Text weight={500}>{moment(+winnerToken.timestamp * 1000).format('MMM DD, YYYY')}</Text>
                        <Text>{winnerToken.name} ({winnerToken.symbol})</Text>
                        <Text>Market Cap: {marketCap.toFixed(4)} ONE</Text>
                        <Text>Created by <UserTag user={winnerToken.user} /> </Text>
                    </Box>
                </Box>
            }
          </Box>
        })}
      </Box>
    </Box>
  </Box>
}
