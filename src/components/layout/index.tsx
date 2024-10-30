import {Box} from "grommet";
import {Outlet} from "react-router-dom";
import {Header} from "./Header";

export const AppLayout = () => {
  return <Box>
    <Box width={'100%'}>
      <Header />
      <Box align={'center'}>
        <Outlet />
      </Box>
    </Box>
  </Box>
}
