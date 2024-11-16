import { Box, Text } from 'grommet'
import {Button} from "antd";
import {TokensList} from "./TokensList.tsx";
import {useNavigate} from "react-router-dom";

export const BoardPage = () => {
  const navigate = useNavigate();

  return <Box>
    <Box>
      <Box align={'center'}>
        <Button type={'text'} onClick={() => navigate('/create')}>
          <Text color={'accentWhite'} size={'22px'}>Create New Token</Text>
        </Button>
      </Box>
    </Box>
    <Box margin={{ top: '32px' }}>
      <TokensList />
    </Box>
  </Box>
}
