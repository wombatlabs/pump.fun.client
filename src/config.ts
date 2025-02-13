export const appConfig = {
  walletConnectProjectId: 'd9582a28e2633cc50849bab7aa9ad668',
  apiUrl: 'http://localhost:8085',
  tokenFactorySimple: '0x6D362d144cC8aD63c732E82a849087426EDEEB6f',
  tokenFactoryCompetition: '0x1166665bc13B412Bf49b73bF92acA89A1e1DA448'
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
