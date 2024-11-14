import {Box, Text} from "grommet";
import {UserAccount} from "../../types.ts";
import {Button, Typography} from "antd";
import {useClientData} from "../../providers/DataProvider.tsx";
import {Link} from "react-router-dom";

export const ProfileModal = (props: {
  user: UserAccount
  onClose: () => void;
}) => {
  const { user, onClose } = props

  const { onDisconnect } = useClientData()

  return <Box>
    <Box gap={'2px'}>
      <Text>@{user.username}</Text>
      <Text>
        <Link to={'/profile/' + user.address} onClick={() => {
          onClose()
        }}>
          Open profile page
        </Link>
      </Text>
    </Box>
    <Box margin={{ top: '16px' }}>
      <Box pad={'4px 8px'} border={{ color: 'white' }} round={'6px'}>
        <Typography.Text copyable={true}>
          {user.address}
        </Typography.Text>
      </Box>
    </Box>
    <Box margin={{ top: '32px' }} gap={'16px'} direction={'row'}>
      <Button type={'primary'} onClick={() => {
        onDisconnect()
        onClose()
      }}>Disconnect wallet</Button>
      <Button onClick={onClose}>Close</Button>
    </Box>
  </Box>
}
