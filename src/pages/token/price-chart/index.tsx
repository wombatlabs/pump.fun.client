import {Box} from "grommet";
import {TradingView, TradingViewItem} from "./tradingView";
import {useEffect, useMemo, useState} from "react";
import {Candle} from "../../../types.ts";
import {getCandles} from "../../../api";
import Decimal from "decimal.js";
import moment from "moment";
import {BarPrice, Time} from "lightweight-charts";
import usePoller from "../../../hooks/usePoller.ts";
import useIsTabActive from "../../../hooks/useActiveTab.ts";

const ChartHeight = 312

export const PriceChart = (props: {
  tokenAddress: string
}) => {
  const { tokenAddress } = props

  const [candles, setCandles] = useState<Candle[]>([])
  const isTabActive = useIsTabActive()

  const loadData = async () => {
    try {
      const items = await getCandles({ tokenAddress })
      setCandles(items)
    } catch (e) {
      console.error('Failed to load candles', e)
    }
  }

  useEffect(() => {
    if(tokenAddress) {
      loadData()
    }
  }, [tokenAddress]);

  usePoller(() => {
    if(tokenAddress && isTabActive) {
      loadData()
    }
  }, 5000)

  const chartItems: TradingViewItem[] = useMemo(() => {
    if(candles.length === 0) {
      return [{
        time: Date.now() as Time,
        value: 0,
      }]
    }
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
            const amount = new Decimal(value)
            let amountStr = ''
            if(amount.lt(0.0001)) {
              amountStr = `<${0.0001}`
            }
            if(amount.lt(1)) {
              amountStr = amount.toFixed(4)
            }
            if(amount.lt(1000)) {
              amountStr = amount.toFixed(1)
            }
            // amountStr = amountStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            return `${amountStr} ONE`
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
