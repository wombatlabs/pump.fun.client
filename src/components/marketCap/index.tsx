import {Box, Text} from "grommet";
import {useClientData} from "../../providers/DataProvider.tsx";
import {useMemo} from "react";
import {Tooltip} from "antd";

export const MarketCap = (props: {
  value: number
}) => {
  const { value } = props
  const { state: { harmonyPrice } } = useClientData()

  const usdValue = useMemo(() => {
    return value * harmonyPrice
  }, [value, harmonyPrice])

  const usdValueString = useMemo(() => {
    if(usdValue === 0) {
      return '$0'
    } else if(usdValue < 0.01) {
      return '<$0.01'
    } else if(usdValue >= 100) {
      return `$${usdValue.toFixed(0)}`
    }
    return `$${usdValue.toFixed(2)}`
  }, [usdValue])

  return <Tooltip
    placement="bottomLeft"
    title={<Box>
      <Text>{value.toFixed(6)} ONE</Text>
      <Text>${usdValue.toFixed(2)}</Text>
    </Box>}
  >
    <Text color={'positiveValue'}>
      Market cap: {usdValueString}
    </Text>
  </Tooltip>
}
