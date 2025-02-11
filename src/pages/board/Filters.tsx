import {Box, Text} from "grommet";
import {SearchFilter} from "./TokensList.tsx";
import {Select, Switch} from "antd";
import {SortField, SortOrder} from "../../types.ts";
import {useMediaQuery} from "react-responsive";
import {breakpoints} from "../../utils/breakpoints.ts";

export const TokenFilters = (props: {
  filter: SearchFilter
  onChange: (prop: string, value: string | boolean) => void
}) => {
  const { filter } = props

  const isMobile = useMediaQuery({ query: `(max-width: ${breakpoints.mobile})` })

  return <Box direction={isMobile ? 'column' : 'row'} gap={'16px'}>
    <Select
      value={filter.sortingField}
      options={[
        {
          value: SortField.timestamp,
          label: 'sort: creation time'
        },
        {
          value: SortField.marketCap,
          label: 'sort: market cap'
        },
        {
          value: SortField.lastComment,
          label: 'sort: last comment'
        },
        {
          value: SortField.lastTrade,
          label: 'sort: last trade'
        }
      ]}
      style={{ minWidth: '160px' }}
      onChange={(value) => {
        props.onChange('sortingField', value)
      }}
    />
    <Select
      value={filter.sortingOrder}
      options={[
        {
          value: SortOrder.DESC,
          label: 'order: desc'
        },
        {
          value: SortOrder.ASC,
          label: 'order: asc'
        },
      ]}
      onChange={(value) => {
        props.onChange('sortingOrder', value)
      }}
    />
    {!isMobile && <Box justify={'center'}>
        <Box direction={'row'} align={'center'} gap={'4px'}>
            <Text>Show only competition:</Text>
            <Box>
                <Switch
                    size={'small'}
                    value={props.filter.isCompetition}
                    onChange={(value) => {
                      props.onChange('isCompetition', value)
                    }}
                />
            </Box>
        </Box>
    </Box>}
  </Box>
}
