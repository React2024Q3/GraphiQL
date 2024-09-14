import { Box, Tab, Tabs } from '@mui/material';
import { useTranslations } from 'next-intl';

interface RestTabsProps {
  tabIndex: number;
  setTabIndex: (tabIndex: number) => void;
}

export default function RestTabs({ tabIndex, setTabIndex }: RestTabsProps) {
  const t = useTranslations();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label='basic tabs example'>
        <Tab label={t('client.headers')} />
        <Tab label={t('client.variables')} />
      </Tabs>
    </Box>
  );
}
