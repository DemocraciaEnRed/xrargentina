var passport = require('passport')
var passportDiscourse = require("lib/passport-discourse/lib").Strategy
var log = require('debug')('democracyos:auth:discourse:strategy')
var config = require('lib/config')

/**
 * Register Discourse Strategy
 */

module.exports = function () {
  const auth_discourse = new passportDiscourse({
    secret: config.discourseSecret,
    discourse_url: config.discourseBaseUrl,
    debug: false
  }, function(accessToken, refreshToken, profile, done){
      // acá se vuelve después de que hagan login en Discourse
      // accessToken = null
      // refreshToken = null
      // const { username, email, displayName } = profile
      log('Discourse login received %o', profile)
      // esta función no recibe parámetros
      done()
  });

  passport.use(auth_discourse)
}
