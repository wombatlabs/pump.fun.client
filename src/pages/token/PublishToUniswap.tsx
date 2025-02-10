import {Box, Spinner, Text} from 'grommet'
import {Token, WinnerLiquidityProvision} from "../../types.ts";
import {Button, message} from "antd";
import {useState} from "react";
import {useWriteContract} from "wagmi";
import TokenFactoryABI from "../../abi/TokenFactory.json";
import {waitForTransactionReceipt} from "wagmi/actions";
import {config} from "../../wagmi.ts";
import {getWinnerLiquidityProvisions} from "../../api";
import {useClientData} from "../../providers/DataProvider.tsx";

export const PublishToUniswap = (props: {
  token?: Token
}) => {
  const { token } = props
  const [inProgress, setInProgress] = useState(false)
  const [currentStatus, setCurrentStatus] = useState('')
  const { state: { userAccount } } = useClientData()
  const { writeContractAsync } = useWriteContract()
  const userAddress = userAccount?.address

  const onPublishClicked = async () => {
    try {
      setInProgress(true)

      if(!token) {
        console.error('Token not found, publish failed')
        return
      }
      if(!userAddress) {
        console.error('User account not found, publish failed')
        return
      }
      const tokenAddress = token.address

      setCurrentStatus('Signing the transaction...')
      const txnHash = await writeContractAsync({
        abi: TokenFactoryABI,
        address: token.tokenFactoryAddress as `0x${string}`,
        functionName: 'publishToUniswap',
        args: [tokenAddress],
      })

      console.log('Publish tx hash:', txnHash)

      setCurrentStatus('Waiting for confirmation...')
      const receipt = await waitForTransactionReceipt(config, {
        hash: txnHash,
        confirmations: 2,
      })
      console.log('Publish tx receipt:', receipt)

      let winnerLiquidityProvision: WinnerLiquidityProvision
      for(let i = 0; i < 20; i++) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const items = await getWinnerLiquidityProvisions({ tokenAddress })
        if(items.length === 1) {
          winnerLiquidityProvision = items[0]
          break;
        }
      }

      // @ts-ignore
      if(winnerLiquidityProvision) {
        message.success(`Winner token ${winnerLiquidityProvision.token.name} (${winnerLiquidityProvision.token.symbol}) published, created liquidity pool on swap.country`, 5);
      }
    } catch (e) {
      console.error('Failed to publish token:', e)
      message.error('Failed to publish token to swap.country')
    } finally {
      setCurrentStatus('')
      setInProgress(false)
    }
  }

  return <Box>
    <Box gap={'4px'}>
      <Text weight={500}>Daily competition is over</Text>
      {!token?.isWinner &&
          <Text>You can burn "{token?.name}" (ticker: ${token?.symbol}) and get some amount of the winner's token.</Text>
      }
    </Box>
    <Box margin={{ top: '16px' }}>
      <Button
        type={'primary'}
        size={'large'}
        disabled={!token}
        onClick={onPublishClicked}
      >
        Publish to swap.country
      </Button>
    </Box>
    {inProgress &&
        <Box margin={{ top: '16px' }} align={'center'} direction={'row'} gap={'16px'} justify={'center'}>
          {inProgress && <Spinner color={'activeStatus'} />}
          {currentStatus &&
              <Text color={'activeStatus'}>{currentStatus}</Text>
          }
        </Box>
    }
  </Box>
}
