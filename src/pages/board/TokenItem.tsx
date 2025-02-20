import {Box, Text} from "grommet";
import {TokenEnriched} from "../../types.ts";
import styled from "styled-components";
import moment from 'moment'
import {Image, Tag} from 'antd'
import Decimal from "decimal.js";
import {CSSProperties} from "react";
import {MarketCap} from "../../components/marketCap";

const TokenContainer = styled(Box)`
    border: 1px solid transparent;
    padding: 12px;
    &:hover {
        border-color: gray;
    }
    max-width: 33%;
    width: 33%;
    min-width: 400px;
    max-height: 350px;
    overflow: hidden;
`

export const TokenItem = (props: {
  data: TokenEnriched
  style?: CSSProperties | undefined
  onClick?: () => void
}) => {
  const { data: {
    symbol,
    name,
    timestamp,
    user,
    uriData,
    commentsCount,
    competition,
    isWinner
  }} = props

  const marketCap = new Decimal(props.data.marketCap)

  return <TokenContainer
    direction={'row'}
    gap={'16px'}
    round={'5px'}
    style={{
      // border: competition ? '1px solid #0A0708' : undefined,
      background: competition ? '#242427' : undefined,
      ...props.style
    }}
    onClick={props.onClick}
  >
    <Box>
      <Image width={'150px'} src={uriData?.image} preview={false} />
    </Box>
    <Box style={{ maxWidth: 'calc(100% - 150px - 16px)' }}>
      <Text color={'accentWhite'}>
        Created by {user?.username} {moment(+timestamp * 1000).fromNow()}
      </Text>
      {competition &&
          <Box direction={'row'} gap={'8px'} align={'center'}>
              <Text>{isWinner ? '👑 ' : ''}Competition #{competition.competitionId}</Text>
              {!competition.isCompleted && <Tag color="success">Active</Tag>}
              {competition.isCompleted && <Tag color="blue">Completed</Tag>}
          </Box>
      }
      {!competition &&
          <Text>Tradable token</Text>
      }
      <MarketCap value={marketCap.toNumber()} />
      <Text>replies: {commentsCount}</Text>
      <Text><b style={{ fontSize: '16px' }}>{name} (ticker: {symbol})</b>: {uriData?.description}</Text>
    </Box>
  </TokenContainer>
}
