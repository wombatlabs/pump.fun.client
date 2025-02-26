import {Box, Text} from "grommet";
import {useNavigate} from "react-router-dom";

export const RulesPage = () => {
  const navigate = useNavigate();

  const handleModeClick = (isCompetition: boolean) => {
    navigate(`/create?mode=${isCompetition ? 'competition' : 'standard'}`);
  };

  return <Box width={'800px'} gap={'40px'} margin={{ top: '32px', bottom: '32px' }}>
    {/* Header */}
    <Box align={'center'} margin={{ bottom: '24px' }}>
      <Text size={'22px'} color={'accentWhite'} weight={500}>Pump One Rules</Text>
    </Box>
    
    {/* Two Modes Introduction - Improved flow */}
    <Box>
      <Box align={'center'} margin={{ bottom: '16px' }}>
        <Text color={'accentWhite'} size={'20px'}>Two Ways to Launch</Text>
      </Box>
      <Box direction={'row'} gap={'medium'}>
        <Box 
          width={'50%'} 
          background={'rgba(255, 255, 255, 0.03)'} 
          pad={'medium'} 
          round={'small'} 
          onClick={() => handleModeClick(false)}
          hoverIndicator={{ background: 'rgba(255, 255, 255, 0.07)' }}
          focusIndicator={false}
          as="button"
          style={{ 
            cursor: 'pointer', 
            outline: 'none', 
            textAlign: 'left',
            border: 'none', 
            boxShadow: 'none'
          }}
        >
          <Text color={'accentWhite'} size={'18px'} weight={500} margin={{ bottom: 'small' }} textAlign="center">Standard</Text>
          <Box gap={'8px'}>
            <Text color={'accentWhite'}>Launch tokens without time limits.</Text>
            <Text color={'accentWhite'}>Mint and burn anytime.</Text>
          </Box>
        </Box>
        <Box 
          width={'50%'} 
          background={'rgba(255, 255, 255, 0.03)'} 
          pad={'medium'} 
          round={'small'}
          onClick={() => handleModeClick(true)}
          hoverIndicator={{ background: 'rgba(255, 255, 255, 0.07)' }}
          focusIndicator={false}
          as="button"
          style={{ 
            cursor: 'pointer', 
            outline: 'none', 
            textAlign: 'left',
            border: 'none',  
            boxShadow: 'none' 
          }}
        >
          <Text color={'accentWhite'} size={'18px'} weight={500} margin={{ bottom: 'small' }} textAlign="center">Competition</Text>
          <Box gap={'8px'}>
            <Text color={'accentWhite'}>Battle for highest liquidity.</Text>
            <Text color={'accentWhite'}>Only ONE token wins each round.</Text>
          </Box>
        </Box>
      </Box>
    </Box>
    
    {/* Mode Comparison */}
    <Box>
      <Box align={'center'} margin={{ bottom: '16px' }}>
        <Text color={'accentWhite'} size={'20px'}>Comparison</Text>
      </Box>
      <Box direction={'row'} gap={'medium'}>
        <Box width={'50%'} background={'rgba(255, 255, 255, 0.03)'} pad={'medium'} round={'small'}>
          <Text color={'accentWhite'} weight={500} margin={{ bottom: 'small' }}>Standard Mode:</Text>
          <Text color={'accentWhite'}>• Launch tokens without time restrictions</Text>
          <Text color={'accentWhite'}>• Mint and burn anytime</Text>
          <Text color={'accentWhite'}>• No competition with other tokens</Text>
          <Text color={'accentWhite'}>• Tokens that reach 420k ONE liquidity get listed on swap.country</Text>
        </Box>
        <Box width={'50%'} background={'rgba(255, 255, 255, 0.03)'} pad={'medium'} round={'small'}>
          <Text color={'accentWhite'} weight={500} margin={{ bottom: 'small' }}>Competition Mode:</Text>
          <Text color={'accentWhite'}>• Competitive token launchpad</Text>
          <Text color={'accentWhite'}>• Only ONE token wins each round</Text>
          <Text color={'accentWhite'}>• Winner gets all competition liquidity</Text>
          <Text color={'accentWhite'}>• Non-winners can convert to winner token</Text>
          <Text color={'accentWhite'}>• Swap.country listing for winner, if at least one token reaches 420k ONE liquidity</Text>
        </Box>
      </Box>
    </Box>
    
    {/* Token Basics */}
    <Box>
      <Box align={'center'} margin={{ bottom: '16px' }}>
        <Text color={'accentWhite'} size={'20px'}>Token Basics</Text>
      </Box>
      <Box gap={'8px'} background={'rgba(255, 255, 255, 0.03)'} pad={'medium'} round={'small'}>
        <Text color={'accentWhite'}>1. Anyone can launch a token on pump.one.</Text>
        <Text color={'accentWhite'}>2. After launch, anyone can mint more tokens by paying ONE.</Text>
        <Text color={'accentWhite'}>3. Token price increases with supply - more tokens minted means higher mint costs.</Text>
        <Text color={'accentWhite'}>4. Anyone can burn their tokens anytime to receive ONE back. Higher token supply means better burn rates.</Text>
        <Text color={'accentWhite'}>5. Competition tokens can't be burned or minted after the round ends, but may be tradable on swap.country or exchangeable for winner tokens.</Text>
      </Box>
    </Box>
    
    {/* Competition Details */}
    <Box>
      <Box align={'center'} margin={{ bottom: '16px' }}>
        <Text color={'accentWhite'} size={'20px'}>Competition Details</Text>
      </Box>
      <Box gap={'8px'} background={'rgba(255, 255, 255, 0.03)'} pad={'medium'} round={'small'}>
        <Text color={'accentWhite'} weight={500} margin={{ bottom: 'small' }}>Only ONE token wins each competition round!</Text>
        <Text color={'accentWhite'}>1. Tokens compete for highest net liquidity (total ONE paid for minting minus ONE returned from burns).</Text>
        <Text color={'accentWhite'}>2. Rounds last 7 days, ending at random time around midnight US Pacific Time if at least one token reaches 420,000 ONE in net liquidity. Otherwise, round extends 7 more days.</Text>
        <Text color={'accentWhite'}>3. When a round ends, the winner is announced on Pump One and its social platforms. All competition tokens can no longer be minted or burned on Pump One.</Text>
        <Text color={'accentWhite'}>4. A liquidity pool automatically launches on swap.country for the winner. All net liquidity (winner's + other competing tokens) moves to this pool.</Text>
        <Text color={'accentWhite'}>5. Non-winning tokens can be exchanged for the winner token at rates based on current supply ratios.</Text>
      </Box>
    </Box>
    
    {/* Fees Section */}
    <Box>
      <Box align={'center'} margin={{ bottom: '16px' }}>
        <Text color={'accentWhite'} size={'20px'}>Fees and Parameters</Text>
      </Box>
      <Box gap={'8px'} background={'rgba(255, 255, 255, 0.03)'} pad={'medium'} round={'small'}>
        <Text color={'accentWhite'}>1. No platform fee, but a 0.5% deduction from ONE transactions goes to the prize and market making pool. Pump One doesn't earn income from this pool.</Text>
        <Text color={'accentWhite'}>2. Token pricing formula: Unit Price = 2 * (Token Current Supply ^ 0.5). May be adjusted to improve user experience.</Text>
        <Text color={'accentWhite'}>3. Competition parameters (round length, minimum liquidity) may change with advance notice on website and social platforms.</Text>
      </Box>
    </Box>
    
    {/* Security Section */}
    <Box>
      <Box align={'center'} margin={{ bottom: '16px' }}>
        <Text color={'accentWhite'} size={'20px'}>Security and Moderation</Text>
      </Box>
      <Box gap={'8px'} background={'rgba(255, 255, 255, 0.03)'} pad={'medium'} round={'small'}>
        <Text color={'accentWhite'}>1. Pump One operators cannot access your funds or tokens. They can only access the prize/market making pool as described above.</Text>
        <Text color={'accentWhite'}>2. Platform operators may remove tokens displaying inappropriate content (obscene, illegal, violent). Removed tokens still exist on blockchain but won't be accessible through Pump One.</Text>
      </Box>
    </Box>
  </Box>
}
