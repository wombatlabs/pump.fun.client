import {Box, Text} from "grommet";
import {useMemo} from "react";
import Decimal from 'decimal.js'
import {Progress} from "antd";

export const TokenCollateralProgress = (props: {
  requiredCollateral: bigint
  tokenCollateral: bigint
}) => {
  const { requiredCollateral, tokenCollateral } = props

  const collateralProgressPercent = useMemo(() => {
    if(requiredCollateral > 0n && tokenCollateral > 0n) {
      return new Decimal(tokenCollateral.toString())
        .div(new Decimal(requiredCollateral.toString()))
        .mul(100)
        .toFixed(1)
    }
    return '0'
  }, [requiredCollateral, tokenCollateral])

  return <Box>
    <Text>Token collateral progress: {collateralProgressPercent}%</Text>
    <Box width={'100%'}>
      <Progress
        percent={Number(collateralProgressPercent)}
        status="active"
        showInfo={false}
        strokeColor={{ from: '#108ee9', to: '#87d068' }}
      />
    </Box>
  </Box>
}
