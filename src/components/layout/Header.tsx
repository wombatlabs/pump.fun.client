import {Box, Text} from "grommet";
import {useAccount, useConnect, useDisconnect} from "wagmi";
import {Button, message, Modal} from "antd";
import {UserOutlined} from "@ant-design/icons";
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
  const { connectors, connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { state: clientState, setState: setClientState, onDisconnect } = useClientData()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isSimpleSwapModalOpened, setSimpleSwapModalOpened] = useState(false)

  const onConnectClicked = async () => {
    let userAddress = ''
    let jwtTokens: JWTTokensPair

    if(account.status !== 'disconnected') {
      await disconnectAsync()
    }

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
      message.error(`Failed to connect wallet`);
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
            return
          }
        } catch (e) {
          console.error('Failed to get user account:', e)
          message.error('Failed to get user account. Try again later.')
        }
      }
    }

    console.log('Disconnect user!')
    onDisconnect()
  }

  return <Box
    width={'100%'}
    height={'50px'}
    background={'#1E1E20'}
    pad={'8px 16px'}
    direction={'row'}
    justify={'between'}
    style={{
      position: 'absolute',
      zIndex: 1,
      boxShadow: '0 -6px 10px 5px rgba(0, 0, 0, 0.6);'
  }}
  >
    <Box direction={'row'} gap={'16px'} align={'center'}>
      <Box onClick={() => {
        navigate('/')
      }}>
        <GradientButtonText size={'24px'}>PumpOne</GradientButtonText>
      </Box>
      <Box>
        <LatestUpdate />
      </Box>
    </Box>
    <Box direction={'row'} align={'center'} gap={'16px'}>
      <Box onClick={() => navigate('/leaderboard')}>
        <Text size={'18px'}>Leaderboard</Text>
      </Box>
      <Box align={'center'} onClick={() => setSimpleSwapModalOpened(true)}>
        <GradientButtonText size={'16px'}>Get ONE</GradientButtonText>
      </Box>
      {(!clientState.userAccount) &&
          <Button type={'primary'} loading={false} onClick={onConnectClicked}>
              Connect Wallet
          </Button>
      }
      {clientState.userAccount &&
        <Box>
            <Button
              // size={'large'}
                onClick={() => setIsProfileModalOpen(true)}
                style={{ minWidth: '180px' }}
            >
                <UserOutlined />
                <Box width={'100%'} justify={'between'} direction={'row'} align={'center'} gap={'8px'}>
                    <Text size={'16px'}>{clientState.userAccount?.username}</Text>
                    <Text size={'12px'}>▼</Text>
                </Box>
            </Button>
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
      {clientState.userAccount
        ? <ProfileModal
            user={clientState.userAccount}
            onClose={() => setIsProfileModalOpen(false)}
          />
        : <Button type={'primary'} onClick={onDisconnect}>Disconnect</Button>
      }
    </Modal>
    <Modal
      className={'pump_app_get_one_widget'}
      centered
      width={'536px'}
      title={null}
      footer={null}
      open={isSimpleSwapModalOpened}
      onOk={() => setSimpleSwapModalOpened(false)}
      onCancel={() => setSimpleSwapModalOpened(false)}
      styles={{
        content: {
          padding: '4px 4px 0px',
          borderRadius: '32px'
        },
        mask: {
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      {isSimpleSwapModalOpened &&
          <Box
              width={'100%'}
              height={'100%'}
              align={'center'}
              justify={'center'}
              style={{ position: 'absolute', zIndex: 1 }}
          >
              <Box
                  pad={'6px 16px'}
                  background={'white'}
                  round={'6px'}
              >
                  <Text color={'black'} size={'16px'}>Loading SimpleSwap widget...</Text>
              </Box>
          </Box>
      }
      <Box style={{ zIndex: 2, position: 'relative' }}>
        <iframe id="simpleswap-frame" name="SimpleSwap Widget" width="528px" height="392px"
                src="https://simpleswap.io/widget/26484d8c-7182-44e6-8a5b-9feddeb6354b" frameBorder="0"></iframe>
      </Box>
    </Modal>
  </Box>
}
