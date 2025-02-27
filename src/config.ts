export const appConfig = {
  walletConnectProjectId: 'd9582a28e2633cc50849bab7aa9ad668',
  apiUrl: 'https://pump-fun-backend.fly.dev',
  tokenFactoryCompetition: '0xc115aDA811C5c81f1EafcBe5526d5Fcb73B6b40D',
  tokenFactoryBase: '0x7400bE22b1F3fF409E58738E4cF32290f60b7504',
  competitionDuration: 7 * 24 * 60 * 60 * 1000,
  competitionCollateralThreshold: 420000
}

export const getTokenFactoryAddress = (
  isCompetitionsEnabled: boolean
) => {
  if(isCompetitionsEnabled) {
    return appConfig.tokenFactoryCompetition as `0x${string}`
  }
  return appConfig.tokenFactoryBase as `0x${string}`
}

// apiUrl:
// Production: https://pump-fun-backend.fly.dev
// Local: http://localhost:8085
// Staging: https://pump-fun-backend-staging.fly.dev
