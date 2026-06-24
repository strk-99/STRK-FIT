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

export default function App() {
  const { profile, logs } = useStore();
  const [tab, setTab] = useState<'home' | 'notes' | 'history' | 'review' | 'profile' | 'resources' | 'settings'>('home');
  const [showWelcome, setShowWelcome] = useState(true);

  // Initialize notification channel and listeners once on mount
  useEffect(() => {
    initializeNotificationChannel();
    setupNotificationListeners();
  }, []);

  // Schedule (or re-schedule) daily reminder whenever settings change.
  // Also re-syncs localStorage (wiped on reinstall) from the persisted profile.
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



  // Show settings page within layout
  // (No longer full screen - integrated with sidebar navigation)

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
      {tab === 'home'      && <TodayPage />}
      {tab === 'notes'     && <NotesPage />}
      {tab === 'history'   && <DailyHistory />}
      {tab === 'review'    && <WeeklyReview />}
      {tab === 'profile'   && <UserProfile onOpenSettings={() => setTab('settings')} />}
      {tab === 'resources' && <ResourceHub />}
      {tab === 'settings'  && <SettingsPage onBack={() => setTab('profile')} />}
    </Layout>
  );
}
