import {Box, Text} from "grommet";
import {Token, TokenEnriched, TokenTrade} from "../../types.ts";
import moment from "moment";
import {formatUnits} from "viem";
import {Skeleton} from "antd";
import Decimal from "decimal.js";
import {getTokens, getTrades} from "../../api";
import {useEffect, useMemo, useState} from "react";
import usePoller from "../../hooks/usePoller.ts";
import useIsTabActive from "../../hooks/useActiveTab.ts";
import {Link} from "react-router-dom";
import styled, {css, keyframes} from "styled-components";

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-15px); }
  100% { transform: translateX(0); }
`;

const ShakeDiv = styled(Box)<{ isAnimating: boolean }>`
    padding: 6px 12px;
    animation: ${props => props.isAnimating
            ? css`${shake} 200ms ease-in-out;`
            : `unset`
    };
`

const UpdateItem = (props: {
  type: 'token' | 'trade'
  trade?: TokenTrade
  token?: Token
}) => {
  const {type, token, trade} = props

  const [latestActionId, setLatestActionId] = useState<string>('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationDropTimeout, setAnimationDropTimeout] = useState<number>(0)

  useEffect(() => {
    const newId = type === 'trade' && trade
      ? trade.id
      : type === 'token' && token
      ? token.id : ''

    if(newId !== latestActionId) {
      if(latestActionId) {
        setIsAnimating(true)
      }
      setLatestActionId(newId)
      const timeoutId = setTimeout(() => {
        setIsAnimating(false)
      }, 300)
      clearTimeout(animationDropTimeout)
      setAnimationDropTimeout(timeoutId)
    }
  }, [type, token, trade, animationDropTimeout, latestActionId]);

  let background = '#4852FF'
  if(type === 'trade' && trade) {
    background = trade.type === 'buy' ? 'positiveValue' : 'negativeValue'
  }

  const tradeAmount = useMemo(() => {
    if(trade) {
      const value = trade.type === 'buy' ? trade.amountOut : trade.amountIn
      return new Decimal(formatUnits(BigInt(value), 18)).toFixed(4)
    }
    return ''
  }, [trade])

  if((type === 'trade' && !trade) || (type === 'token' && !token)) {
    return <Skeleton.Input active={true} />
  }

  return <ShakeDiv
    isAnimating={isAnimating}
    background={background}
    round={'6px'}
  >
    {(type === 'trade' && trade) &&
      <Text color={'black'}>
        {trade.user.username} {trade.type === 'buy' ? 'bought' : 'sold'} {tradeAmount} of <Link to={`/${trade.token.address}`} style={{ color: 'inherit' }}>{trade.token.name}</Link>
      </Text>
    }
    {(type === 'token' && token) &&
        <Text color={'black'}>
          {token.user?.username} created <Link to={`/${token.address}`} style={{ color: 'inherit' }}>{token.name}</Link> on {moment(+token.timestamp * 1000).format('DD/MM/YY')}
        </Text>
    }
  </ShakeDiv>
}

export const LatestUpdate = () => {
  const isTabActive = useIsTabActive()

  const [latestTrade, setLatestTrade] = useState<TokenTrade>()
  const [latestToken, setLatestToken] = useState<TokenEnriched>()
  const [isUpdating, setUpdating] = useState(false)

  const updateLatestData = async () => {
    try {
      setUpdating(true)
      // const offset = Math.random() < 0.5 ? 0 : 1;
      const [trades, tokens] = await Promise.allSettled([
        getTrades({ limit: 1 }),
        getTokens({ limit: 1 }),
      ])
      if(trades.status === 'fulfilled' && trades.value.length > 0) {
        setLatestTrade(trades.value[0])
      }
      if(tokens.status === 'fulfilled' && tokens.value.length > 0) {
        setLatestToken(tokens.value[0])
      }
    } catch (e) {
      console.error('Failed to update latest data', e)
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    updateLatestData()
  }, []);

  usePoller(() => {
    if(isTabActive && !isUpdating) {
      updateLatestData()
    }
  }, 2 * 1000)

  return <Box direction={'row'} gap={'16px'} style={{ position: 'relative', width: '100%' }}>
    <UpdateItem type={'trade'} trade={latestTrade} />
    <UpdateItem type={'token'} token={latestToken} />
  </Box>
}
