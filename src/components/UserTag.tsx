import { Tag } from 'antd'
import { Text } from 'grommet'
import {useMemo} from "react";
import { blue, cyan, green, volcanoDark, geekblue, purple, magenta, gray, red, greenDark } from '@ant-design/colors';
import {UserAccount} from "../types.ts";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";

const palette = [
  red[red.length / 2],
  gray[gray.length / 2],
  magenta[magenta.length / 2],
  purple[purple.length / 2],
  geekblue[geekblue.length / 2],
  volcanoDark[volcanoDark.length / 2],
  green[green.length / 2],
  greenDark[greenDark.length / 2],
  cyan[cyan.length / 2],
  blue[blue.length / 2],
]

const TextWrapper = styled(Text)`
  &:hover {
      text-decoration: underline;
  }
`

export const UserTag = (props: {
  user?: UserAccount | null
  fontSize?: string
  linkEnabled?: boolean
}) => {
  const { fontSize, user, linkEnabled = true } = props

  const navigate = useNavigate()

  const username = user?.username || ''

  const color = useMemo(() => {
    const sum = username.split('').reduce((sum, item) => {
      return sum + item.charCodeAt(0)
    }, 0)
    return palette[sum % 10]
  }, [username])

  return <Tag
    color={color}
    style={{ cursor: 'pointer' }}
    onClick={() => {
      if(linkEnabled) {
        navigate(`/profile/${user?.address}`)
      }
    }}
  >
    <TextWrapper size={fontSize}>{username}</TextWrapper>
  </Tag>
}
