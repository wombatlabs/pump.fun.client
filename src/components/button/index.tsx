import {Box, Button, Spinner, Text} from "grommet";
import styled from "styled-components";

const GradientButtonWrap = styled(Button)`
    padding: 1px;
    background: linear-gradient(to right, #DB70D6, #9470DB, #7079DB, #70A6DB);
    border-radius: 4px;
    transition: background 150ms;

    &:hover {
        background: linear-gradient(to right, #DB70D6, #9470DB, #7079DB);
    }
`

const GradientButtonContainer = styled(Box)`
    border-radius: 4px;
    background: #292A32;
    padding: 8px;
    transition: background 150ms, color 150ms;
    
    &:hover {
        color: white;
        background: linear-gradient(to right, #DB70D6, #9470DB, #7079DB);

        > span {
            background: #E4E4E8;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
`

export const GradientButtonText = styled(Text)`
    background: linear-gradient(90.61deg, #DB70D6 11.08%, #9470DB 36.68%, #7079DB 62.68%, #70A6DB 88.67%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 500;
    padding: 0 8px;
`
export type PrimaryButtonStatus = 'default' | 'success' | 'error'

export interface PrimaryButtonProps {
  viewType?: 'default' | 'secondary'
  status?: PrimaryButtonStatus
  disabled?: boolean
  loading?: boolean
  text?: string
  size?: string
  onClick?: () => void
  style?: any
}

export const GradientButton = (props: PrimaryButtonProps) => {
  const {
    disabled,
    loading = false,
    text = '',
    size = '14px',
    onClick,
    ...rest
  } = props

  return <GradientButtonWrap
    disabled={disabled}
    onClick={onClick}
    {...rest}
  >
    <GradientButtonContainer>
      {loading
        ?
        <Box width={'100%'} direction={'row'} justify={'center'} align={'center'} gap={'16px'}>
          <Spinner size={'xsmall'} color={'white'} />
          <Text size={size}>{text}</Text>
        </Box>
        :
        <GradientButtonText size={size}>{text}</GradientButtonText>
      }
    </GradientButtonContainer>
  </GradientButtonWrap>
}
