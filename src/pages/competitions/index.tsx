import {Box, Text} from "grommet";
import {Competition} from "../../types.ts";
import {useEffect, useState} from "react";
import {getCompetitions} from "../../api";
import {CompetitionItem} from "./CompetitionItem.tsx";

export const CompetitionsPage = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const items = await getCompetitions({ limit: 10 })
        setCompetitions(items)
      } catch (e) {
        console.error('Failed to load competitions', e);
      }
    }
    loadData()
  }, []);

  return <Box>
    <Box align={'center'}>
      <Text size={'22px'} color={'accentWhite'} weight={500}>Competitions</Text>
    </Box>
    <Box gap={'32px'} margin={{ top: '16px' }}>
      {competitions.map(item => {
        return <CompetitionItem key={item.competitionId} competition={item} />
      })}
    </Box>
  </Box>
}
