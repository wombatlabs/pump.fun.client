import {Box, Text} from 'grommet'
import {Button, Image, Skeleton, Tag, Tooltip} from "antd";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {Competition, TokenEnriched, WinnerLiquidityProvision} from "../../types.ts";
import {getCompetitions, getTokenBalances, getTokens, getWinnerLiquidityProvisions} from "../../api";
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
import {PublishToUniswap} from "./PublishToUniswap.tsx";

const TokenHeader = (props: { data: TokenEnriched }) => {
  const { data: token } = props

  const marketCap = new Decimal(token.marketCap)

  return <Box direction={'row'} gap={'16px'} align={'baseline'}>
    <Tooltip
      title={<Box>
        <Text>Started: {moment(+token.competition.timestampStart * 1000).format('DD MMM YY HH:mm:ss')}</Text>
        {token.competition.timestampEnd &&
            <Text>Finished: {moment(+token.competition.timestampEnd * 1000).format('DD MMM YY HH:mm:ss')}</Text>
        }
        {!token.competition.timestampEnd &&
            <Text>Finish (est.): {
              moment(+token.competition.timestampStart * 1000 + 7 * 24 * 60 * 60 * 1000).format('DD MMM YY HH:mm:ss')
            }</Text>
        }
      </Box>}
    >
      <Text size={'16px'} style={{ borderBottom: '1px dashed gray', cursor: 'pointer' }}>
        Competition #{token.competition.competitionId}
      </Text>
    </Tooltip>
    <Text size={'16px'}>Name: <b>{token.name}</b></Text>
    <Text size={'16px'}>Ticker: <b>{token.symbol}</b></Text>
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

  const { state: { userAccount } } = useClientData()

  const [isLoading, setLoading] = useState(false)
  const [token, setToken] = useState<TokenEnriched>()
  const [userIsHolder, setUserIsHolder] = useState<boolean>(false)
  const [winnerLiquidityProvision, setWinnerLiquidityProvision] = useState<WinnerLiquidityProvision>()
  const [competition, setCompetition] = useState<Competition>()
  const [activeTab, setActiveTab] = useState<'thread' | 'trades'>('thread')

  const loadData = async (updateStatus = false) => {
    try {
      if(updateStatus) {
        setLoading(true)
      }

      const [tokens, holders, liquidityProvisionItems] = await Promise.all([
        getTokens({ search: tokenAddress, limit: 1 }),
        getTokenBalances({ tokenAddress, userAddress: userAccount?.address || 'address', limit: 1 }),
        getWinnerLiquidityProvisions({ tokenAddress }),
      ])

      if(tokens.length > 0) {
        setToken(tokens[0])
        const competitionItems = await getCompetitions({
          competitionId: tokens[0].competition.competitionId
        })
        if(competitionItems.length > 0) {
          setCompetition(competitionItems[0])
        }
      }
      if(holders.length > 0) {
        setUserIsHolder(new Decimal(holders[0].balance).gt(0))
      }
      setWinnerLiquidityProvision(liquidityProvisionItems[0])
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
  }, 3000)

  const isTradeAvailable = useMemo(() => {
    if(token) {
      return !token.competition.isCompleted
    }
    return false
  }, [token])

  const isBurnAvailable = useMemo(() => {
    if(!isTradeAvailable && token && !token.isWinner) {
      const totalSupply = new Decimal(token.totalSupply)
      return totalSupply.gt(0) && userIsHolder
    }
    return false
  }, [isTradeAvailable, token, userIsHolder, winnerLiquidityProvision])

  const isPublishToUniswapAvailable = useMemo(() => {
    if(
      !isBurnAvailable
      && token
      && token.isWinner
      && token.user
      && userAccount
      && !winnerLiquidityProvision
    ) {
      if(token.user.address === userAccount?.address) {
        return true
      }
      return true
    }
    return false
  }, [token, userAccount, isBurnAvailable, winnerLiquidityProvision])

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
          : <Box><Text size={'18px'} weight={500}>Token not found</Text></Box>
      }
      <Box direction={'row'} justify={'between'} gap={'48px'}>
        <Box width={'100%'} margin={{ top: '16px' }}>
          <Box style={{ position: 'relative' }}>
            <PriceChart tokenAddress={tokenAddress} />
          </Box>
          {token &&
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
          }
        </Box>
        <Box style={{ minWidth: '420px' }} margin={{ top: '16px' }} gap={'24px'}>
          {token && competition && competition.isCompleted && competition.winnerToken?.id !== token?.id &&
              <Box gap={'4px'}>
                  <Text color={'golden'} size={'16px'}>Competition is over</Text>
                  <Text size={'16px'}>Winner: <Link to={`/${competition.winnerToken?.address}`}>{competition.winnerToken?.name}</Link></Text>
              </Box>
          }
          {token && competition && competition.isCompleted && competition.winnerToken?.id === token?.id &&
              <Box>
                  <Box>
                      <Text size={'22px'} color={'golden'}>Winner 👑</Text>
                      <Text>{moment(token.timestamp * 1000).format('MMM DD, YYYY')}</Text>
                  </Box>
                  {winnerLiquidityProvision &&
                    <Box margin={{ top: '8px' }} gap={'8px'}>
                        <Box>
                            <Link
                                to={`https://swap.country/#/swap?inputCurrency=0xcf664087a5bb0237a0bad6742852ec6c8d69a27a&outputCurrency=${token.address}`}
                                target={'_blank'}
                            >
                                <Text weight={500}>Trade on swap.country</Text>
                            </Link>
                        </Box>
                        <Box>
                            <Text>Liquidity Pool:</Text>
                            <Link
                                to={`https://info.swap.harmony.one/#/harmony/pools/${winnerLiquidityProvision.pool}`}
                                target={'_blank'}
                            >
                              {winnerLiquidityProvision.pool}
                            </Link>
                        </Box>
                        {/*<Box>*/}
                        {/*    <Text>Liquidity Amount</Text>*/}
                        {/*    <Text>{formatUnits(BigInt(winnerLiquidityProvision.liquidity), 18)}</Text>*/}
                        {/*</Box>*/}
                    </Box>
                  }
              </Box>
          }
          {isTradeAvailable &&
              <TradingForm token={token} />
          }
          {isBurnAvailable &&
              <BurnTokenForm token={token} />
          }
          {isPublishToUniswapAvailable &&
              <PublishToUniswap token={token} />
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
          {token && token.uriData &&
            <Box direction={'row'}>
              {token.uriData.twitterLink &&
                  <Box onClick={() => window.open(token.uriData!.twitterLink, '_blank')}>
                      <Tag>Twitter</Tag>
                  </Box>
              }
              {token.uriData.telegramLink &&
                  <Box onClick={() => window.open(token.uriData!.telegramLink, '_blank')}>
                      <Tag>Telegram</Tag>
                  </Box>
              }
              {token.uriData.websiteLink &&
                  <Box onClick={() => window.open(token.uriData!.websiteLink, '_blank')}>
                      <Tag>Website</Tag>
                  </Box>
              }
            </Box>
          }
          {token &&
              <TokenHolders token={token} />
          }
        </Box>
      </Box>
    </Box>
  </Box>
}
