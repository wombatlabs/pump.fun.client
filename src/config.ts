export const appConfig = {
  walletConnectProjectId: 'd9582a28e2633cc50849bab7aa9ad668',
  apiUrl: 'http://localhost:8085',
  tokenFactorySimple: '0x6A0DB6b426c37874ee62F17f58B5804390565292',
  tokenFactoryCompetition: '0xf1a36221703D08d27Cb52A375Fa660Ecf1f4482f'
}

export const getTokenFactoryAddress = (
  isCompetitionsEnabled: boolean
) => {
  if(isCompetitionsEnabled) {
    return appConfig.tokenFactoryCompetition as `0x${string}`
  }
  return appConfig.tokenFactorySimple as `0x${string}`
}

// apiUrl:
// http://localhost:8085
// https://pump-fun-backend.fly.dev
// https://pump-fun-backend-staging.fly.dev
