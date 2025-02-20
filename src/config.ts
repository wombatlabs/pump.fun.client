export const appConfig = {
  walletConnectProjectId: 'd9582a28e2633cc50849bab7aa9ad668',
  apiUrl: 'http://localhost:8085',
  tokenFactorySimple: '0x3C2fdEb2a8c62F41CCC626067D308c0603fd8F34',
  tokenFactoryCompetition: '0x50331189a406cd0763EdcCa0c599f5328daFeB04',
  competitionDuration: 1 * 24 * 60 * 60 * 1000,
  competitionCollateralThreshold: 420000
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
