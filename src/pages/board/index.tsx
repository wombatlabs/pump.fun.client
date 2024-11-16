import { Box } from 'grommet'
import {TokensList} from "./TokensList.tsx";

export const BoardPage = () => {
  return <Box>
    {/*<Box>*/}
    {/*  <iframe id="simpleswap-frame" name="SimpleSwap Widget" width="528px" height="392px"*/}
    {/*          src="https://simpleswap.io/widget/26484d8c-7182-44e6-8a5b-9feddeb6354b" frameBorder="0"></iframe>*/}
    {/*  <Box align={'center'}>*/}
    {/*    <Button type={'text'} onClick={() => navigate('/create')}>*/}
    {/*      <Text color={'accentWhite'} size={'22px'}>Create New Token</Text>*/}
    {/*    </Button>*/}
    {/*  </Box>*/}
    {/*</Box>*/}
    <Box margin={{top: '32px'}}>
      <TokensList/>
    </Box>
  </Box>
}
