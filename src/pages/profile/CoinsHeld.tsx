import {Box, Spinner, Text} from "grommet";
import {Image} from "antd";
import {useEffect, useState} from "react";
import {getTokenBalances} from "../../api";
import {TokenBalance} from "../../types.ts";
import {useNavigate} from "react-router-dom";
import {formatUnits} from "viem";

export const CoinsHeld = (props: {
  userAddress: string
}) => {
  const { userAddress } = props
  const [isLoading, setLoading] = useState<boolean>(false);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([])

  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await getTokenBalances({ userAddress })
        setTokenBalances(data)
        console.log('Tokens held:', data)
      } catch (e) {
        console.error('Failed to load data', e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return <Box>
    {isLoading &&
        <Box align={'center'}><Spinner color={'activeStatus'} /></Box>
    }
    <Box gap={'16px'}>
      {tokenBalances.map(item => {
        return <Box key={item.id}>
          <Box direction={'row'} gap={'16px'}>
            <Box>
              <Image width={'100px'} src={item.token.uriData?.image} />
            </Box>
            <Box justify={'between'}>
              <Text>{formatUnits(BigInt(item.balance), 18)} {item.token.symbol}</Text>
              <Box onClick={() => navigate(`/${item.token.address}`)}>
                <Text>[View coin]</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      })}
    </Box>
  </Box>
}
