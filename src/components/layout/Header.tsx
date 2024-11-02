import {Box, Text} from "grommet";
import {useAccount, useConnect, useDisconnect, useSwitchChain} from "wagmi";
import {Button, message} from "antd";
import {createUser, getUserByAddress} from "../../api";
import {useClientData} from "../../providers/DataProvider.tsx";
import {harmonyOne} from "wagmi/chains";

export const Header = () => {
  const account = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const { connectors, connectAsync, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { state: clientState, setState: setClientState } = useClientData()

  const onConnectClicked = async () => {
    const metamaskConnector = connectors.find(c => c.name === 'MetaMask')
    if(!metamaskConnector) {
      return
    }

    let userAddress = ''

    try {
      await switchChainAsync({ chainId: harmonyOne.id })
      const data = await connectAsync({ connector: metamaskConnector })
      if(data.accounts.length > 0) {
        userAddress = data.accounts[0]
      }
    } catch (e) {
      console.error('Failed to connect wallet', e)
      message.error(`Failed to connect wallet`);
    }

    console.log('Address connected:', userAddress)

    if(userAddress) {
      try {
        let user = await getUserByAddress({ address: userAddress }).catch(_ => {})
        if(!user) {
          user = await createUser({ address: userAddress })
        }
        console.log('User account:', user)

        setClientState({
          ...clientState,
          userAccount: user
        })
      } catch (e) {
        console.error('Failed to create user', e)
      }
    }
  }

  const onDisconnectClicked = () => {
    disconnect()
  }

  return <Box pad={'16px'} direction={'row'} justify={'between'}>
    <Box>
      <Text size={'20px'}>Pump</Text>
    </Box>
    <Box>
      {account.status === 'disconnected' &&
          <Button type={'primary'} loading={isPending} onClick={onConnectClicked}>
              Connect Wallet
          </Button>
      }
      {account.status === 'connected' &&
        <Box gap={'8px'}>
          <Box>
              {clientState &&
                  <Text>{clientState.userAccount?.username}</Text>
              }
          </Box>
            <Box width={'120px'}>
                <Button type={'primary'} loading={isPending} onClick={onDisconnectClicked}>
                    Disconnect
                </Button>
            </Box>
        </Box>
      }
    </Box>
  </Box>
}
