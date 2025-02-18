import {Box, Text} from "grommet";
import moment from "moment/moment";
import {TokenItem} from "./TokenItem.tsx";
import {TokenEnriched} from "../../types.ts";
import {useNavigate} from "react-router-dom";

export const CurrentWinner = (props: {
  data: TokenEnriched
}) => {
  const {data: currentWinner} = props

  const navigate = useNavigate();

  return <Box align={'center'}>
    <Box>
      <Text size={'20px'} color={'golden'}>Past Meme King 👑</Text>
    </Box>
    <Box
      border={{ color: 'golden', size: '1px' }}
      round={'6px'}
      margin={{ top: '4px' }}
      style={{ position: 'relative', maxWidth: '500px' }}
    >
      <Box style={{ position: 'absolute', right: 0, top: '-24px' }}>
        <Text>{moment(+currentWinner.timestamp * 1000).format('MMM DD, YYYY')}</Text>
      </Box>
      <TokenItem
        key={currentWinner.id}
        data={currentWinner}
        style={{ minWidth: '100%' }}
        onClick={() => navigate(`/${currentWinner.address}`)}
      />
    </Box>
  </Box>
}
