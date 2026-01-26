import { useState, useEffect } from 'react';
import { useStore } from './store';
import { App as CapacitorApp } from '@capacitor/app';
import { Layout } from './components/Layout';
import { DailyCard } from './components/DailyCard';
import { CalendarView } from './components/CalendarView';
import { WeeklyReview } from './components/WeeklyReview';
import { UserProfile } from './components/UserProfile';
import { SettingsPage } from './components/SettingsPage';
import { ResourceHub } from './components/ResourceHub';
import { DailyHistory } from './components/DailyHistory';
import { WelcomeScreen } from './components/WelcomeScreen';

export default function App() {
  const { profile } = useStore();
  const [tab, setTab] = useState<'home' | 'calendar' | 'history' | 'review' | 'profile' | 'resources' | 'settings'>('home');
  const [showWelcome, setShowWelcome] = useState(true);

  // Handle Android Back Button
  useEffect(() => {
    const backHandler = CapacitorApp.addListener(
      'backButton',
      ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          CapacitorApp.exitApp(); // app close
        }
      }
    );

    return () => {
      backHandler.then(h => h.remove());
    };
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  // Show welcome screen on first launch
  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }



  // Show settings page as full screen (no layout)
  if (tab === 'settings') {
    return <SettingsPage onBack={() => setTab('profile')} />;
  }

  // If no profile exists, show profile page to set up
  if (!profile) {
    return (
      <Layout currentTab="profile" onTabChange={setTab}>
        <UserProfile onOpenSettings={() => setTab('settings')} />
      </Layout>
    );
  }

  // Show main app
  return (
    <Layout currentTab={tab} onTabChange={setTab}>
      {tab === 'home' && <DailyCard />}
      {tab === 'calendar' && <CalendarView />}
      {tab === 'history' && <DailyHistory />}
      {tab === 'review' && <WeeklyReview />}
      {tab === 'profile' && <UserProfile onOpenSettings={() => setTab('settings')} />}
      {tab === 'resources' && <ResourceHub />}
    </Layout>
  );
}
