import {Box, Text, BoxExtendedProps} from "grommet";
import {UserComment} from "../../types.ts";
import {useEffect, useMemo, useState} from "react";
import {addComment, getTokenComments} from "../../api";
import {Button, Input, message, Modal} from "antd";
import moment from "moment";
import {useClientData} from "../../providers/DataProvider.tsx";
import {UserTag} from "../../components/UserTag.tsx";

interface TokenCommentItemProps extends BoxExtendedProps {
  data: UserComment
  highlightCommentId: number
  onReplyClicked: () => void
  setHighlightCommentId: (id: number) => void
}

const TokenCommentItem = (props: TokenCommentItemProps) => {
  const {
    data: {
      id,
      text,
      user,
      createdAt
    },
    highlightCommentId,
    onReplyClicked,
    setHighlightCommentId
  } = props

  const {
    replyToCommentId,
    message
  } = useMemo(() => {
    let replyToCommentId = 0
    let message = text
    const regex = /#(\d+)/;
    if(text.startsWith(`#`)) {
      const [firstPart, ...restPart] = text.split(' ')
      if(firstPart.match(regex)) {
        replyToCommentId = Number(firstPart.replace('#', ''))
        message = restPart.join(' ')
      }
    }
    return {
      replyToCommentId,
      message
    }
  }, [text])

  const isHighlighted = highlightCommentId === id

  return <Box
    background={'badgeBackground'}
    border={{ color: isHighlighted ? 'positiveValue' : 'transparent' }}
    pad={'8px'}
    round={'6px'}
    margin={{ top: '4px' }}
    {...props}
  >
    <Box direction={'row'} gap={'6px'} align={'center'}>
      <UserTag user={user} />
      <Text>{moment(createdAt).format('HH:MM:ss')}</Text>
      <Button type={'text'} size={'small'} onClick={onReplyClicked}>
        #{id} [reply]
      </Button>
    </Box>
    <Box margin={{ top: '4px' }}>
      {replyToCommentId
        ? <Box direction={'row'}>
          <Text
            weight={500}
            color={'positiveValue'}
            onMouseEnter={() => setHighlightCommentId(replyToCommentId)}
          >
            #{replyToCommentId}
          </Text>
          &nbsp;<Text>{message}</Text>
        </Box>
        : <Text>{message}</Text>
      }
    </Box>
  </Box>
}

export const TokenComments = (props: { tokenAddress: string }) => {
  const {tokenAddress} = props
  const { state: { jwtTokens } } = useClientData()

  const [isInitialLoading, setInitialLoading] = useState(true);
  const [comments, setComments] = useState<UserComment[]>([]);

  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyMessage, setReplyMessage] = useState<string>('')
  const [highlightCommentId, setHighlightCommentId] = useState(0)

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
      if(!jwtTokens) {
        return
      }
      const id = await addComment({
        tokenAddress,
        text: replyMessage,
        accessToken: jwtTokens.accessToken
      })
      console.log('Reply id: ', id)
      setReplyMessage('')
      setShowReplyModal(false)
      loadComments()
      message.success(`Reply sent`);
    } catch (e) {
      console.error('Failed to post reply', e)
      message.error(`Failed to post reply`);
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
        setReplyMessage(`#${comment.id} `)
        setShowReplyModal(true)
      }}
      highlightCommentId={highlightCommentId}
      setHighlightCommentId={setHighlightCommentId}
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
