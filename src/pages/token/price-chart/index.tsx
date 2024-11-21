import {Box} from "grommet";
import {TradingView, TradingViewItem} from "./tradingView";
import {useEffect, useMemo, useState} from "react";
import {Candle} from "../../../types.ts";
import {getCandles} from "../../../api";
import Decimal from "decimal.js";
import moment from "moment";
import {BarPrice, Time} from "lightweight-charts";

const ChartHeight = 312

export const PriceChart = (props: {
  tokenAddress: string
}) => {
  const { tokenAddress } = props
  const [candles, setCandles] = useState<Candle[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const items = await getCandles({ tokenAddress })
        setCandles(items)
        console.log('Loaded candles', items)
      } catch (e) {
        console.error('Failed to load candles', e)
      }
    }
    if(tokenAddress) {
      loadData()
    }
  }, [tokenAddress]);

  const chartItems: TradingViewItem[] = useMemo(() => {
    return candles.map(item => {
      return {
        time: moment(item.time).unix() as Time,
        value: new Decimal(item.highPrice).toNumber(),
      }
    }).reverse()
  }, [candles])

  return <Box
    style={{ minWidth: '500px' }}
  >
    <Box>
      <Box
        style={{
          // opacity: 0.3,
          // filter: 'blur(2px)',
          // pointerEvents: 'none'
        }}
      >
        <TradingView
          height={ChartHeight}
          lineItems={chartItems}
          tickMarkFormatter={(timestamp, tickMarkType) => {
            if(tickMarkType === 2) {
              return moment(+timestamp * 1000).format('MM/D, HH:mm')
            }
            return ''
          }}
          priceFormatter={(value: BarPrice) => {
            const decimal = new Decimal(value)
            if(decimal.lt(0.0001)) {
              return `<${0.0001}`
            }
            if(decimal.lt(1)) {
              return decimal.toFixed(4)
            }
            if(decimal.lt(1000)) {
              return decimal.toFixed(1)
            }
            return decimal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }}
          tooltipFormatter={(tooltip) => {
            return {
              ...tooltip,
              title: 'Price (ONE)',
              value: `${new Decimal(tooltip.value || 0).toFixed()}`,
            }
          }}
        />
      </Box>
      {/*<Box width={'100%'} height={'260px'} justify={'center'} align={'center'} style={{ position: 'absolute', zIndex: 1 }}>*/}
      {/*  <Box pad={'12px'}>*/}
      {/*    <Text size={'16px'} color={'accentWhite'}>COMING SOON</Text>*/}
      {/*  </Box>*/}
      {/*</Box>*/}
    </Box>
  </Box>
}
