import {Box, Text} from "grommet";
import {useAccount, useConnect} from "wagmi";
import {Button, message, Modal} from "antd";
import {createUser, getUserByAddress} from "../../api";
import {useClientData} from "../../providers/DataProvider.tsx";
import {harmonyOne} from "wagmi/chains";
import {ProfileModal} from "./ProfileModal.tsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {LatestUpdate} from "../latest-update";
import {GradientButtonText} from "../button";

export const Header = () => {
  const navigate = useNavigate();
  const account = useAccount()
  const { connectors, connectAsync, isPending } = useConnect()
  const { state: clientState, setState: setClientState } = useClientData()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const onConnectClicked = async () => {
    const metamaskConnector = connectors.find(c => c.name === 'MetaMask')
    if(!metamaskConnector) {
      message.error('MetaMask not installed')
      return
    }

    let userAddress = ''

    try {
      const data = await connectAsync({
        connector: metamaskConnector,
        chainId: harmonyOne.id
      })
      if(data.accounts.length > 0) {
        userAddress = data.accounts[0]
      }
    } catch (e) {
      console.error('Failed to connect wallet', e)
      message.error(`Failed to connect a wallet`);
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

  // const onDisconnectClicked = () => {
  //   onDisconnect()
  // }

  return <Box pad={'16px'} direction={'row'} justify={'between'}>
    <Box direction={'row'} gap={'24px'}>
      <Box onClick={() => {
        navigate('/')
      }}>
        {/*<Text size={'22px'}>PumpOne</Text>*/}
        <GradientButtonText size={'24px'}>PumpOne</GradientButtonText>
      </Box>
      <Box>
        <LatestUpdate />
      </Box>
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
              <Button
                  // size={'large'}
                  onClick={() => setIsProfileModalOpen(true)}
                  style={{ minWidth: '160px' }}
              >
                  <Box width={'100%'} justify={'between'} direction={'row'} align={'center'}>
                      <Text>{clientState.userAccount?.username.slice(0, 10)}</Text>
                      <Text size={'12px'}>▼</Text>
                  </Box>
              </Button>
          </Box>
            {/*<Box width={'120px'}>*/}
            {/*    <Button type={'primary'} loading={isPending} onClick={onDisconnectClicked}>*/}
            {/*        Disconnect*/}
            {/*    </Button>*/}
            {/*</Box>*/}
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
