import { Box, Text } from 'grommet'
import {TokensList} from "./TokensList.tsx";
import {Button} from "antd";
import { useNavigate } from 'react-router-dom'

export const BoardPage = () => {
  const navigate = useNavigate();

  return <Box>
      <Box align={'center'}>
        <Button type={'text'} onClick={() => navigate('/create')}>
          <Text color={'accentWhite'} size={'22px'}>Create New Token</Text>
        </Button>
      </Box>
    <Box margin={{top: '16px'}}>
      <TokensList/>
    </Box>
  </Box>
}
