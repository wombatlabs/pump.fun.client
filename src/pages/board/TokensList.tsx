import {Box, Text} from "grommet";
import {useEffect, useState} from "react";
import {getTokens} from "../../api";
import {Token} from "../../types.ts";
import {TokenItem} from "./TokenItem.tsx";
import {Spin} from "antd";
import styled from "styled-components";

const TokensContainer = styled(Box)`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    
    > div {
        flex: 1 1 calc(33.333% - 16px); /* 3 columns, adjusting for gap */
        box-sizing: border-box;
        padding: 20px;
    }
`

export const TokensList = () => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [isInitialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true)
        const data = await getTokens()
        setTokens(data)
      } catch (e) {
        console.error('Failed to load tokens', e)
      } finally {
        setInitialLoading(false)
      }
    }
    loadData()
  }, []);

  return <Box>
    {tokens.length > 0 && isInitialLoading && <Box direction={'row'} gap={'8px'} align={'center'} justify={'center'}>
        <Text>Loading...</Text>
        <Spin />
    </Box>}
    {tokens.length === 0 && !isInitialLoading && <Box>
        <Text>No tokens found</Text>
    </Box>}
    <TokensContainer direction={'row'}>
      {tokens.map(token => {
        return <TokenItem key={token.id} data={token} />
      })}
    </TokensContainer>
  </Box>
}
