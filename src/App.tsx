import { useState, useEffect } from 'react';
import { useStore } from './store';
import { App as CapacitorApp } from '@capacitor/app';
import {
  initializeNotificationChannel,
  initializeNotifications,
  setupNotificationListeners,
  getNotificationSettings,
  saveNotificationSettings,
} from './lib/notifications';
import { Layout } from './components/Layout';
import { TodayPage } from './components/TodayPage';
import { NotesPage } from './components/NotesPage';
import { WeeklyReview } from './components/WeeklyReview';
import { UserProfile } from './components/UserProfile';
import { SettingsPage } from './components/SettingsPage';
import { ResourceHub } from './components/ResourceHub';
import { DailyHistory } from './components/DailyHistory';
import { WelcomeScreen } from './components/WelcomeScreen';

type TabType = 'home' | 'notes' | 'history' | 'review' | 'profile' | 'resources' | 'settings';

export default function App() {
  const { profile, logs } = useStore();
  const [tab, setTab] = useState<TabType>('home');
  const [showWelcome, setShowWelcome] = useState(true);

  // Initialize notification channel and listeners once on mount
  useEffect(() => {
    initializeNotificationChannel();
    setupNotificationListeners();
  }, []);

  // Schedule (or re-schedule) daily reminder whenever settings change.
  useEffect(() => {
    if (!profile?.reminderEnabled) return;
    const current = getNotificationSettings();
    if (!current.enabled) {
      saveNotificationSettings({
        ...current,
        enabled: true,
        dailyReminder: true,
        reminderTime: profile.reminderTime || '20:00',
      });
    }
    initializeNotifications(Object.values(logs), 0);
  }, [profile?.reminderEnabled, profile?.reminderTime, logs]);

  // Sync tab changes with browser history so back button steps through tabs
  useEffect(() => {
    history.replaceState({ tab: 'home' }, '');

    const onPopState = (e: PopStateEvent) => {
      setTab((e.state?.tab as TabType) ?? 'home');
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Handle Android Back Button (Capacitor native)
  useEffect(() => {
    const backHandler = CapacitorApp.addListener('backButton', () => {
      if (!window.history.state?.tab || window.history.state.tab === 'home') {
        CapacitorApp.exitApp();
      } else {
        window.history.back();
      }
    });
    return () => { backHandler.then(h => h.remove()); };
  }, []);

  const handleTabChange = (newTab: TabType) => {
    if (newTab !== tab) {
      history.pushState({ tab: newTab }, '');
    }
    setTab(newTab);
  };

  if (showWelcome) {
    return <WelcomeScreen onComplete={() => setShowWelcome(false)} />;
  }

  if (!profile) {
    return (
      <Layout currentTab="profile" onTabChange={handleTabChange}>
        <UserProfile onOpenSettings={() => handleTabChange('settings')} />
      </Layout>
    );
  }

  return (
    <Layout currentTab={tab} onTabChange={handleTabChange}>
      {tab === 'home'      && <TodayPage />}
      {tab === 'notes'     && <NotesPage />}
      {tab === 'history'   && <DailyHistory />}
      {tab === 'review'    && <WeeklyReview />}
      {tab === 'profile'   && <UserProfile onOpenSettings={() => handleTabChange('settings')} />}
      {tab === 'resources' && <ResourceHub />}
      {tab === 'settings'  && <SettingsPage onBack={() => handleTabChange('profile')} />}
    </Layout>
  );
}
