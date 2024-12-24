import {Box, Text} from "grommet";
import {Tooltip} from "antd";
import {useMemo} from "react";
import Decimal from "decimal.js";
import {formatUnits} from "viem";

const MinValue = new Decimal(0.000001)

export const NumberValue = (props: {
  value: string
  decimalPlaces?: number
}) => {
  const { value, decimalPlaces = 6 } = props

  const displayedValue = useMemo(() => {
    const valueDecimal = new Decimal(value).div(10**18)
    if(valueDecimal.lt(MinValue)) {
      return `<${MinValue.toString()}`
    } else {
      const fixedValue = valueDecimal.toFixed(decimalPlaces)
      return parseFloat(fixedValue).toString()
    }
  }, [value, decimalPlaces])

  const tooltipValue = <Box>
    {formatUnits(BigInt(value), 18)}
  </Box>

  return <Tooltip title={tooltipValue}>
    <Text style={{ cursor: 'pointer' }}>{displayedValue}</Text>
  </Tooltip>
}
