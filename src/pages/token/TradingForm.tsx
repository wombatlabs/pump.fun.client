import {Box} from "grommet";
import {Button, Input} from "antd";
import styled from "styled-components";
import {useState} from "react";

const TradeButton = styled(Box)`
    padding: 8px 16px;
    background-color: #292933;
    border-radius: 6px;
    flex: 1;
    text-align: center;
    font-size: 16px;
    color: white;
`

export const TradingForm = () => {
  const [selectedSide, setSelectedSide] = useState<'buy' | 'sell'>('buy')

  return <Box background={'widgetBg'} pad={'8px'} round={'8px'} width={'300px'}>
    <Box direction={'row'} gap={'4px'}>
      <TradeButton
        onClick={() => setSelectedSide('buy')}
        style={{ background: selectedSide === 'buy' ? '#70D693' : 'unset' }}
      >
        Buy
      </TradeButton>
      <TradeButton
        onClick={() => setSelectedSide('sell')}
        style={{ background: selectedSide === 'sell' ? '#F06666' : 'unset' }}
      >
        Sell
      </TradeButton>
    </Box>
    <Box margin={{ top: '24px' }}>
      <Input placeholder={'0.0'} />
    </Box>
    <Box margin={{ top: '24px' }}>
      <Button type="primary">Place trade</Button>
    </Box>
  </Box>
}
