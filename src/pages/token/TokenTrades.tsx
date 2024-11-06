import {Box, Text} from "grommet";
import {TokenTrade} from "../../types.ts";
import {useEffect, useMemo, useState} from "react";
import {getTrades} from "../../api";
import {Table, Typography} from "antd";
import moment from "moment";
import { formatUnits } from 'viem'
import {UserTag} from "../../components/UserTag.tsx";


const columns = [
  {
    title: 'Account',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Amount (ONE)',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Transaction',
    dataIndex: 'txn',
    key: 'txn',
  }
];

export const TokenTrades = (props: { tokenAddress: string }) => {
  const [trades, setTrades] = useState<TokenTrade[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true)
      const items = await getTrades({ tokenAddress: props.tokenAddress, limit: 200 })
      setTrades(items)
      console.log('Trades loaded:', items)
    } catch (e) {
      console.log('Failed to load trades', e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, []);

  const dataSource: any = useMemo(() => {
    return trades.map(trade => {
      return {
        key: trade.id,
        account: <UserTag user={trade.user} />,
        type: trade.type === 'buy' ? 'buy' : 'sell',
        amount: <Text>{formatUnits(BigInt(trade.amountIn), 18)}</Text>,
        date: <Text>
          {moment(+trade.timestamp * 1000).fromNow()}
        </Text>,
        txn: <Typography.Link href={`https://explorer.harmony.one/tx/${trade.txnHash}?shard=0`} target="_blank">
          {trade.txnHash.slice(0, 8)}
        </Typography.Link>
      }
    })
  }, [trades])

  return <Box>
    <Box>
      <Table
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 100,
          position: ['bottomCenter']
      }}
      />
    </Box>
  </Box>
}
