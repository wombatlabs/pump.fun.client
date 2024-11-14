import {Box, Text} from "grommet";
import {useEffect, useState} from "react";
import {getTokens, getTokenWinners} from "../../api";
import {Token, TokenWinner} from "../../types.ts";
import {TokenItem} from "./TokenItem.tsx";
import {Skeleton} from "antd";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import moment from "moment";

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
  const [currentWinner, setCurrentWinner] = useState<TokenWinner>()
  const [isInitialLoading, setInitialLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true)
        const [tokensData, winnersData] = await Promise.all([
          getTokens(),
          getTokenWinners()
        ])
        setTokens(tokensData)
        setCurrentWinner(winnersData[0])
      } catch (e) {
        console.error('Failed to load tokens', e)
      } finally {
        setInitialLoading(false)
      }
    }
    loadData()
  }, []);

  return <Box>
    {(tokens.length === 0 && isInitialLoading) &&
        <Box direction={'row'} gap={'48px'} align={'center'} justify={'center'}>
          {Array(3).fill(null).map((_, index) => {
            return <Box direction={'row'} gap={'8px'} key={index}>
              <Skeleton.Avatar active={true} shape={'square'} style={{ width: '130px', height: '130px' }} />
              <Box>
                <Skeleton.Input active={true} style={{ width: '150px', height: '12px' }} />
                <Skeleton.Input active={true} style={{ width: '150px', height: '12px' }} />
                <Skeleton.Input active={true} style={{ width: '150px', height: '12px' }} />
              </Box>
            </Box>
          })}
        </Box>
    }
    {currentWinner &&
        <Box align={'center'}>
            <Box>
                <Text size={'20px'} color={'golden'}>Daily Meme King 👑</Text>
            </Box>
            <Box
                border={{ color: 'golden', size: '1px' }}
                round={'6px'}
                margin={{ top: '4px' }}
                style={{ position: 'relative' }}
            >
                <Box style={{ position: 'absolute', right: 0, top: '-24px' }}>
                    <Text>{moment(+currentWinner.timestamp * 1000).format('MMM DD, YYYY')}</Text>
                </Box>
                <TokenItem
                    key={currentWinner.id}
                    data={currentWinner.token}
                    onClick={() => navigate(`/${currentWinner.token.address}`)}
                />
            </Box>
        </Box>
    }
    <Box margin={{ top: '32px' }}>
      {tokens.length === 0 && !isInitialLoading && <Box>
          <Text>No tokens found</Text>
      </Box>}
      <TokensContainer direction={'row'}>
        {tokens.map(token => {
          return <TokenItem key={token.id} data={token} onClick={() => navigate(`/${token.address}`)} />
        })}
      </TokensContainer>
    </Box>
  </Box>
}
