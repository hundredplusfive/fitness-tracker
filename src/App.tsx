import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout/Layout';
import { Home } from './components/Home/Home';
import { WorkoutList } from './components/Workouts/WorkoutList';
import { ExerciseList } from './components/Exercises/ExerciseList';
import { TemplatesList } from './components/Templates/TemplatesList';

type View = 'home' | 'workouts' | 'exercises' | 'templates';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');

  return (
    <AppProvider>
      <Layout>
        <nav className="nav nav-tabs border-bottom mb-3 bg-white">
          <li className="nav-item">
            <button
              className={`nav-link ${currentView === 'home' ? 'active fw-semibold' : 'text-muted'}`}
              onClick={() => setCurrentView('home')}
            >
              Home
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${currentView === 'workouts' ? 'active fw-semibold' : 'text-muted'}`}
              onClick={() => setCurrentView('workouts')}
            >
              Workouts
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${currentView === 'templates' ? 'active fw-semibold' : 'text-muted'}`}
              onClick={() => setCurrentView('templates')}
            >
              Templates
            </button>
          </li>
        </nav>

        <div>
          {currentView === 'home' && (
            <Home
              onViewAllWorkouts={() => setCurrentView('workouts')}
            />
          )}
          {currentView === 'workouts' && <WorkoutList />}
          {currentView === 'exercises' && <ExerciseList />}
          {currentView === 'templates' && <TemplatesList />}
        </div>
      </Layout>
    </AppProvider>
  );
}
