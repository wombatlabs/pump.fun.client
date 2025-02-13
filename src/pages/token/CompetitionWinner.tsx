import {Competition, TokenEnriched, WinnerLiquidityProvision} from "../../types.ts";
import {Box, Text} from "grommet";
import {Link} from "react-router-dom";
import moment from "moment/moment";

export const CompetitionWinner = (props: {
  token: TokenEnriched
  winnerLiquidityProvision?: WinnerLiquidityProvision
  competition: Competition
}) => {
  const { token, winnerLiquidityProvision, competition } = props

  console.log('competition', competition)

  if(competition.winnerToken?.id !== token.id) {
    return <Box gap={'4px'}>
      <Text color={'golden'} size={'16px'}>Competition is over</Text>
      <Text size={'16px'}>Winner: <Link to={`/${competition.winnerToken?.address}`}>{competition.winnerToken?.name}</Link></Text>
    </Box>
  }

  console.log('competition', competition)

  return <Box>
    <Box>
      <Text size={'22px'} color={'golden'}>Competition Winner 👑</Text>
      <Text>{moment(token.timestamp * 1000).format('MMM DD, YYYY')}</Text>
    </Box>
    {winnerLiquidityProvision &&
        <Box margin={{ top: '8px' }} gap={'8px'}>
            <Box>
                <Link
                    to={`https://swap.country/#/swap?inputCurrency=0xcf664087a5bb0237a0bad6742852ec6c8d69a27a&outputCurrency=${token.address}`}
                    target={'_blank'}
                >
                    <Text weight={500}>Trade on swap.country</Text>
                </Link>
            </Box>
            <Box>
                <Text>Liquidity Pool:</Text>
                <Link
                    to={`https://info.swap.harmony.one/#/harmony/pools/${winnerLiquidityProvision.pool}`}
                    target={'_blank'}
                >
                  {winnerLiquidityProvision.pool}
                </Link>
            </Box>
        </Box>
    }
  </Box>
}
