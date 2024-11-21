import {Box, Spinner, Text} from 'grommet'
import {Token} from "../../types.ts";
import {Button, message} from "antd";
import {useState} from "react";
import {useWriteContract} from "wagmi";
import TokenFactoryABI from "../../abi/TokenFactory.json";
import {appConfig} from "../../config.ts";
import {waitForTransactionReceipt} from "wagmi/actions";
import {config} from "../../wagmi.ts";

export const BurnTokenForm = (props: {
  token?: Token
}) => {
  const { token } = props
  const [inProgress, setInProgress] = useState(false)
  const [currentStatus, setCurrentStatus] = useState('')

  const { writeContractAsync } = useWriteContract()

  const onBurnClicked = async () => {
    try {
      setInProgress(true)

      if(!token) {
        console.error('Token not found, burn failed')
        return
      }

      setCurrentStatus('Signing the transaction...')
      const txnHash = await writeContractAsync({
        abi: TokenFactoryABI,
        address: appConfig.tokenFactoryAddress as `0x${string}`,
        functionName: 'burnTokenAndMintWinner',
        args: [token?.address],
      })

      console.log('Burn tx hash:', txnHash)

      setCurrentStatus('Waiting for confirmation...')
      const receipt = await waitForTransactionReceipt(config, {
        hash: txnHash,
        confirmations: 2,
      })
      console.log('Burn tx receipt:', receipt)
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
        Mint Winner
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
