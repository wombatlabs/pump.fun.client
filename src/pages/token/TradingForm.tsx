import {Box, Spinner, Text} from "grommet";
import {Button, InputNumber, message} from "antd";
import styled from "styled-components";
import {useState} from "react";
import {useAccount, useBalance, useWriteContract} from "wagmi";
import TokenFactoryABI from '../../abi/TokenFactory.json'
import {appConfig} from "../../config.ts";
import { parseUnits, formatUnits } from 'viem'
import {Token, TokenTrade} from "../../types.ts";
import {waitForTransactionReceipt} from "wagmi/actions";
import {config} from "../../wagmi.ts";
import {getTrades} from "../../api";
import {harmonyOne} from "wagmi/chains";

const TradeButton = styled(Box)`
    padding: 8px 16px;
    background-color: #292933;
    border-radius: 6px;
    flex: 1;
    text-align: center;
    font-size: 16px;
    color: white;
`

export const TradingForm = (props: {
  token?: Token
}) => {
  const { token } = props

  const account = useAccount()
  const [selectedSide, setSelectedSide] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState<number | null>(null)
  const [currentStatus, setCurrentStatus] = useState('')
  const [inProgress, setInProgress] = useState(false)

  const { data: tokenBalance, refetch: refetchOneBalance } = useBalance({
    token: token?.address as `0x${string}`,
    address: account?.address,
    chainId: harmonyOne.id,
  })
  const { data: oneBalance, refetch: refetchTokenBalance } = useBalance({
    address: account?.address,
    chainId: harmonyOne.id,
  })

  const { writeContractAsync } = useWriteContract()

  const onTradeClicked = async () => {
    try {
      setInProgress(true)
      if(!account.address) {
        message.error(`Wallet not connected. Please connect your wallet to place a trade.`)
        return
      }
      if(!token) {
        message.error(`Token address is missing`)
        return
      }
      if(!amount) {
        message.error(`Enter amount to trade`)
        return
      }
      const amountFormatted = (amount || 0).toString()
      const value = parseUnits(amountFormatted, 18)

      setCurrentStatus('Signing the transaction...')
      const args: any[] = [token?.address]
      if(selectedSide === 'sell') {
        args.push(value)
      }
      const txnHash = await writeContractAsync({
        abi: TokenFactoryABI,
        address: appConfig.tokenFactoryAddress as `0x${string}`,
        functionName: selectedSide === 'buy' ? 'buy' : 'sell',
        args,
        value: selectedSide === 'buy' ? value : undefined
      })
      console.log('txnHash:', txnHash)
      setCurrentStatus('Finalizing the transaction...')
      const receipt = await waitForTransactionReceipt(config, {
        hash: txnHash,
        confirmations: 4
      })
      console.log('Txn receipt:', receipt)
      let tokenTrade: TokenTrade | undefined
      for(let i = 0; i < 20; i++) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const trades = await getTrades({ tokenAddress: token.address, limit: 10 })
        tokenTrade = trades.find(item => item.txnHash.toLowerCase() === txnHash.toLowerCase())
        if(tokenTrade) {
          break;
        }
      }
      if(tokenTrade) {
        message.success(`Trade success! ${token.symbol} / ${selectedSide}`);
      }
    } catch (e) {
      console.log('Failed to trade:', e)
      message.error(`Failed to trade: ${(e as Error).message}`)
    } finally {
      setAmount(null)
      setInProgress(false)
      setCurrentStatus('')
      refetchOneBalance()
      refetchTokenBalance()
    }
  }

  return <Box background={'widgetBg'} pad={'16px'} round={'8px'} width={'330px'}>
    <Box direction={'row'} gap={'4px'}>
      <TradeButton
        onClick={() => setSelectedSide('buy')}
        style={{ background: selectedSide === 'buy' ? '#70D693' : 'unset' }}
      >
        Buy
      </TradeButton>
      <TradeButton
        onClick={() => setSelectedSide('sell')}
        style={{ background: selectedSide === 'sell' ? '#F06666' : 'unset' }}
      >
        Sell
      </TradeButton>
    </Box>
    <Box margin={{ top: '24px' }}>
      <InputNumber
        disabled={inProgress}
        placeholder={'0.0'}
        value={amount}
        size={'large'}
        onChange={(value) => setAmount(value)}
        style={{ width: '100%' }}
      />
      <Box margin={{ top: '4px' }} align={'end'}>
        {selectedSide === 'buy' &&
            <Text>Balance: {
              oneBalance
                ? formatUnits(oneBalance.value, oneBalance.decimals)
                : '0'
            } ONE</Text>
        }
        {selectedSide === 'sell' &&
            <Text>Balance: {
              tokenBalance
                ? formatUnits(tokenBalance.value, tokenBalance.decimals)
                : '0'
            } {token?.symbol}</Text>
        }
      </Box>
    </Box>
    <Box margin={{ top: '24px' }}>
      <Button
        type="primary"
        size={'large'}
        disabled={inProgress}
        onClick={onTradeClicked}
      >
        Place trade
      </Button>
      {inProgress &&
          <Box margin={{ top: '16px' }} align={'center'} direction={'row'} gap={'16px'} justify={'center'}>
            {inProgress && <Spinner color={'activeStatus'} />}
            {currentStatus &&
                <Text color={'activeStatus'}>{currentStatus}</Text>
            }
          </Box>
      }
    </Box>
  </Box>
}
