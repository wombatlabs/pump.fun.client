import {Box, Text} from "grommet";
import {Progress} from "antd";
import {TokenEnriched} from "../../types.ts";
import {formatUnits} from "viem";

export const TokenCollateralProgress = (props: {
  collateralPercent: string
  requiredCollateral: bigint
  token: TokenEnriched
}) => {
  const { collateralPercent, requiredCollateral } = props

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
      </Box>
    </Box>
  </Box>
}
