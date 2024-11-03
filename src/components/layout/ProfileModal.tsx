import {Box, Text} from "grommet";
import {UserAccount} from "../../types.ts";
import {Button, Typography} from "antd";
import {useClientData} from "../../providers/DataProvider.tsx";

export const ProfileModal = (props: {
  user: UserAccount
  onClose: () => void;
}) => {
  const { user, onClose } = props

  const { onDisconnect } = useClientData()

  return <Box>
    <Box>
      <Text>@{user.username}</Text>
    </Box>
    <Box margin={{ top: '8px' }}>
      <Box pad={'4px 8px'} border={{ color: 'white' }} round={'6px'}>
        <Typography.Text copyable={true}>
          {user.address}
        </Typography.Text>
      </Box>
    </Box>
    <Box margin={{ top: '32px' }} gap={'16px'}>
      <Button type={'primary'} onClick={() => {
        onDisconnect()
        onClose()
      }}>Disconnect wallet</Button>
      <Button onClick={onClose}>Close</Button>
    </Box>
  </Box>
}
