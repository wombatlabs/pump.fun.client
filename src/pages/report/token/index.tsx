import {Button, Input, message, Radio} from 'antd';
import { Box, Text } from 'grommet'
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {TokenEnriched} from "../../../types.ts";
import {getTokens, sendReport} from "../../../api";
import {TokenCard} from "../../../components/token";
import {useAccount} from "wagmi";
import {AxiosError} from "axios";

const radioStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
};

const ReportTypeMap: Record<string, { title: any, description: string }> = {
  '0': {
    title: <Text size={'large'} weight={500}>Abuse & Harassment</Text>,
    description: 'Insults, Unwanted Sexual Content & Graphic Objectification, Unwanted NSFW & Graphic Content, Violent Event Denial, Targeted Harassment and Inciting Harassment'
  },
  '1': {
    title: <Text size={'large'} weight={500}>Child Safety</Text>,
    description: 'Child sexual exploitation, grooming, physical child abuse, underage user'
  },
  '2': {
    title: <Text size={'large'} weight={500}>Suicide or self-harm</Text>,
    description: 'Encouraging, promoting, providing instructions or sharing strategies for self-harm'
  },
  '3': {
    title: <Text size={'large'} weight={500}>Sensitive or disturbing media</Text>,
    description: 'Graphic Content, Gratuitous Gore, Adult Nudity & Sexual Behavior, Violent Sexual Conduct, Bestiality & Necrophilia, Media depicting a deceased individual'
  },
  '-1': {
    title: <Text size={'large'} weight={500}>Other</Text>,
    description: 'Please explain why should be removed',
  },
}

const AllReportTypes = Object.keys(ReportTypeMap)

export const ReportTokenPage = () => {
  const { tokenAddress = '' } = useParams()
  const account = useAccount()

  const [token, setToken] = useState<TokenEnriched>()
  const [reportType, setReportType] = useState<number>()
  const [reportDetails, setReportDetails] = useState('')

  const onSubmit = async () => {
    try {
      if(!reportType) {
        return
      }
      const report = await sendReport({
        type: Number(reportType),
        tokenAddress,
        details: reportDetails,
        reporterUserAddress: account.address
      })
      console.log('Report sent:', report)
      message.success(`Report successfully sent`, 10);
    } catch (e) {
      const responseData: any = (e as AxiosError).response?.data
      let messageString = responseData && responseData.message
        ? responseData.message
        : 'Unknown error'
      console.error('Failed to send report:', e)
      message.error(`Failed to send report: ${messageString}`, 10);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
         if(tokenAddress) {
           const tokens = await getTokens({ search: tokenAddress, limit: 1 })
           setToken(tokens[0])
         }
      } catch (e) {}
    }
    loadData()
  }, [tokenAddress]);

  return <Box margin={{ top: '32px' }} width={'600px'}>
    <Box gap={'4px'}>
      <Text size={'18px'} color={'accentWhite'}>Select the reporting reason</Text>
    </Box>
    {token &&
        <Box margin={{ top: '16px' }}>
            <TokenCard token={token} />
        </Box>
    }
    <Box margin={{ top: '32px' }}>
      <Radio.Group
        style={radioStyle}
        value={reportType}
        options={AllReportTypes.map(key => {
          const reportItem = ReportTypeMap[key]
          return {
            value: key,
            label: <Box>
              <Text>{reportItem.title}</Text>
              <Text>{reportItem.description}</Text>
            </Box>
          }
        })}
        onChange={(e) => {
          setReportType(e.target.value)
        }}
      />
    </Box>
    <Box margin={{ top: '16px' }} gap={'4px'}>
      <Text size={'16px'}>More details</Text>
      <Input.TextArea
        rows={3}
        value={reportDetails}
        onChange={(e) => {
          setReportDetails(e.target.value)
        }}
      >
      </Input.TextArea>
    </Box>
    <Box margin={{ top: '16px' }}>
      <Button
        size={'large'}
        type={'primary'}
        disabled={!reportType}
        danger
        onClick={onSubmit}
      >Send Report</Button>
    </Box>
  </Box>
}
