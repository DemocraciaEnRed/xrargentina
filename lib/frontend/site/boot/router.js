import config from 'lib/config'
import urlBuilder from 'lib/backend/url-builder'
import user from 'lib/frontend/site/user/user'

import Layout from 'lib/frontend/site/layout/component'
import TopicLayout from 'lib/frontend/site/topic-layout/component'
import HomeForum from 'lib/frontend/site/home-forum/component'
import HomeMultiForum from 'lib/frontend/site/home-multiforum/component'
import SignIn from 'lib/frontend/site/sign-in/component'
import SignUp from 'lib/frontend/site/sign-up/component'
import Resend from 'lib/frontend/site/resend/component'
import Forgot from 'lib/frontend/site/forgot/component'
import Reset from 'lib/frontend/site/reset/component'
import Help from 'lib/frontend/site/help/component'
import Notifications from 'lib/frontend/site/notifications/component'
import NotFound from 'lib/frontend/site/error-pages/not-found/component'
import NotAllowed from 'lib/frontend/site/error-pages/not-allowed/component'

/*
  Base routes for the app

  These does not use JSX to allow to change them, before rendering, e.g. from the /ext folder.

  More info: https://github.com/ReactTraining/react-router/blob/v2.8.1/docs/guides/RouteConfiguration.md
*/

export default {
  path: '/',
  component: Layout,
  indexRoute: { component: config.multiForum ? HomeMultiForum : HomeForum, onEnter: restrictAnon },
  childRoutes: [
    { path: '404', component: NotFound },
    { path: '401', component: NotAllowed },
    {
      path: 'signin',
      component: SignIn,
      onEnter: restrictLoggedin
    },
    {
      path: 'signup',
      onEnter: restrictLoggedin,
      indexRoute: { component: SignUp },
      childRoutes: [
        { path: 'resend-validation-email', component: Resend },
        { path: 'validate/:token', component: Resend },
        { path: ':reference', component: SignUp }
      ]
    },
    {
      path: 'forgot',
      onEnter: restrictLoggedin,
      indexRoute: { component: Forgot },
      childRoutes: [
        { path: 'reset/:token', component: Reset }
      ]
    },
    { path: urlBuilder.for('site.help'), onEnter: restrictAnon, component: Help },
    { path: urlBuilder.for('site.help.article'), onEnter: restrictAnon, component: Help },
    { path: urlBuilder.for('site.notifications'), onEnter: restrictAnon, component: Notifications },
    { path: urlBuilder.for('settings'), onEnter: restrictAnon, component: reload },
    { path: urlBuilder.for('settings') + '/*', conEnter: restrictAnon, omponent: reload },
    { path: urlBuilder.for('site.topic'), onEnter: restrictAnon, component: TopicLayout },
    { path: urlBuilder.for('forums.new'), onEnter: restrictAnon, component: reload },
    { path: urlBuilder.for('admin'), onEnter: restrictAnon, component: reload },
    { path: urlBuilder.for('admin.wild'), onEnter: restrictAnon, component: reload },
    config.multiForum ? {
      path: urlBuilder.for('site.forum'),
      onEnter: restrictAnon,
      component: HomeForum,
      onEnter: setForumParam
    } : {},
    { path: '*', component: NotFound }
  ]
}

function reload () {
  window.location.reload(false)
  return null
}

function setForumParam (nextState) {
  if (!config.multiForum) {
    nextState.params.forum = config.defaultForum
  }
}

function restrictLoggedin (nextState, replace, next) {
  user.fetch().then(() => {
    if (user.state.rejected) return next()
    window.location = '/'
  }).catch((err) => { throw err })
}

function restrictAnon (nextState, replace, next) {
  user.fetch().then(() => {
    if (!user.state.rejected) return next()
    window.location = '/signin'
  }).catch((err) => { throw err })
}
