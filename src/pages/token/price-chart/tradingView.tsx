import {useEffect, useMemo, useRef, useState} from 'react'
import {
  createChart,
  DeepPartial,
  TickMarkFormatter,
  Time,
  ChartOptions,
  ISeriesApi,
  PriceFormatterFn
} from 'lightweight-charts';
import { darkTheme } from "./theme";
import styled from "styled-components";
import moment from 'moment';
import { Text, Box } from 'grommet';

const toolTipWidth = 130;
const toolTipHeight = 84;
const toolTipMargin = 15;

const TooltipContainer = styled(Box)`
    position: absolute;
    display: none;
    color: #ADAEB8;
    width: ${toolTipWidth + 16}px;
    height: ${toolTipHeight}px;
    padding: 8px;
    text-align: left;
    z-index: 1000;
    top: 12px;
    left: 12px;
    border: 1px solid #383D57;
    pointer-events: none;
`

export interface TradingViewItem {
  time: Time
  value: number
}

export interface TradingViewCandle {
  time: Time
  open: number
  high: number
  low: number
  close: number
}

export interface TradingViewProps {
  width?: number
  height: number
  lineItems?: TradingViewItem[]
  candleItems?: TradingViewCandle[]
  priceFormatter?: PriceFormatterFn
  tickMarkFormatter?: TickMarkFormatter
  tooltipFormatter?: (tooltip: TradingViewTooltipState) => TradingViewTooltipState
}

export interface TradingViewTooltipState {
  visible: boolean
  title: string,
  value: string,
  time: string,
  left: number,
  top: number
}

const defaultTooltipState: TradingViewTooltipState = {
  visible: false,
  title: '',
  value: '',
  time: '',
  left: 0,
  top: 0
}

export const TradingView = (props: TradingViewProps) => {
  const {
    width,
    height,
    lineItems,
    candleItems,
    tooltipFormatter
  } = props;

  const chartContainerRef = useRef<HTMLElement>();

  const [tooltipState, setTooltipState] = useState<TradingViewTooltipState>(defaultTooltipState)

  const onCrosshairMove = (param: any, series: ISeriesApi<'Area'>) => {
    if (!chartContainerRef.current) {
      return
    }

    const container = chartContainerRef.current
    let newTooltipState: TradingViewTooltipState = {...defaultTooltipState}

    if (
      param.point === undefined ||
      !param.time ||
      param.point.x < 0 ||
      param.point.x > container.clientWidth ||
      param.point.y < 0 ||
      param.point.y > container.clientHeight
    ) {
      // tooltipRef.current.style.display = 'none';
    } else {
      // time will be in the same format that we supplied to setData.
      // thus it will be YYYY-MM-DD
      const data = param.seriesData.get(series);
      const price = data.value !== undefined ? data.value : data.close;
      const coordinate = series.priceToCoordinate(price);
      let shiftedCoordinate = param.point.x - 50;
      if (coordinate === null) {
        return;
      }
      shiftedCoordinate = Math.max(
        0,
        Math.min(container.clientWidth - toolTipWidth, shiftedCoordinate)
      );
      const coordinateY =
        coordinate - toolTipHeight - toolTipMargin > 0
          ? coordinate - toolTipHeight - toolTipMargin
          : Math.max(
            0,
            Math.min(
              container.clientHeight - toolTipHeight - toolTipMargin,
              coordinate + toolTipMargin
            )
          );

      newTooltipState = {
        ...newTooltipState,
        visible: true,
        title: '',
        value: price,
        time: param.time,
        left: shiftedCoordinate,
        top: coordinateY
      }
    }
    setTooltipState(newTooltipState)
  }

  useEffect(
    () => {
      const handleResize = () => {
        // @ts-ignore
        chart.applyOptions({width: chartContainerRef.current.clientWidth});
      };

      // @ts-ignore
      const chart = createChart(chartContainerRef.current, {
        width: width || (chartContainerRef && chartContainerRef.current
          // @ts-ignore
          ? chartContainerRef.current.clientWidth
          : undefined),
        height,
        // handleScroll: false,
        // handleScale: false,
        rightPriceScale: {
          borderVisible: false,
          visible: false,
        },
        leftPriceScale: {
          visible: true,
        },
        timeScale: {
          borderVisible: false,
        },
        grid: {
          vertLines: {
            visible: false
          },
          horzLines: {
            visible: false
          }
        }
      });
      // @ts-ignore
      chart.applyOptions(darkTheme.chart)

      let chartOptions: DeepPartial<ChartOptions> = {
        crosshair: {
          // hide the horizontal crosshair line
          horzLine: {
            visible: false,
            labelVisible: false,
          },
          // hide the vertical crosshair label
          vertLine: {
            labelVisible: false,
          },
        },
        localization: {
          priceFormatter: (value: number) => {
            // return abbreviateNumber(value)
            return value
          }
        }
      }

      if(props.priceFormatter) {
        chartOptions = {
          ...chartOptions,
          localization: {
            ...chartOptions.localization,
            priceFormatter: props.priceFormatter
          }
        }
      }

      if (props.tickMarkFormatter) {
        chartOptions = {
          ...chartOptions,
          timeScale: {
            ...chartOptions.timeScale,
            tickMarkFormatter: props.tickMarkFormatter
          }
        }
      }

      chart.applyOptions(chartOptions)
      chart.timeScale().fitContent();

      if (lineItems) {
        const newSeries = chart.addAreaSeries();
        newSeries.setData(lineItems);
        // newSeries.applyOptions(darkTheme.series)
        chart.subscribeCrosshairMove((param) => onCrosshairMove(param, newSeries))
      }

      if (candleItems) {
        const candlestickSeries = chart.addCandlestickSeries({})
        candlestickSeries.setData(candleItems)
      }

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);

        chart.remove();
      };
    },
    [lineItems, candleItems, chartContainerRef.current]
  );

  const tooltip = useMemo(() => {
    return tooltipFormatter ? tooltipFormatter(tooltipState) : tooltipState
  }, [tooltipState])

  // @ts-ignore
  return <div
    // @ts-ignore
    ref={chartContainerRef}
    style={{
      position: 'relative',
      // opacity: props.isLoading ? 0.4 : 1
    }}
  >
    {tooltip.visible &&
        <TooltipContainer
            style={{
              top: `${tooltip.top}px`,
              left: `${tooltip.left}px`,
              display: 'flex'
            }}
            justify={'center'}
            key={tooltip.value}
        >
            <Text color={'accentWhite'}>
              {moment(+tooltip.time * 1000).format('MMM D, YYYY')}
            </Text>
            <Box justify={'between'} margin={{top: '2px'}} gap={'2px'}>
              {tooltip.title &&
                  <Text color={'text'} size={'14px'}>
                    {tooltip.title}
                  </Text>
              }
                <Text color={'accentWhite'} size={'18px'}>
                  {tooltip.value}
                </Text>
            </Box>
        </TooltipContainer>
    }
  </div>
}
