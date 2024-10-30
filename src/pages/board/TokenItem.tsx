import {Box, Text} from "grommet";
import {Token} from "../../types.ts";
import styled from "styled-components";
import moment from 'moment'

const TokenContainer = styled(Box)`
    border: 1px solid transparent;
    padding: 12px;
    &:hover {
        border-color: gray;
    }
`

export const TokenItem = (props: {
  data: Token
}) => {
  const { data: {
    address,
    symbol,
    name,
    timestamp,
    user
  } } = props

  return <TokenContainer>
    <Text>Created by {user?.username} at {moment(+timestamp * 1000).format('LTS')}</Text>
    <Text>{name}</Text>
    <Text>{symbol}</Text>
    <Text>{address}</Text>
  </TokenContainer>
}
