import {Box, Text} from "grommet";
import {Progress} from "antd";

export const TokenCollateralProgress = (props: {
  collateralPercent: string
}) => {
  const { collateralPercent } = props

  return <Box>
    <Text>Token collateral progress: {collateralPercent}%</Text>
    <Box width={'100%'}>
      <Progress
        percent={Number(collateralPercent)}
        status="active"
        showInfo={false}
        strokeColor={{ from: '#108ee9', to: '#87d068' }}
      />
    </Box>
  </Box>
}
