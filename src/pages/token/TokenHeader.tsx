import {TokenEnriched} from "../../types.ts";
import Decimal from "decimal.js";
import {Box, Text} from "grommet";
import {Skeleton, Tag, Tooltip} from "antd";
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

  const { competition } = token

  const marketCap = new Decimal(token.marketCap)

  return <Box direction={'row'} align={'baseline'} wrap={true} gap={{ row: '8px', column: '10px' }}>
    {competition &&
        <Tooltip
            title={<Box>
              <Text>Start: {moment(+competition.timestampStart * 1000).format('DD MMM YY HH:mm:ss')}</Text>
              {competition.timestampEnd &&
                  <Text>Finish: {moment(+competition.timestampEnd * 1000).format('DD MMM YY HH:mm:ss')}</Text>
              }
              {!competition.timestampEnd &&
                  <Text>Finish: after {
                    moment(getCompetitionEndTimestamp(competition.timestampStart))
                      .format('DD MMM YY HH:mm:ss')
                  }</Text>
              }
            </Box>}
        >
            <Box direction={'row'} gap={'6px'} align={'center'}>
                <Text size={'16px'} style={{ borderBottom: '1px dashed gray', cursor: 'pointer' }}>
                    Competition #{competition.competitionId}
                </Text>
              {!competition.isCompleted && <Tag color="success">Active</Tag>}
              {competition.isCompleted && <Tag color="blue">Completed</Tag>}
            </Box>
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
