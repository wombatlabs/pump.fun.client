import { Box } from 'grommet'
import {Button, Input} from "antd";
import {TokensList} from "./TokensList.tsx";

export const BoardPage = () => {
  return <Box>
    <Box>
      <Box align={'center'}>
        <Button type={'text'}>
          Start a new coin
        </Button>
      </Box>
      <Box margin={{ top: '16px' }}>
        <Input
          placeholder={'Search for a token'}
          size={'large'}
          // style={{ background: '#41ddcd', color: 'black' }}
        />
      </Box>
    </Box>
    <Box>
      <TokensList />
    </Box>
  </Box>
}
