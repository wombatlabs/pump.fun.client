import {Box, Text} from "grommet";
import {useAccount, useConnect, useSwitchChain} from "wagmi";
import {Button, message, Modal} from "antd";
import {createUser, getUserByAddress} from "../../api";
import {useClientData} from "../../providers/DataProvider.tsx";
import {harmonyOne} from "wagmi/chains";
import {ProfileModal} from "./ProfileModal.tsx";
import {useState} from "react";

export const Header = () => {
  const account = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const { connectors, connectAsync, isPending } = useConnect()
  const { state: clientState, setState: setClientState, onDisconnect } = useClientData()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

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
    onDisconnect()
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
              <Button onClick={() => setIsProfileModalOpen(true)}>
                  <Text>{clientState.userAccount?.username}</Text>
                  <Text size={'12px'}>▼</Text>
              </Button>
          </Box>
            <Box width={'120px'}>
                <Button type={'primary'} loading={isPending} onClick={onDisconnectClicked}>
                    Disconnect
                </Button>
            </Box>
        </Box>
      }
    </Box>
    <Modal
      title="Profile"
      footer={null}
      open={isProfileModalOpen}
      onOk={() => setIsProfileModalOpen(false)}
      onCancel={() => setIsProfileModalOpen(false)}
      styles={{
        mask: {
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      {clientState.userAccount &&
          <ProfileModal user={clientState.userAccount} onClose={() => setIsProfileModalOpen(false)} />
      }
    </Modal>
  </Box>
}
