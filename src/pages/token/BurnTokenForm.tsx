import {Box, Spinner, Text} from 'grommet'
import {Token, TokenBurn} from "../../types.ts";
import {Button, message} from "antd";
import {useState} from "react";
import {useWriteContract} from "wagmi";
import TokenFactoryABI from "../../abi/TokenFactory.json";
import {appConfig} from "../../config.ts";
import {waitForTransactionReceipt} from "wagmi/actions";
import {config} from "../../wagmi.ts";
import {getTokenBurns} from "../../api";
import {useClientData} from "../../providers/DataProvider.tsx";
import {formatUnits} from "viem";

export const BurnTokenForm = (props: {
  token?: Token
}) => {
  const { token } = props

  const [inProgress, setInProgress] = useState(false)
  const [currentStatus, setCurrentStatus] = useState('')
  const { state: { userAccount } } = useClientData()

  const { writeContractAsync } = useWriteContract()

  const userAddress = userAccount?.address

  const onBurnClicked = async () => {
    try {
      setInProgress(true)

      if(!token) {
        console.error('Token not found, burn failed')
        return
      }
      if(!userAddress) {
        console.error('User account not found, burn failed')
        return
      }
      const tokenAddress = token.address

      setCurrentStatus('Signing the transaction...')
      const txnHash = await writeContractAsync({
        abi: TokenFactoryABI,
        address: appConfig.tokenFactoryAddress as `0x${string}`,
        functionName: 'burnTokenAndMintWinner',
        args: [tokenAddress],
      })

      console.log('Burn tx hash:', txnHash)

      setCurrentStatus('Waiting for confirmation...')
      const receipt = await waitForTransactionReceipt(config, {
        hash: txnHash,
        confirmations: 2,
      })
      console.log('Burn tx receipt:', receipt)

      let tokenBurn: TokenBurn

      for(let i = 0; i < 20; i++) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const items = await getTokenBurns({ tokenAddress, userAddress, limit: 1 })
        if(items.length === 1) {
          tokenBurn = items[0]
          break;
        }
      }
      // @ts-ignore
      if(tokenBurn) {
        const winnerAmount = formatUnits(BigInt(tokenBurn.mintedAmount), 18)
        message.success(`Token ${tokenBurn.token.name} successfully burned, minted ${winnerAmount} ${tokenBurn.winnerToken.name} (daily winner)`, 20000);
      } else {
        message.error(`Failed to confirm token status`);
      }
    } catch (e) {
      console.error('Failed to burn token:', e)
      message.error('Failed to burn token')
    } finally {
      setCurrentStatus('')
      setInProgress(false)
    }
  }

  return <Box>
    <Box gap={'4px'}>
      <Text weight={500}>Daily competition is over</Text>
      <Text>You can burn "{token?.name}" (ticker: ${token?.symbol}) and get some amount of the winner's token.</Text>
    </Box>
    <Box margin={{ top: '16px' }}>
      <Button
        type={'primary'}
        size={'large'}
        disabled={!token}
        onClick={onBurnClicked}
      >
        Burn Token and Mint Winner
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
