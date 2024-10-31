import {Box, Text} from "grommet";
import {UserComment} from "../../types.ts";
import {useEffect, useState} from "react";
import {addComment, getTokenComments} from "../../api";
import {Button, Input, Modal, Tag} from "antd";
import moment from "moment";
import {useClientData} from "../../providers/DataProvider.tsx";

const TokenCommentItem = (props: {
  data: UserComment
  onReplyClicked: () => void
}) => {
  const { data: {
    id,
    text,
    user,
    createdAt
  }, onReplyClicked } = props

  return <Box background={'badgeBackground'} pad={'8px'} round={'6px'} margin={{ top: '4px' }}>
    <Box direction={'row'} gap={'6px'} align={'center'}>
      <Tag color={'cyan'}>{user.username}</Tag>
      <Text>{moment(createdAt).format('HH:MM:ss')}</Text>
      <Button type={'text'} size={'small'} onClick={onReplyClicked}>
        #{id} [reply]
      </Button>
    </Box>
    <Box margin={{ top: '4px' }}>
      <Text>{text}</Text>
    </Box>
  </Box>
}

export const TokenComments = (props: { tokenAddress: string }) => {
  const {tokenAddress} = props
  const { state: { userAccount } } = useClientData()

  const [isInitialLoading, setInitialLoading] = useState(true);
  const [comments, setComments] = useState<UserComment[]>([]);

  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyMessage, setReplyMessage] = useState<string>('')

  const loadComments = async () => {
    try {
      const items = await getTokenComments({ tokenAddress: props.tokenAddress })
      setComments(items)
    } catch (e) {
      console.log('Failed to load comments', e)
    }
  }

  useEffect(() => {
    setInitialLoading(true)
    loadComments().finally(() => setInitialLoading(false))
  }, []);

  const onPostReplyClicked = async () => {
    try {
      const id = await addComment({
        tokenAddress,
        userAddress: userAccount?.address || '',
        text: replyMessage
      })
      console.log('Reply id: ', id)
      setReplyMessage('')
      setShowReplyModal(false)
      loadComments()
    } catch (e) {
      console.error('Failed to post reply', e)
    }
  }

  return <Box>
    {!isInitialLoading && comments.length === 0 &&
      <Box>
          <Text size={'18px'}>No comments yet. Be the first to share your thoughts!</Text>
      </Box>
    }
    {comments.map((comment) => <TokenCommentItem
      key={comment.id}
      data={comment}
      onReplyClicked={() => {
        setReplyMessage(`#${comment.id}`)
        setShowReplyModal(true)
      }}
    />)}
    <Box width={'200px'} margin={{ top: '32px' }}>
      <Button type={'primary'} onClick={() => setShowReplyModal(true)}>
        Post a reply
      </Button>
    </Box>
    <Modal
      title="Add a comment"
      open={showReplyModal}
      footer={null}
      onOk={() => setShowReplyModal(false)}
      onCancel={() => {
        setReplyMessage('')
        setShowReplyModal(false)
      }}
      styles={{
        mask: {
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      <Box gap={'16px'}>
        <Input.TextArea
          placeholder={'comment'}
          rows={4}
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
          style={{ fontSize: '18px' }}
        />
        <Box gap={'16px'}>
          <Button type={'primary'} size={'large'} onClick={onPostReplyClicked}>
            Post reply
          </Button>
          <Button type={'default'} onClick={() => setShowReplyModal(false)}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  </Box>
}
