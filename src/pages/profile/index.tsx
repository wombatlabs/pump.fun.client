import {Box, Text} from "grommet";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {message, Radio, Skeleton} from "antd";
import {CoinsCreated} from "./CoinsCreated.tsx";
import {UserAccount} from "../../types.ts";
import {getUserByAddress} from "../../api";

export type ProfileTab = 'coinsCreated' | 'coinsHeld'

export const ProfilePage = () => {
  const { userAddress = '' } = useParams()

  const [activeTab, setActiveTab] = useState<ProfileTab>('coinsCreated')
  const [user, setUser] = useState<UserAccount>()
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await getUserByAddress({ address: userAddress })
        setUser(data)
      } catch (e) {
        console.error('Failed to load user data' + userAddress, e)
        message.error('Failed to load user profile')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [userAddress]);

  return <Box width={'600px'}>
    <Box>
      {isLoading &&
          <Skeleton.Input active={true} />
      }
      {user &&
        <Box>
            <Text size={'20px'}>@{user.username}</Text>
        </Box>
      }
      <Box margin={{ top: '8px' }}>
        <Text>{userAddress}</Text>
      </Box>
    </Box>
    <Box margin={{ top: '32px' }}>
      <Radio.Group
        onChange={(e) => setActiveTab(e.target.value)}
        value={activeTab}
        style={{ marginBottom: 8 }}
      >
        <Radio.Button value={'coinsCreated'}>Coins created</Radio.Button>
        <Radio.Button value={'coinsHeld'}>Coins held</Radio.Button>
      </Radio.Group>
    </Box>
    <Box margin={{ top: '16px' }}>
      {activeTab === 'coinsCreated' &&
        <CoinsCreated userAddress={userAddress} />
      }
    </Box>
  </Box>
}
