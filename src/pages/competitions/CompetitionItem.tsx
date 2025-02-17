import {Box, Text} from "grommet";
import {Competition} from "../../types.ts";
import {TokenCard} from "../../components/token";
import {Tag} from "antd";
import moment from "moment";
import { appConfig } from '../../config.ts'

export const CompetitionItem = (props: {
  competition: Competition
}) => {
  const { competition } = props
  const { competitionId, timestampStart, timestampEnd, isCompleted, tokensCount, winnerToken } = competition

  const endTime = timestampEnd
    ? moment(+timestampEnd * 1000).format('MMM D, YYYY, HH:mm:ss')
    : `after ${moment(+timestampStart * 1000 + appConfig.competitionDuration).format('DD MMM YY HH:mm:ss')}`


  return <Box background={'#242427'} pad={'8px 12px'} round={'5px'}>
    <Box direction={'row'} gap={'8px'} align={'center'}>
      <Text color={'accentWhite'} size={'16px'}>
        Competition #{competitionId}
      </Text>
      {!isCompleted && <Tag color="success">Active</Tag>}
      {isCompleted && <Tag color="blue">Completed</Tag>}
    </Box>
    <Box gap={'2px'} margin={{ top: '8px' }}>
      <Text>Start time: {moment(+timestampStart * 1000).format('MMM D, YYYY, HH:mm:ss')}</Text>
      <Text>End time: {endTime}</Text>
      <Text>Total number of tokens: {tokensCount}</Text>
    </Box>
    {winnerToken &&
      <Box margin={{ top: '8px' }} gap={'6px'}>
          <Text color={'accentWhite'} size={'16px'}>Winner</Text>
          <TokenCard token={winnerToken} imageSize={100} />
      </Box>
    }
  </Box>
}
