import {TradingViewItem} from "./tradingView";
import moment from "moment";

const generateTradingViewItems = (): TradingViewItem[] => {
  const dateStart = moment().subtract(180, 'days').unix()
  let currentTimestamp = dateStart * 1000
  const items: TradingViewItem[] = []
  const interval = 24 * 60 * 60 * 1000
  const valueAvg = 1000

  while(currentTimestamp < Date.now()) {
    const rand = Math.random()
    const isPositive = rand > 0.5
    const needToChange = Math.random() < 0.15
    const prevValue = items[items.length - 1]?.value || valueAvg

    items.push({
      time: moment(currentTimestamp).format('YYYY-MM-DD'),
      value: needToChange
        ? prevValue + (isPositive ? 1 : -1) * prevValue * rand / 10
        : prevValue
    })
    currentTimestamp += interval
  }

  return items
}

export const chartItemsMock: TradingViewItem[] = generateTradingViewItems()
