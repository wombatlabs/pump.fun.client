import {Box, Spinner, Text} from 'grommet'
import {Button, Input, message, Upload, UploadProps} from "antd";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {writeContract, waitForTransactionReceipt} from "wagmi/actions";
import {appConfig} from "../../config.ts";
import TokenFactoryABI from '../../abi/TokenFactory.json'
import {config} from "../../wagmi.ts";
import { InboxOutlined } from '@ant-design/icons';
import {useClientData} from "../../providers/DataProvider.tsx";
import {Token, TokenMetadata} from "../../types.ts";
import {addTokenMetadata, getTokens} from "../../api";
import {useAccount} from "wagmi";

const { Dragger } = Upload;

interface CreateTokenForm {
  name: string
  symbol: string
  description: string
  image: string
}

const defaultFormState: CreateTokenForm = {
  name: '',
  symbol: '',
  description: '',
  image: ''
}

export const CreatePage = () => {
  const navigate = useNavigate();
  const account = useAccount()
  const { state: { userAccount } } = useClientData()

  const [tokenForm, setTokenForm] = useState<CreateTokenForm>(defaultFormState)
  const [currentStatus, setCurrentStatus] = useState('')
  const [inProgress, setInProgress] = useState(false)

  const onCreateClicked = async () => {
    try {
      setInProgress(true)
      setCurrentStatus('Uploading token metadata...')
      const payload: TokenMetadata = {
        userAddress: userAccount?.address || '',
        name: tokenForm.name,
        symbol: tokenForm.symbol,
        description: tokenForm.description,
        image: tokenForm.image,
      }
      const metadataUrl = await addTokenMetadata(payload)
      console.log('metadataUrl:', metadataUrl)

      setCurrentStatus('Minting contract...')
      const txnHash = await writeContract(config, {
        // @ts-ignore
        address: appConfig.tokenFactoryAddress,
        abi: TokenFactoryABI,
        args: [tokenForm.name, tokenForm.symbol, metadataUrl],
        functionName: 'createToken'
      });
      console.log('Create contract hash:', txnHash)
      setCurrentStatus('Waiting for confirmation...')
      const receipt = await waitForTransactionReceipt(config, {
        hash: txnHash,
        confirmations: 6
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
      message.error(`Failed to add token metadata`);
      console.log('Failed to create metadata', e)
    } finally {
      setCurrentStatus('')
      setInProgress(false)
    }
  }

  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.jpg,.jpeg,.png,.webp',
    disabled: !account.address || !userAccount?.address,
    headers: {
      'meta_user_address': userAccount?.address || '',
      'meta_file_name': userAccount?.address || ''
    },
    multiple: false,
    listType: 'picture',
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

  return <Box width={'400px'}>
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
          rows={4}
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
      <Button
        type={'primary'}
        size={'large'}
        disabled={Object.values(tokenForm).includes('') || inProgress || !account.address || !userAccount?.address}
        onClick={onCreateClicked}
      >
        Create Coin
      </Button>
      <Box align={'center'} direction={'row'} gap={'16px'} justify={'center'}>
        {inProgress && <Spinner color={'activeStatus'} />}
        {currentStatus &&
            <Text color={'activeStatus'}>{currentStatus}</Text>
        }
      </Box>
    </Box>
  </Box>
}
