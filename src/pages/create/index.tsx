import {Box, Spinner, Text} from 'grommet'
import {Button, Checkbox, Input, message, Tooltip, Upload, UploadProps} from "antd";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {writeContract, waitForTransactionReceipt} from "wagmi/actions";
import {appConfig, getTokenFactoryAddress} from "../../config.ts";
import TokenFactoryABI from '../../abi/TokenFactory.json'
import TokenFactoryBaseABI from '../../abi/TokenFactoryBase.json'
import {config} from "../../wagmi.ts";
import { InboxOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {useClientData} from "../../providers/DataProvider.tsx";
import {Competition, Token, TokenMetadata} from "../../types.ts";
import {addTokenMetadata, getCompetitions, getTokens} from "../../api";
import {useAccount} from "wagmi";
import {getFormError} from "./utils.ts";
import useDebounce from "../../hooks/useDebounce.ts";
import {getCompetitionEndTimestamp} from "../../utils";
import moment from "moment";

const { Dragger } = Upload;

export interface CreateTokenForm {
  name: string
  symbol: string
  description: string
  image: string
  twitterLink: string
  telegramLink: string
  websiteLink: string
  isCompetitionsEnabled: boolean
}

const defaultFormState: CreateTokenForm = {
  name: '',
  symbol: '',
  description: '',
  image: '',
  twitterLink: '',
  telegramLink: '',
  websiteLink: '',
  isCompetitionsEnabled: true
}

export const CreatePage = () => {
  const navigate = useNavigate();
  const account = useAccount()
  const [searchParams] = useSearchParams()
  const initialMode = searchParams.get('mode') || 'competition'
  const { state: { userAccount, jwtTokens } } = useClientData()

  const [currentCompetition, setCompetition] = useState<Competition>()
  const [tokenForm, setTokenForm] = useState<CreateTokenForm>(() => {
    return {
      ...defaultFormState,
      isCompetitionsEnabled: initialMode === 'competition',
    }
  })
  const [currentStatus, setCurrentStatus] = useState('')
  const [inProgress, setInProgress] = useState(false)
  const [isOptionalFieldVisible, setOptionalFieldVisible] = useState(false)
  const symbolDebounced = useDebounce(tokenForm.symbol, 300)
  const [validationError, setValidationError] = useState<string>('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [lastItem] = await getCompetitions({ limit: 1 })
        if(lastItem) {
          setCompetition(lastItem)
        } else {
          throw Error('Competition not found')
        }
      } catch (e) {
        console.error('Failed to load last competition', e)
        setTokenForm(current => {
          return {
            ...current,
            isCompetitionsEnabled: false
          }
        })
      }
    }
    loadData()
  }, []);

  useEffect(() => {
    const validateForm = async () => {
      try {
        if(tokenForm.symbol.length > 0) {
          const tokens = await getTokens({ symbol: tokenForm.symbol, limit: 1 })
          if(tokens.length > 0) {
            setValidationError('Symbol already exists')
            return
          }
        }
        setValidationError(getFormError(tokenForm))
      } catch (e) {
        console.error('Failed to validate form:', e)
      }
    }
    validateForm()
  }, [symbolDebounced, tokenForm.name, tokenForm.description])

  const onCreateClicked = async () => {
    try {
      if(!jwtTokens) {
        return
      }
      // if(account.chainId !== harmonyOne.id) {
      //   await switchNetwork(config, { chainId: harmonyOne.id })
      // }
      setInProgress(true)
      setCurrentStatus('Uploading token metadata...')
      const payload: TokenMetadata = {
        name: tokenForm.name,
        symbol: tokenForm.symbol,
        description: tokenForm.description,
        image: tokenForm.image,
        twitterLink: tokenForm.twitterLink,
        telegramLink: tokenForm.telegramLink,
        websiteLink: tokenForm.websiteLink,
      }
      console.log('Uploading token metadata...', payload)
      const metadataUrl = await addTokenMetadata(payload, { accessToken: jwtTokens.accessToken })
      console.log('Token metadata uploaded, url:', metadataUrl)

      setCurrentStatus('Minting contract...')
      const txnHash = await writeContract(config, {
        address: getTokenFactoryAddress(tokenForm.isCompetitionsEnabled),
        abi: tokenForm.isCompetitionsEnabled ? TokenFactoryABI : TokenFactoryBaseABI,
        args: [tokenForm.name, tokenForm.symbol, metadataUrl],
        functionName: 'createToken'
      });
      console.log('Create contract hash:', txnHash)
      setCurrentStatus('Waiting for confirmation...')
      const receipt = await waitForTransactionReceipt(config, {
        hash: txnHash,
        confirmations: 2
      })
      console.log('Create contract receipt:', receipt)
      let mintedToken: Token

      for(let i = 0; i < 20; i++) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const tokens = await getTokens({ search: txnHash })
        if(tokens.length === 1) {
          mintedToken = tokens[0]
          break;
        }
      }

      // @ts-ignore
      if(mintedToken) {
        message.success(`Token ${payload.name} successfully minted`);
        navigate(`/${mintedToken.address}`)
      } else {
        message.error(`Failed to confirm token status`);
      }

    } catch (e) {
      message.error(`Failed to send token metadata`);
      console.log('Failed to create metadata', e)
    } finally {
      setCurrentStatus('')
      setInProgress(false)
    }
  }

  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.jpg,.jpeg,.png,.gif',
    disabled: !account.address || !userAccount?.address || inProgress || !jwtTokens,
    headers: {
      'Authorization': `Bearer ${jwtTokens ? jwtTokens.accessToken : ''}`
    },
    multiple: false,
    listType: 'picture',
    maxCount: 1,
    action: `${appConfig.apiUrl}/uploadImage`,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        const publicImageUrl = info.file.response
        console.log('Image uploaded, public url:', publicImageUrl)
        // message.success(`${info.file.name} file uploaded successfully.`);
        setTokenForm(current => {
          return {
            ...current,
            image: publicImageUrl
          }
        })
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
        setTokenForm(current => {
          return {
            ...current,
            imageUrl: ''
          }
        })
      }
    },
    onRemove() {
      setTokenForm(current => {
        return {
          ...current,
          imageUrl: ''
        }
      })
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const isFormFilled = useMemo(() => {
    return !!tokenForm.symbol && !!tokenForm.name && !!tokenForm.image && !!tokenForm.description
  }, [tokenForm])

  const isCreateTokenDisabled =
    !isFormFilled
    || Boolean(validationError)
    || inProgress
    || !account.address
    || !userAccount?.address

  return <Box width={'450px'}>
    <Box>
      <Button type={'text'} style={{ fontSize: '22px' }} onClick={() => navigate('/board')}>
        Go back
      </Button>
    </Box>
    <Box margin={{ top: '32px' }} gap={'16px'}>
      <Box>
        <Text color={'accentLabel'} weight={500}>name</Text>
        <Input
          value={tokenForm.name}
          size={'large'}
          onChange={(e) => setTokenForm(current => {
            return {
              ...current,
              name: e.target.value,
            }
          })}
        />
      </Box>
      <Box>
        <Text color={'accentLabel'} weight={500}>ticker</Text>
        <Input
          value={tokenForm.symbol}
          size={'large'}
          onChange={(e) => setTokenForm(current => {
            return {
              ...current,
              symbol: e.target.value,
            }
          })}
        />
      </Box>
      <Box>
        <Text color={'accentLabel'} weight={500}>description</Text>
        <Input.TextArea
          rows={2}
          value={tokenForm.description}
          size={'large'}
          onChange={(e) => setTokenForm(current => {
            return {
              ...current,
              description: e.target.value,
            }
          })}
        />
      </Box>
      <Box>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from uploading company data or other
            banned files.
          </p>
        </Dragger>
      </Box>
    </Box>
    <Box
      margin={{ top: '16px' }}
      direction={'row'}
      justify={'between'}
      align={'start'}
    >
      <Checkbox
        checked={tokenForm.isCompetitionsEnabled}
        disabled={!currentCompetition}
        onChange={(e) => {
          setTokenForm(current => ({ ...current, isCompetitionsEnabled: e.target.checked }))
        }}>
        {currentCompetition && !currentCompetition.isCompleted ?
          <Box>
              <Text>Participate in Competition #{currentCompetition.competitionId}</Text>
              <Text color={'gray'} size={'12px'}>Ends after {
                moment(getCompetitionEndTimestamp(currentCompetition.timestampStart))
                  .format('DD MMM YY HH:mm:ss')
              }</Text>
          </Box>
          : <Box>
            <Text>Participate in Competition</Text>
          </Box>
        }
      </Checkbox>
      <Tooltip
        title={<Box gap={'4px'}>
          <Text>
            1. Tokens compete in weekly rounds to achieve the highest net liquidity.
          </Text>
          <Text>
            2. The competition ends every 7 days if a token reaches 420,000 ONE in net liquidity.
          </Text>
          <Text>
            3. The winning token is then listed on swap.country with a new liquidity pool created from all the net liquidity, and other tokens from the round can be exchanged into the winner token.
          </Text>
          <Link to={'/rules/'}>Read More</Link>
        </Box>}
      >
        <Box direction={'row'} gap={'4px'} align={'center'} style={{ borderBottom: '1px dashed gray' }}>
          <Text>How competition works?</Text>
          <QuestionCircleOutlined />
        </Box>
      </Tooltip>
    </Box>
    <Box margin={{ top: '16px' }}>
      <Text
        color={'activeStatus'}
        style={{ cursor: 'pointer' }}
        onClick={() => setOptionalFieldVisible(!isOptionalFieldVisible)}
      >{isOptionalFieldVisible ? 'hide more options ↑' : 'show more options ↓'}</Text>
      {isOptionalFieldVisible &&
          <Box margin={{ top: '16px', bottom: '16px' }} gap={'16px'}>
              <Box>
                  <Text color={'accentLabel'} weight={500}>twitter link</Text>
                  <Input
                      value={tokenForm.twitterLink}
                      size={'large'}
                      onChange={(e) => setTokenForm(current => {
                        return { ...current, twitterLink: e.target.value }
                      })}
                  />
              </Box>
              <Box>
                  <Text color={'accentLabel'} weight={500}>telegram link</Text>
                  <Input
                      value={tokenForm.telegramLink}
                      size={'large'}
                      onChange={(e) => setTokenForm(current => {
                        return { ...current, telegramLink: e.target.value }
                      })}
                  />
              </Box>
              <Box>
                  <Text color={'accentLabel'} weight={500}>website</Text>
                  <Input
                      value={tokenForm.websiteLink}
                      size={'large'}
                      onChange={(e) => setTokenForm(current => {
                        return { ...current, websiteLink: e.target.value }
                      })}
                  />
              </Box>
          </Box>
      }
    </Box>
    <Box margin={{ top: '16px' }} gap={'16px'}>
      <Box>
        <Button
          type={'primary'}
          size={'large'}
          disabled={isCreateTokenDisabled}
          onClick={onCreateClicked}
        >
          Create Token
        </Button>
        {validationError &&
            <Box>
                <Text color={'errorMessage'}>{validationError}</Text>
            </Box>
        }
      </Box>
      <Box align={'center'} direction={'row'} gap={'16px'} justify={'center'}>
        {inProgress && <Spinner color={'activeStatus'} />}
        {currentStatus &&
            <Text color={'activeStatus'}>{currentStatus}</Text>
        }
      </Box>
    </Box>
  </Box>
}
