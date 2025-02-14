import {Competition, TokenEnriched} from "../../types.ts";
import {Box, Text} from "grommet";
import {Link} from "react-router-dom";
import moment from "moment/moment";

export const CompetitionWinner = (props: {
  token: TokenEnriched
  // winnerLiquidityProvision?: WinnerLiquidityProvision
  competition: Competition
}) => {
  const { token, competition } = props

  if(competition.winnerToken?.id !== token.id) {
    return <Box gap={'4px'}>
      <Text color={'golden'} size={'16px'}>Competition is over</Text>
      <Text size={'16px'}>Winner: <Link to={`/${competition.winnerToken?.address}`}>{competition.winnerToken?.name}</Link></Text>
    </Box>
  }

  return <Box>
    <Box>
      <Text size={'22px'} color={'golden'}>Competition Winner 👑</Text>
      <Text>{moment(token.timestamp * 1000).format('MMM DD, YYYY')}</Text>
    </Box>
  </Box>
}
