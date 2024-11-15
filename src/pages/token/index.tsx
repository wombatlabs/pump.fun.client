import {Box, Text} from 'grommet'
import {Button, Image, Skeleton} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Token} from "../../types.ts";
import {getTokens} from "../../api";
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

  const [isLoading, setLoading] = useState(false)
  const [token, setToken] = useState<Token>()
  const [activeTab, setActiveTab] = useState<'thread' | 'trades'>('thread')

  const loadData = async (updateStatus = false) => {
    try {
      if(updateStatus) {
        setLoading(true)
      }
      const [tokenData] = await getTokens({ search: tokenAddress })
      if(tokenData) {
        setToken(tokenData)
      }
    } catch (e) {
      console.error('Failed to load token', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData(true)
  }, []);

  usePoller(() => {
    if(isTabActive) {
      loadData()
    }
  }, 2000)

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
        <Box style={{ minWidth: '420px' }} margin={{ top: '16px' }}>
          <TradingForm token={token} />
          {token &&
              <Box direction={'row'} gap={'16px'} style={{ maxWidth: '600px' }} margin={{ top: '32px' }}>
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
          {
            token &&
              <Box margin={{ top: '32px' }}>
                  <TokenHolders token={token} />
              </Box>
          }
        </Box>
      </Box>
    </Box>
  </Box>
}
