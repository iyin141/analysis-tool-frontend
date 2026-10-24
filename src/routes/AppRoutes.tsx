import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import DecisionViewPage from '../features/decision-view/DecisionViewPage';
import AccuracyDashboardPage from '../features/accuracy/AccuracyDashboardPage';
import HorizonExplorerPage from '../features/horizon/HorizonExplorerPage';
import MethodologyPage from '../features/methodology/MethodologyPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DecisionViewPage />,
  },
  {
    path: '/decision-view',
    element: <DecisionViewPage />,
  },
  {
    path: '/accuracy',
    element: <AccuracyDashboardPage />,
  },
  {
    path: '/horizon',
    element: <HorizonExplorerPage />,
  },
  {
    path: '/methodology',
    element: <MethodologyPage />,
  },
]);
