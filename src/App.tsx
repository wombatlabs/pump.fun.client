import {Box, Grommet} from "grommet";
import {AppRoutes} from "./Routes.tsx";
import {darkTheme} from "./theme/grommet.ts";
import {antdTheme} from "./theme/antd.ts";
import {ConfigProvider} from "antd";
import {BrowserRouter} from "react-router-dom";
import {ClientDataProvider} from "./providers/DataProvider.tsx";

function App() {
  // const account = useAccount()
  // const { connectors, connect, status, error } = useConnect()
  // const { disconnect } = useDisconnect()

  return <Box>
    <Grommet theme={darkTheme} themeMode={'dark'} full>
      <ConfigProvider theme={antdTheme}>
        <BrowserRouter>
          <ClientDataProvider>
            <AppRoutes />
          </ClientDataProvider>
        </BrowserRouter>
      </ConfigProvider>
    </Grommet>
  </Box>

  // return (
  //   <>
  //     <div>
  //       <h2>Account</h2>
  //
  //       <div>
  //         status: {account.status}
  //         <br />
  //         addresses: {JSON.stringify(account.addresses)}
  //         <br />
  //         chainId: {account.chainId}
  //       </div>
  //
  //       {account.status === 'connected' && (
  //         <button type="button" onClick={() => disconnect()}>
  //           Disconnect
  //         </button>
  //       )}
  //     </div>
  //
  //     <div>
  //       <h2>Connect</h2>
  //       {connectors.map((connector) => (
  //         <button
  //           key={connector.uid}
  //           onClick={() => connect({ connector })}
  //           type="button"
  //         >
  //           {connector.name}
  //         </button>
  //       ))}
  //       <div>{status}</div>
  //       <div>{error?.message}</div>
  //     </div>
  //   </>
  // )
}

export default App
