import {Box, Grommet, Text} from "grommet";
import {AppRoutes} from "./Routes.tsx";
import {darkTheme} from "./theme/grommet.ts";
import {antdTheme} from "./theme/antd.ts";
import {ConfigProvider, notification} from "antd";
import {BrowserRouter} from "react-router-dom";
import {ClientDataProvider} from "./providers/DataProvider.tsx";
import {useEffect} from "react";

function App() {
  // const account = useAccount()
  // const { connectors, connect, status, error } = useConnect()
  // const { disconnect } = useDisconnect()

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const showNotification = () => {
      api.open({
        message: <Text size={'20px'} weight={500}>Disclaimer</Text>,
        placement: 'top',
        style: {
          width: '700px',
          border: '1px solid gray',
          borderRadius: '5px'
        },
        description: <Box gap={'8px'}>
          <Text>Welcome to Pump.One! Please note that this platform is distinct from pump.fun and operates under its own unique set of rules. By participating, you agree to abide by these rules.</Text>
          <Text>For detailed information, please visit: <a href={'/rules'}>pump.one/rules</a>.</Text>
          <Text>
            Additionally, pump.one is currently in a pre-alpha stage. Use at your own risk until an official announcement is made by the main Harmony X account <a href={'https://twitter.com/harmonyprotocol'} target={'_blank'}>@harmonyprotocol</a>.
          </Text>
          <Text>
            If you encounter any issues, please report them at our GitHub page: <a href={'https://github.com/harmony-one/pump.fun.client/issues'} target={'_blank'}>Report Issues</a>.
          </Text>
        </Box>
    ,
    duration: 0,
      });
    }
    showNotification()
  }, []);

  return <Box>
    <Grommet theme={darkTheme} themeMode={'dark'} full>
      <ConfigProvider theme={antdTheme}>
        {contextHolder}
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
