/* eslint-disable */
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

/**
 * @description Configuración maestra de rutas de FlockApp.
 * Implementa carga perezosa (Lazy Loading) para optimizar el rendimiento.
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./auth/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () =>
      import('./auth/forgot-password/forgot-password.page').then((m) => m.ForgotPasswordPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/main-layout/main-layout.page').then((m) => m.MainLayoutPage),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: 'profile/:id',
        loadComponent: () =>
          import('./pages/profile/public-profile/public-profile.page').then(
            (m) => m.PublicProfilePage,
          ),
      },
      /**
       * @path /home/birds
       * @description NUEVA RUTA: Punto de entrada al buscador general de aves.
       */
      {
        path: 'birds',
        loadComponent: () =>
          import('./pages/birds/bird-search/bird-search.page').then((m) => m.BirdSearchPage),
      },
      {
        path: 'sightings-map',
        loadComponent: () =>
          import('./pages/birds/sightings-map/sightings-map.page').then((m) => m.SightingsMapPage),
      },
      {
        path: 'guides',
        loadComponent: () =>
          import('./pages/guides/guide-list/guide-list.page').then((m) => m.GuideListPage),
      },
      {
        path: 'guides/:id',
        loadComponent: () =>
          import('./pages/guides/guide-detail/guide-detail.page').then((m) => m.GuideDetailPage),
      },
      {
        path: 'sites',
        loadComponent: () =>
          import('./pages/sites/site-list/site-list.page').then((m) => m.SiteListPage),
      },
      {
        path: 'sites/:id',
        loadComponent: () =>
          import('./pages/sites/site-detail/site-detail.page').then((m) => m.SiteDetailPage),
      },
      {
        path: 'routes-landing',
        loadComponent: () =>
          import('./pages/routes/routes-landing/routes-landing.page').then(
            (m) => m.RoutesLandingPage,
          ),
      },
      {
        path: 'route-workspace',
        loadComponent: () =>
          import('./pages/routes/route-workspace/route-workspace.page').then(
            (m) => m.RouteWorkspacePage,
          ),
      },
      {
        path: 'business-profile',
        loadComponent: () =>
          import('./pages/business-profile/business-profile.page').then((m) => m.BusinessProfilePage),
      },
      {
        path: 'provider-site',
        loadComponent: () =>
          import('./pages/provider-site/provider-site.page').then((m) => m.ProviderSitePage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.page').then((m) => m.SettingsPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
