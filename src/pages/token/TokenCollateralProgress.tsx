import {Box, Text} from "grommet";
import {Progress} from "antd";
import {TokenEnriched} from "../../types.ts";
import {formatUnits} from "viem";
import {useMemo} from "react";
import moment from 'moment'

export const TokenCollateralProgress = (props: {
  collateralPercent: string
  tokenCollateral: bigint
  requiredCollateral: bigint
  token: TokenEnriched
}) => {
  const { token, collateralPercent, tokenCollateral, requiredCollateral } = props

  const isCompetitionExtended = useMemo(() => {
    if(token.competition) {
      const { winnerToken, timestampStart } = token.competition
      return !winnerToken && moment().diff(moment(+timestampStart * 1000), 'days') > 7
    }
    return false
  }, [token])

  return <Box>
    <Text>Collateral progress: {collateralPercent}%</Text>
    <Box width={'100%'}>
      <Progress
        percent={Number(collateralPercent)}
        // status="active"
        showInfo={false}
        size={{
          height: 12
        }}
        strokeColor={{ from: '#108ee9', to: '#87d068' }}
      />
      <Box>
        {(+collateralPercent >= 100) &&
            <Text>The minimum collateral threshold of {formatUnits(requiredCollateral, 18)} ONE has been reached</Text>
        }
        {(+collateralPercent < 100) &&
            <Text
                size={'small'}
            >
                Graduate this coin to swap.country at {formatUnits(requiredCollateral, 18)} ONE market cap
            </Text>
        }
        {(isCompetitionExtended && requiredCollateral > tokenCollateral) &&
          <Text size={'small'}>
            {formatUnits((requiredCollateral - tokenCollateral), 18)} amount of ONE needed before competition ends
          </Text>
        }
      </Box>
    </Box>
  </Box>
}
