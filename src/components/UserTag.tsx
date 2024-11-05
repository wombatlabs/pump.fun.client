import { Tag } from 'antd'
import {useMemo} from "react";
import { blue, cyan, gold, green, volcanoDark, geekblue, purple, magenta, gray, red } from '@ant-design/colors';

const palette = [
  red[red.length / 2],
  gray[gray.length / 2],
  magenta[magenta.length / 2],
  purple[purple.length / 2],
  geekblue[geekblue.length / 2],
  volcanoDark[volcanoDark.length / 2],
  green[green.length / 2],
  gold[gold.length / 2],
  cyan[cyan.length / 2],
  blue[blue.length / 2],
]

export const UserTag = (props: {
  username?: string
  fontSize?: string
}) => {
  const { fontSize, username = '' } = props

  const color = useMemo(() => {
    const sum = username.split('').reduce((sum, item) => {
      return sum += item.charCodeAt(0)
    }, 0)
    return palette[sum % 10]
  }, [username])

  return <Tag color={color} style={{ fontSize: fontSize }}>
    {username}
  </Tag>
}
