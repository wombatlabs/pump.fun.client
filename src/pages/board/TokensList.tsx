import {Box, Text} from "grommet";
import {useEffect, useState} from "react";
import {getTokens} from "../../api";
import {SortField, SortOrder, TokenEnriched} from "../../types.ts";
import {TokenItem} from "./TokenItem.tsx";
import {Input, Skeleton} from "antd";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import useDebounce from "../../hooks/useDebounce.ts";
import {CurrentWinner} from "./CurrentWinner.tsx";
import {TokenFilters} from "./Filters.tsx";
import {useMediaQuery} from "react-responsive";
import {breakpoints} from "../../utils/breakpoints.ts";

const LSFiltersKey = 'pump_one_filters_v1'
const getInitialFiltersState = () => {
  const savedState = localStorage.getItem(LSFiltersKey);
  if(savedState) {
    const parsedState = JSON.parse(savedState);
    return {
      ...DefaultFilter,
      ...parsedState
    }
  }
  return {...DefaultFilter}
}

const saveFiltersStateToLS = (state: SearchFilter) => {
  localStorage.setItem(LSFiltersKey, JSON.stringify(state));
}

export interface SearchFilter {
  sortingField: SortField
  sortingOrder: SortOrder
  isCompetition: boolean
}

export const DefaultFilter: SearchFilter = {
  sortingField: SortField.timestamp,
  sortingOrder: SortOrder.DESC,
  isCompetition: false
}

const TokensContainer = styled(Box)`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-left: -16px;
    
    > div {
        flex: 1 1 calc(33.333% - 16px); /* 3 columns, adjusting for gap */
        box-sizing: border-box;
        padding: 20px;
    }
`

const SkeletonToken = () => {
  return <Box direction={'row'} gap={'8px'}>
    <Skeleton.Avatar active={true} shape={'square'} style={{ width: '130px', height: '130px' }} />
    <Box>
      <Skeleton.Input active={true} style={{ width: '150px', height: '12px' }} />
      <Skeleton.Input active={true} style={{ width: '150px', height: '12px' }} />
      <Skeleton.Input active={true} style={{ width: '150px', height: '12px' }} />
    </Box>
  </Box>
}

export const TokensList = () => {
  const [tokens, setTokens] = useState<TokenEnriched[]>([])
  const [currentWinner, setCurrentWinner] = useState<TokenEnriched>()
  const [isInitialLoading, setInitialLoading] = useState(true)
  // const [isLoading, setIsLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [searchFilter, setSearchFilter] = useState(getInitialFiltersState())
  const searchValueDebounced = useDebounce(searchValue, 300)

  const navigate = useNavigate()
  const isMobile = useMediaQuery({ query: `(max-width: ${breakpoints.mobile})` })

  useEffect(() => {
    const loadData = async () => {
      try {
        // setIsLoading(true)
        const [tokensData, winnersData] = await Promise.all([
          getTokens({
            search: searchValueDebounced,
            sortingField: searchFilter.sortingField,
            sortingOrder: searchFilter.sortingOrder,
            isCompetition: !searchFilter.isCompetition ? undefined : true
          }),
          getTokens({ isWinner: true, limit: 1 })
        ])
        setTokens(tokensData)
        setCurrentWinner(winnersData[0])
      } catch (e) {
        console.error('Failed to load tokens', e)
      } finally {
        setInitialLoading(false)
        // setIsLoading(false)
      }
    }
    loadData()
    saveFiltersStateToLS(searchFilter)
  }, [searchFilter, searchValueDebounced]);

  return <Box
    width={'100vw'}
    pad={{ left: '16px', right: '16px' }}
  >
    {currentWinner &&
        <CurrentWinner data={currentWinner} />
    }
    <Box margin={{ top: '16px' }}>
      {!isMobile &&
          <Box align={'center'}>
              <Box width={'360px'} direction={'row'} gap={'16px'} align={'center'}>
                  <Input
                      placeholder={'Search for a token (ticker, name, address)'}
                      value={searchValue}
                      allowClear={true}
                      onChange={(e) => setSearchValue(e.target.value || '')}
                  />
              </Box>
          </Box>
      }
      <Box>
        <TokenFilters
          filter={searchFilter}
          onChange={(prop: string, value: string | boolean) => {
            setSearchFilter((current: any) => ({ ...current, [prop]: value }))
          }}
        />
      </Box>
    </Box>
    <Box align={'center'} margin={{ top: '8px' }}>
      {tokens.length === 0 && !isInitialLoading && <Box align={'center'} margin={{ top: '8px' }}>
          <Text size={'18px'}>No tokens found</Text>
      </Box>}
      {(tokens.length === 0 && isInitialLoading) &&
          <Box direction={'row'} gap={'48px'} align={'center'} justify={'center'}>
            {Array(3).fill(null).map((_, index) => <SkeletonToken key={index} />)}
          </Box>
      }
      <TokensContainer direction={'row'} width={'100%'}>
        {tokens.map(token => {
          return <TokenItem
            key={token.id}
            data={token}
            onClick={() => navigate(`/${token.address}`)}
          />
        })}
      </TokensContainer>
    </Box>
  </Box>
}
