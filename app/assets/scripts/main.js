'use strict';
import '@babel/polyfill';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import theme from './styles/theme/theme';

import { appPathname } from './config';
import store from './store';
import history from './utils/history';

import GlobalStyles from './styles/global';

import Home from './components/home';
import Explore from './components/explore';
import Trends from './components/trends';
import Auth from './components/auth';
import UsersIndex from './components/users';
import UsersView from './components/users/view';
import UhOh from './components/uhoh';
import ConfirmationPrompt from './components/common/confirmation-prompt';
import ProfileListener from './components/common/profile-listener';

import ErrorBoundary from './fatal-error-boundary';
import { ToastContainerCustom } from './components/common/toasts';

// Root component. Used by the router.
const Root = () => (
  <Provider store={store}>
    <Router basename={appPathname} history={history}>
      <ThemeProvider theme={theme.main}>
        <ErrorBoundary>
          <GlobalStyles />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/trends' component={Trends} />
            <Route path='/trends/:campaignSlug' component={Trends} />
            <Route
              path={['/explore/:campaignSlug', '/explore/:campaignSlug/*]']}
              component={Explore}
            />
            <Route exact path='/login/redirect' component={Auth} />
            <Route exact path='/login' component={Auth} />
            <Route exact path='/logout' component={Auth} />
            <Route exact path='/users' component={UsersIndex} />
            <Route exact path='/users/:id' component={UsersView} />
            <Route path='*' component={UhOh} />
          </Switch>
          <ConfirmationPrompt />
          <ToastContainerCustom />
          <ProfileListener />
        </ErrorBoundary>
      </ThemeProvider>
    </Router>
  </Provider>
);

render(<Root store={store} />, document.querySelector('#app-container'));
