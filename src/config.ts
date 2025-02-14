export const appConfig = {
  walletConnectProjectId: 'd9582a28e2633cc50849bab7aa9ad668',
  apiUrl: 'http://localhost:8085',
  tokenFactorySimple: '0xCBe0Ca4739282793D65c486c29a929624a0bcA5D',
  tokenFactoryCompetition: '0xd5e9b7ec8f2e4feB6fab99209fa352ad6DE5D625',
  competitionDuration: 1 * 24 * 60 * 60 * 1000
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
