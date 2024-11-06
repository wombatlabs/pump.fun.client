import {Box, Spinner, Text} from "grommet";
import {Image} from "antd";
import {useEffect, useState} from "react";
import {getUserTokenCreated} from "../../api";
import {Token} from "../../types.ts";
import {UserTag} from "../../components/UserTag.tsx";
import moment from "moment/moment";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

const TokenContainer = styled(Box)`
    border: 1px solid transparent;
    padding: 12px;
    &:hover {
        border-color: gray;
    }
    max-height: 350px;
    overflow: hidden;
    cursor: pointer;
`

export const CoinsCreated = (props: {
  userAddress: string
}) => {
  const { userAddress } = props
  const [isLoading, setLoading] = useState<boolean>(false);
  const [tokens, setTokens] = useState<Token[]>([])

  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await getUserTokenCreated({ address: userAddress })
        setTokens(data)
        console.log('Tokens created:', data)
      } catch (e) {
        console.error('Failed to load data', e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return <Box>
    {isLoading &&
        <Box align={'center'}><Spinner color={'activeStatus'} /></Box>
    }
    <Box>{tokens.map(token => {
      return <TokenContainer onClick={() => navigate(`/${token.address}`)}>
        <Box direction={'row'} gap={'16px'}>
          <Box>
            <Image src={token.uriData?.image} width={'150px'} preview={false} />
          </Box>
          <Box>
            <Text>Created by <UserTag user={token.user} />{moment(+token.timestamp * 1000).fromNow()}</Text>
          </Box>
        </Box>
      </TokenContainer>
    })}</Box>
  </Box>
}
