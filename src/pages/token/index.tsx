import {Box, Text} from 'grommet'
import {Button, Tag} from "antd";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {Competition, TokenEnriched, WinnerLiquidityProvision} from "../../types.ts";
import {getCompetitions, getTokenBalances, getTokens, getWinnerLiquidityProvisions} from "../../api";
import {TradingForm} from "./TradingForm.tsx";
import {TokenComments} from "./TokenComments.tsx";
import { Radio } from 'antd';
import {TokenTrades} from "./TokenTrades.tsx";
import {TokenHolders} from "./TokenHolders.tsx";
import {PriceChart} from "./price-chart";
import usePoller from "../../hooks/usePoller.ts";
import useActiveTab from "../../hooks/useActiveTab.ts";
import Decimal from "decimal.js";
import {useClientData} from "../../providers/DataProvider.tsx";
import {BurnTokenForm} from "./BurnTokenForm.tsx";
import {PublishToUniswap} from "./PublishToUniswap.tsx";
import {useMediaQuery} from "react-responsive";
import {breakpoints} from "../../utils/breakpoints.ts";
import {CompetitionWinner} from "./CompetitionWinner.tsx";
import {TokenHeader} from "./TokenHeader.tsx";
import {AdvancedTradingView} from "./trading-view-chart";
import {TokenCard} from "../../components/token";
import {TokenCollateralProgress} from "./TokenCollateralProgress.tsx";
import {readContract} from "wagmi/actions";
import {config} from "../../wagmi.ts";
import TokenFactoryBaseABI from "../../abi/TokenFactoryBase.json";
import TokenFactoryABI from "../../abi/TokenFactory.json";
import {UniswapPoolInfo} from "./UniswapPoolInfo.tsx";
import {appConfig} from "../../config.ts";
import {parseUnits} from "viem";

const ButtonBack = () => {
  const navigate = useNavigate()

  return <Box align={'center'}>
    <Button
      type={'text'}
      style={{ fontSize: '22px' }}
      onClick={() => navigate('/board')}
    >
      Go back
    </Button>
  </Box>
}

export const TokenPage = () => {
  const isTabActive = useActiveTab()
  const { tokenAddress = '' } = useParams()

  const { state: { userAccount } } = useClientData()

  const [isInitialDataLoaded, setInitialLoaded] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false)
  const [token, setToken] = useState<TokenEnriched>()
  const [competition, setCompetition] = useState<Competition>()
  const [userIsHolder, setUserIsHolder] = useState<boolean>(false)
  const [winnerLiquidityProvision, setWinnerLiquidityProvision] = useState<WinnerLiquidityProvision>()
  const [requiredCollateral, setRequiredCollateral] = useState(0n)
  const [tokenCollateral, setTokenCollateral] = useState(0n)
  const [activeTab, setActiveTab] = useState<'thread' | 'trades'>('thread')
  const isMobile = useMediaQuery({ query: `(max-width: ${breakpoints.mobile})` })

  const tokenCollateralPercent = useMemo(() => {
    if(requiredCollateral > 0n && tokenCollateral > 0n) {
      return new Decimal(tokenCollateral.toString())
        .div(new Decimal(requiredCollateral.toString()))
        .mul(100)
        .toFixed(1)
    }
    return '0'
  }, [requiredCollateral, tokenCollateral])

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
        const {address, tokenFactoryAddress, competition} = tokens[0]

        if(competition) {
          try {
            const competitionItems = await getCompetitions({
              competitionId: competition.competitionId
            })
            if(competitionItems.length > 0) {
              setCompetition(competitionItems[0])
            }
          } catch (e) {
            console.error('Failed to get competition', e)
          }
        }

        try {
          if(competition) {
            const tokenData = await readContract(config, {
              address: tokenFactoryAddress as `0x${string}`,
              abi: TokenFactoryABI,
              functionName: 'collateralById',
              args: [competition.competitionId, address]
            }) as bigint
            setRequiredCollateral(parseUnits(appConfig.competitionCollateralThreshold.toString(), 18))
            setTokenCollateral(tokenData)
          } else {
            const [requiredData, tokenData] = await Promise.all([
              readContract(config, {
                address: tokenFactoryAddress as `0x${string}`,
                abi: TokenFactoryBaseABI,
                functionName: 'requiredCollateral',
                args: []
              }),
              readContract(config, {
                address: tokenFactoryAddress as `0x${string}`,
                abi: TokenFactoryBaseABI,
                functionName: 'collateralById',
                args: [address]
              })
            ]) as [bigint, bigint]
            setRequiredCollateral(requiredData)
            setTokenCollateral(tokenData)
          }
        } catch (e) {
          console.error('Failed to load collateral progress', e)
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
      setInitialLoaded(true)
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
    if(token && token.competition) {
      return !token.competition.isCompleted
    }
    return !winnerLiquidityProvision
  }, [token, winnerLiquidityProvision])

  const isBurnAvailable = useMemo(() => {
    if(!isTradeAvailable && token && token.competition && !token.isWinner) {
      const totalSupply = new Decimal(token.totalSupply)
      return totalSupply.gt(0) && userIsHolder
    }
    return false
  }, [isTradeAvailable, token, userIsHolder, winnerLiquidityProvision])

  const isPublishToUniswapAvailable = useMemo(() => {
    if (
      Number(tokenCollateralPercent) >= 100
      && !winnerLiquidityProvision
    ) {
      if(competition) {
        return competition.isCompleted
          && competition.winnerToken
          && (token && competition.winnerToken.id === token.id)
      } else {
        return true
      }
    }
    return false
  }, [token, userAccount, isBurnAvailable, winnerLiquidityProvision, competition, tokenCollateralPercent])

  const isCollateralProgressBarVisible = useMemo(() => {
    return token && !winnerLiquidityProvision
  }, [token, winnerLiquidityProvision])

  if(!isInitialDataLoaded) {
    return null
  }

  if(isMobile) {
    return <Box gap={'16px'} pad={'8px'} align={'center'}>
      <ButtonBack />
      <TokenHeader isLoading={isLoading} data={token} />
      <Box style={{ position: 'relative' }} width={'100%'}>
        <PriceChart tokenAddress={tokenAddress} />
      </Box>
      {token &&
          <TokenCard token={token} />
      }
      <Box alignSelf={'start'}>
        {token &&
            <TokenHolders token={token} limit={5} />
        }
      </Box>
      <Box alignSelf={'start'}>
        {token && competition && competition.isCompleted &&
            <CompetitionWinner
                token={token}
                competition={competition}
            />
        }
      </Box>
    </Box>
  }

  // const onSetRequiredCollateral = async () => {
  //   const txHash = await writeContract(config, {
  //     address: '0xe7D431E5A77c14796706937913F0C9F4f78D40e6',
  //     abi: TokenFactoryABI,
  //     args: ['1000000000000000000'],
  //     functionName: 'setRequiredCollateral'
  //   })
  //   console.log('txHash', txHash)
  // }

  return <Box width={'100%'} pad={'0 32px'} style={{ maxWidth: '1300px', minWidth: '1000px' }}>
    {/*<Button onClick={onSetRequiredCollateral}>Collateral</Button>*/}
    <ButtonBack />
    <Box margin={{ top: '16px' }} width={'100%'}>
      <TokenHeader isLoading={isLoading} data={token} />
      <Box direction={'row'} justify={'between'} gap={'48px'}>
        <Box width={'100%'} margin={{ top: '16px' }}>
          <Box style={{ position: 'relative', height: '500px' }}>
            {/*<PriceChart tokenAddress={tokenAddress} />*/}
            <AdvancedTradingView
              tokenAddress={tokenAddress}
              tokenName={token?.name || '-'}
            />
          </Box>
          {token &&
              <Box margin={{ top: '32px' }}>
                  <Radio.Group onChange={(e) => setActiveTab(e.target.value)} value={activeTab} style={{ marginBottom: 8 }}>
                      <Radio.Button value="thread">Thread</Radio.Button>
                      <Radio.Button value="trades">Trades</Radio.Button>
                  </Radio.Group>
                  <Box margin={{ top: '8px' }}>
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
        <Box style={{ minWidth: '420px' }} margin={{ top: '16px' }} gap={'16px'}>
          {token && competition && competition.isCompleted &&
              <CompetitionWinner
                  token={token}
                  competition={competition}
              />
          }
          {winnerLiquidityProvision &&
            <UniswapPoolInfo winnerLiquidityProvision={winnerLiquidityProvision} />
          }
          {isTradeAvailable &&
              <TradingForm token={token} />
          }
          {isBurnAvailable &&
              <BurnTokenForm token={token} />
          }
          {token &&
              <TokenCard token={token} />
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
          {isCollateralProgressBarVisible && token &&
              <TokenCollateralProgress
                  collateralPercent={tokenCollateralPercent}
                  requiredCollateral={requiredCollateral}
                  token={token}
              />
          }
          {isPublishToUniswapAvailable &&
              <PublishToUniswap token={token} />
          }
          {token &&
              <TokenHolders token={token} />
          }
          <Box>
            <Link
              to={`/report/token/${tokenAddress}`}
            >
              <Text>Report</Text>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
}
