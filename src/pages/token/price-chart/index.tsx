import {Box, Text} from "grommet";
import {TradingView} from "./tradingView";
import {chartItemsMock} from "./mocks";

const ChartHeight = 312

export const PriceChart = () => {
  return <Box
    style={{ minWidth: '500px' }}
  >
    <Box>
      <Box
        style={{
          opacity: 0.3,
          filter: 'blur(2px)',
          pointerEvents: 'none'
        }}
      >
        <TradingView
          height={ChartHeight}
          lineItems={chartItemsMock}
          // priceFormatter={(value: BarPrice) => {
          //   return abbreviateNumber(value, 2)
          // }}
          // tooltipFormatter={(tooltip) => {
          //   const prefix = portfolio?.currency.id || ''
          //   const suffix = portfolio?.portfolioId || ''
          //   return {
          //     ...tooltip,
          //     title: chartType === 'margin' ? 'Margin' : 'Profit and Loss',
          //     value: `${prefix}${abbreviateNumber(tooltip.value, 2)}${suffix}`,
          //   }
          // }}
        />
      </Box>
      <Box width={'100%'} height={'260px'} justify={'center'} align={'center'} style={{ position: 'absolute', zIndex: 1 }}>
        <Box pad={'12px'}>
          <Text size={'16px'} color={'accentWhite'}>COMING SOON</Text>
        </Box>
      </Box>
    </Box>
  </Box>
}
