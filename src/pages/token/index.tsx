import {Box, Text} from 'grommet'
import {Button, Image, Skeleton} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Token} from "../../types.ts";
import {getTokenBalances, getTokens} from "../../api";
import moment from "moment";
import {TradingForm} from "./TradingForm.tsx";
import {TokenComments} from "./TokenComments.tsx";
import { Radio } from 'antd';
import {TokenTrades} from "./TokenTrades.tsx";
import {UserTag} from "../../components/UserTag.tsx";
import {TokenHolders} from "./TokenHolders.tsx";
import {PriceChart} from "./price-chart";
import usePoller from "../../hooks/usePoller.ts";
import useActiveTab from "../../hooks/useActiveTab.ts";
import Decimal from "decimal.js";
import {useClientData} from "../../providers/DataProvider.tsx";
import {BurnTokenForm} from "./BurnTokenForm.tsx";

const TokenHeader = (props: { data: Token }) => {
  const { data: token } = props

  const marketCap = new Decimal(token.marketCap)

  return <Box direction={'row'} gap={'16px'} align={'baseline'}>
    <Text size={'16px'}>{token.name}</Text>
    <Text size={'16px'}>Ticker: {token.symbol}</Text>
    <Text size={'16px'} color={'positiveValue'}>Market cap: {marketCap.gt(0) ? marketCap.toFixed(4) : '0'} ONE</Text>
    <Text size={'16px'}>
      Created by: <UserTag fontSize={'18px'} user={token.user} />
      {moment(+token.timestamp * 1000).fromNow()}
    </Text>
  </Box>
}

export const TokenPage = () => {
  const navigate = useNavigate()
  const isTabActive = useActiveTab()
  const { tokenAddress = '' } = useParams()

  const { state: { latestWinner, userAccount } } = useClientData()

  const [isLoading, setLoading] = useState(false)
  const [token, setToken] = useState<Token>()
  const [userIsHolder, setUserIsHolder] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'thread' | 'trades'>('thread')

  const loadData = async (updateStatus = false) => {
    try {
      if(updateStatus) {
        setLoading(true)
      }

      const [tokens, holders] = await Promise.all([
        getTokens({ search: tokenAddress, limit: 1 }),
        getTokenBalances({ tokenAddress, userAddress: userAccount?.address || 'address', limit: 1 })
      ])

      if(tokens.length > 0) {
        setToken(tokens[0])
      }
      if(holders.length > 0) {
        setUserIsHolder(new Decimal(holders[0].balance).gt(0))
      }
    } catch (e) {
      console.error('Failed to load token', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData(true)
  }, [userAccount?.address]);

  usePoller(() => {
    if(isTabActive) {
      loadData()
    }
  }, 2000)

  const isTradeAvailable = token && latestWinner
    ? token.competitionId > +latestWinner.competitionId
    : false

  const isBurnAvailable = !isTradeAvailable && !token?.isWinner && userIsHolder

  return <Box width={'100%'} pad={'0 32px'} style={{ maxWidth: '1300px', minWidth: '1000px' }}>
    <Box align={'center'}>
      <Button
        type={'text'}
        style={{ fontSize: '22px' }}
        onClick={() => navigate('/board')}
      >
        Go back
      </Button>
    </Box>
    <Box margin={{ top: '16px' }} width={'100%'}>
      {isLoading
        ? <Skeleton.Input active={true} style={{ width: '300px' }} />
        : token
          ? <TokenHeader data={token} />
          : <Box><Text>Token not found</Text></Box>
      }
      <Box direction={'row'} justify={'between'} gap={'48px'}>
        <Box width={'100%'} margin={{ top: '16px' }}>
          <Box style={{ position: 'relative' }}>
            <PriceChart tokenAddress={tokenAddress} />
          </Box>
          <Box margin={{ top: '32px' }}>
            <Radio.Group onChange={(e) => setActiveTab(e.target.value)} value={activeTab} style={{ marginBottom: 8 }}>
              <Radio.Button value="thread">Thread</Radio.Button>
              <Radio.Button value="trades">Trades</Radio.Button>
            </Radio.Group>
            <Box margin={{ top: '16px' }}>
              {activeTab === 'thread' &&
                  <TokenComments tokenAddress={tokenAddress} />
              }
              {activeTab === 'trades' &&
                  <TokenTrades tokenAddress={tokenAddress} />
              }
            </Box>
          </Box>
        </Box>
        <Box style={{ minWidth: '420px' }} margin={{ top: '16px' }} gap={'32px'}>
          {token && token.isWinner &&
              <Box>
                  <Text size={'22px'} color={'golden'}>Winner 👑</Text>
                  <Text>{moment(token.timestamp * 1000).format('MMM DD, YYYY')}</Text>
              </Box>
          }
          {isTradeAvailable &&
              <TradingForm token={token} />
          }
          {isBurnAvailable &&
              <BurnTokenForm token={token} />
          }
          {token &&
              <Box direction={'row'} gap={'16px'} style={{ maxWidth: '600px' }}>
                  <Box>
                      <Image
                          width={200}
                          src={token.uriData?.image}
                      />
                  </Box>
                  <Box style={{ maxWidth: 'calc(100% - 200px - 16px)' }}>
                      <Text><b>{token.name} (ticker: {token.symbol})</b>: {token.uriData?.description}</Text>
                  </Box>
              </Box>
          }
          {token &&
              <Box>
                  <TokenHolders token={token} />
              </Box>
          }
        </Box>
      </Box>
    </Box>
  </Box>
}
