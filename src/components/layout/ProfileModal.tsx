import {Box, Text} from "grommet";
import {UserAccount} from "../../types.ts";
import {Button, Input, Typography, message} from "antd";
import {useClientData} from "../../providers/DataProvider.tsx";
import {Link} from "react-router-dom";
import {updateUser} from "../../api";
import {useState} from "react";
import axios from "axios";

interface EditForm {
  isOpened: boolean
  username: string
}

const defaultEditForm: EditForm = {
  isOpened: false,
  username: '',
}

export const ProfileModal = (props: {
  user: UserAccount
  onClose: () => void;
}) => {
  const { user, onClose } = props

  const { onDisconnect, state: clientState, setState: setClientState } = useClientData()
  const { jwtTokens } = clientState

  const [editForm, setEditForm] = useState<EditForm>(defaultEditForm)
  const [editErrorMessage, setEditErrorMessage] = useState<string>('')

  const onUpdateClicked = async () => {
    try {
      setEditErrorMessage('')
      if(jwtTokens) {
        const newUser = await updateUser({ username: editForm.username }, { accessToken: jwtTokens.accessToken })
        setClientState({
          ...clientState,
          userAccount: newUser
        })
        console.log('User update result:', newUser)
        message.success('Username successfully updated')
        setEditForm((current) => ({...current, isOpened: false}))
      }
    } catch (e) {
      console.error('Failed to update user profile', e)

      let message = (e as Error).message || 'Failed to update user'
      if(axios.isAxiosError(e)) {
       if(e.response?.data.message) {
         message = e.response?.data.message
       }
      }
      setEditErrorMessage(message)
    }
  }

  return <Box>
    <Box gap={'2px'}>
      <Box direction={'row'} gap={'16px'}>
        <Text size={'16px'}>@{user.username}</Text>
        {!editForm.isOpened &&
            <Button size={'small'} onClick={() => setEditForm(current => ({...current, isOpened: true}))}>Edit</Button>
        }
      </Box>
      {editForm.isOpened &&
          <Box gap={'4px'}>
              <Box direction={'row'} gap={'8px'} margin={{ top: '16px' }}>
                  <Input
                      value={editForm.username}
                      placeholder={'New username'}
                      type={'text'}
                      onChange={(e) => setEditForm(current => ({...current, username: e.target.value || ''}))}
                  />
                  <Button
                      type={'primary'}
                      onClick={onUpdateClicked}
                  >
                      Update
                  </Button>
              </Box>
              {editErrorMessage &&
                <Text color={'errorMessage'}>{editErrorMessage}</Text>
              }
          </Box>
      }
    </Box>
    <Box margin={{ top: '16px' }}>
      <Box pad={'4px 8px'} border={{ color: 'white' }} round={'6px'}>
        <Typography.Text copyable={true} style={{ fontSize: '16px' }}>
          {user.address}
        </Typography.Text>
      </Box>
    </Box>
    <Box margin={{ top: '8px' }}>
      <Link to={'/profile/' + user.address} onClick={() => {
        onClose()
      }}>
        Open profile page
      </Link>
    </Box>
    <Box margin={{ top: '32px' }} gap={'16px'} direction={'row'}>
      <Button type={'primary'} size={'large'} onClick={() => {
        onDisconnect()
        onClose()
      }}>Disconnect wallet</Button>
      <Button size={'large'} onClick={onClose}>Close</Button>
    </Box>
  </Box>
}
