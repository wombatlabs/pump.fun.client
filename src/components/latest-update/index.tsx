import {Box, Text} from "grommet";
import {useClientData} from "../../providers/DataProvider.tsx";
import {Token, TokenTrade} from "../../types.ts";
import moment from "moment";
import {formatUnits} from "viem";

const UpdateItem = (props: {
  type: 'token' | 'trade'
  trade?: TokenTrade
  token?: Token
}) => {
  const {type, token, trade} = props

  let background = '#4852FF'
  if(type === 'trade' && trade) {
    background = trade.type === 'buy' ? 'positiveValue' : 'negativeValue'
  }

  return <Box background={background} pad={'6px 12px'} round={'6px'}>
    {(type === 'trade' && trade) &&
      <Text color={'black'}>
        {trade.user.username} {trade.type === 'buy' ? 'bought' : 'sold'} {formatUnits(BigInt(trade.amountIn), 18)} {trade.token.name}
      </Text>
    }
    {(type === 'token' && token) &&
        <Text color={'black'}>
          {token.user?.username} created {token.name} {moment(+token.timestamp * 1000).format('DD/MM/YY')}
        </Text>
    }
  </Box>
}

export const LatestUpdate = () => {
  const { state: { latestToken, latestTrade } } = useClientData()

  return <Box direction={'row'} gap={'16px'}>
    <UpdateItem type={'trade'} trade={latestTrade} />
    <UpdateItem type={'token'} token={latestToken} />
  </Box>
}
