import {TokenEnriched} from "../../types.ts";
import Decimal from "decimal.js";
import {Box, Text} from "grommet";
import {Skeleton, Tooltip} from "antd";
import moment from "moment/moment";
import {UserTag} from "../../components/UserTag.tsx";
import {MarketCap} from "../../components/marketCap";
import {getCompetitionEndTimestamp} from "../../utils";

export const TokenHeader = (
  props: {
    isLoading: boolean;
    data?: TokenEnriched
  }
) => {
  const { data: token, isLoading } = props

  if(isLoading) {
    return <Skeleton.Input active={true} style={{ width: '300px' }} />
  }

  if(!token) {
    return null
  }

  const marketCap = new Decimal(token.marketCap)

  return <Box direction={'row'} align={'center'} wrap={true} gap={{ row: '8px', column: '10px' }}>
    {token.competition &&
        <Tooltip
            title={<Box>
              <Text>Start: {moment(+token.competition.timestampStart * 1000).format('DD MMM YY HH:mm:ss')}</Text>
              {token.competition.timestampEnd &&
                  <Text>Finish: {moment(+token.competition.timestampEnd * 1000).format('DD MMM YY HH:mm:ss')}</Text>
              }
              {!token.competition.timestampEnd &&
                  <Text>Finish: after {
                    moment(getCompetitionEndTimestamp(token.competition.timestampStart))
                      .format('DD MMM YY HH:mm:ss')
                  }</Text>
              }
            </Box>}
        >
            <Text size={'16px'} style={{ borderBottom: '1px dashed gray', cursor: 'pointer' }}>
                Competition #{token.competition.competitionId}
            </Text>
        </Tooltip>
    }
    <Text size={'16px'}>Name: <b>{token.name}</b></Text>
    <Text size={'16px'}>Ticker: <b>{token.symbol}</b></Text>
    <MarketCap value={marketCap.toNumber()} />
    <Text size={'16px'}>
      Created by: <UserTag fontSize={'18px'} user={token.user} />
      {moment(+token.timestamp * 1000).fromNow()}
    </Text>
  </Box>
}
