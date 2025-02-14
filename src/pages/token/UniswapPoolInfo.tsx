import {Box, Text} from "grommet";
import {WinnerLiquidityProvision} from "../../types.ts";
import {Link} from "react-router-dom";

export const UniswapPoolInfo = (props: {
  winnerLiquidityProvision: WinnerLiquidityProvision
}) => {
  const {winnerLiquidityProvision} = props

  return <Box>
    <Box margin={{ top: '8px' }} gap={'8px'}>
      <Box>
        <Link
          to={`https://swap.country/#/swap?inputCurrency=0xcf664087a5bb0237a0bad6742852ec6c8d69a27a&outputCurrency=${winnerLiquidityProvision.token.address}`}
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
  </Box>
}
