import { http, createConfig } from 'wagmi'
import { harmonyOne } from 'wagmi/chains'
import { getDefaultConfig } from "connectkit";
import {appConfig} from "./config.ts";

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [harmonyOne],
    transports: {
      [harmonyOne.id]: http(),
    },
    walletConnectProjectId: appConfig.walletConnectProjectId,
    appName: "Pump.One",
    appDescription: "Pump.One",
    appUrl: "https://pump-app.netlify.app",
    appIcon: "https://cryptologos.cc/logos/harmony-one-logo.png?v=040", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
