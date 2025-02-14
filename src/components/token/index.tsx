import {TokenEnriched} from "../../types.ts";
import {Box, Text} from "grommet";
import {Image, Typography} from "antd";
import {shortEthAddress} from "../../utils";

export const TokenCard = (props: {
  token: TokenEnriched
  imageSize?: number
}) => {
  const { token, imageSize = 200 } = props

  return <Box gap={'8px'}>
    <Box direction={'row'} gap={'16px'} style={{ maxWidth: '600px' }}>
      <Box>
        <Image
          width={imageSize}
          src={token.uriData?.image}
        />
      </Box>
      <Box style={{ maxWidth: 'calc(100% - 200px - 16px)' }}>
        <Text><b>{token.name} (ticker: {token.symbol})</b>: {token.uriData?.description}</Text>
      </Box>
    </Box>
    <Typography.Text copyable={{ text: token.address }}>
      Contract address: {shortEthAddress(token.address)}
    </Typography.Text>
  </Box>
}
