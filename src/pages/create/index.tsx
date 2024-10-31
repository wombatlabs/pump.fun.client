import { Box } from 'grommet'
import {Button} from "antd";
import {useNavigate} from "react-router-dom";

export const CreatePage = () => {
  const navigate = useNavigate();

  return <Box>
    <Box>
      <Button type={'text'} style={{ fontSize: '22px' }} onClick={() => navigate('/board')}>
        Go back
      </Button>
    </Box>
  </Box>
}
