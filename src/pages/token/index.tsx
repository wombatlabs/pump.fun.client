import {Box, Spinner, Text} from 'grommet'
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

export const TokenPage = () => {
  const navigate = useNavigate()

  const { tokenAddress = '' } = useParams()

  const [isLoading, setLoading] = useState(false)
  const [token, setToken] = useState<Token>()
  const [activeTab, setActiveTab] = useState<'thread' | 'trades'>('thread')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
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
    loadData()
  }, []);

  return <Box width={'100%'} pad={'32px'}>
    <Box align={'center'}>
      <Button
        type={'text'}
        style={{ fontSize: '22px' }}
        onClick={() => navigate('/board')}
      >
        Go back
      </Button>
    </Box>
    <Box>
      {isLoading &&
          <Box margin={{ top: '16px' }} align={'center'} justify={'center'} direction={'row'} gap={'16px'}>
              <Text>Loading...</Text><Spinner />
          </Box>
      }
    </Box>
    <Box margin={{ top: '16px' }} width={'100%'}>
      {token
        ? <Box direction={'row'} gap={'16px'} align={'baseline'}>
            <Text size={'18px'}>{token.name}</Text>
            <Text size={'18px'}>Ticker: {token.symbol}</Text>
            <Text size={'18px'} color={'positiveValue'}>
              Created by: <UserTag fontSize={'18px'} user={token.user} />
              {moment(+token.timestamp * 1000).fromNow()}
            </Text>
          </Box>
        : <Skeleton.Input active={true} />
      }
      <Box direction={'row'} justify={'between'} gap={'48px'}>
        <Box width={'100%'}>
          <Box style={{ position: 'relative' }}>
            <PriceChart />
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
        <Box style={{ minWidth: '600px' }}>
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
