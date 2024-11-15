import {Box, Text} from "grommet";
import {useAccount, useConnect} from "wagmi";
import {Button, message, Modal} from "antd";
import {getNonce, getUserByAddress, verifySignature} from "../../api";
import {useClientData} from "../../providers/DataProvider.tsx";
import {harmonyOne} from "wagmi/chains";
import {ProfileModal} from "./ProfileModal.tsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {LatestUpdate} from "../latest-update";
import {GradientButtonText} from "../button";
import {storeJWTTokens} from "../../utils/localStorage.ts";
import {JWTTokensPair} from "../../types.ts";

export const Header = () => {
  const navigate = useNavigate();
  const account = useAccount()
  const { connectors, connectAsync, isPending } = useConnect()
  const { state: clientState, setState: setClientState } = useClientData()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const onConnectClicked = async () => {
    let userAddress = ''
    let jwtTokens: JWTTokensPair

    const metamaskConnector = connectors.find(c => c.name === 'MetaMask')
    if(!metamaskConnector) {
      message.error('MetaMask not installed')
      return
    }

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

    console.log('User address connected:', userAddress)

    if(userAddress) {
      try {
        const nonce = await getNonce(userAddress)
        console.log('Nonce:', nonce)
        const rawMessage = `I'm signing my one-time nonce: ${nonce}`
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [rawMessage, userAddress],
        })
        jwtTokens = await verifySignature(userAddress, signature)
        console.log('jwtTokens:', jwtTokens)
      } catch (e) {
        console.error('Failed to get JWT tokens:', e)
        message.error('Failed to get access tokens')
      }

      // @ts-ignore
      if(jwtTokens) {
        try {
          storeJWTTokens(jwtTokens)
          const user = await getUserByAddress({ address: userAddress }).catch(_ => {})
          if(user) {
            setClientState({
              ...clientState,
              jwtTokens,
              userAccount: user
            })
            console.log('User account:', user)
          }
        } catch (e) {
          console.error('Failed to get user account:', e)
          message.error('Failed to get user account. Try again later.')
        }
      }
    }
  }

  return <Box pad={'16px'} direction={'row'} justify={'between'}>
    <Box direction={'row'} gap={'24px'}>
      <Box onClick={() => {
        navigate('/')
      }}>
        <GradientButtonText size={'24px'}>PumpOne</GradientButtonText>
      </Box>
      <Box>
        <LatestUpdate />
      </Box>
    </Box>
    <Box>
      {account.status === 'disconnected' &&
          <Button type={'primary'} size={'large'} loading={isPending} onClick={onConnectClicked}>
              Connect Wallet
          </Button>
      }
      {account.status === 'connected' &&
        <Box gap={'8px'}>
          <Box>
              <Button
                  size={'large'}
                  onClick={() => setIsProfileModalOpen(true)}
                  style={{ minWidth: '160px' }}
              >
                  <Box width={'100%'} justify={'between'} direction={'row'} align={'center'}>
                      <Text size={'16px'}>{clientState.userAccount?.username.slice(0, 10)}</Text>
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
      centered
      title={null}
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
          <ProfileModal
              user={clientState.userAccount}
              onClose={() => setIsProfileModalOpen(false)}
          />
      }
    </Modal>
  </Box>
}
