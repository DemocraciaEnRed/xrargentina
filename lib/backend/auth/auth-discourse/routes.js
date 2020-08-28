/**
 * Module dependencies.
 */

var express = require('express')
var passport = require('passport')
var log = require('debug')('democracyos:auth:discourse:routes')
var passportDiscourse = require("lib/passport-discourse/lib").Strategy
var User = require('lib/backend/models').User
var config = require('lib/config')
var jwt = require('lib/backend/jwt')
const utils = require('lib/backend/utils')

/**
 * Expose auth app
 */

var app = module.exports = express()

/*
 * Discourse Auth routes
 */

app.get("/auth/discourse_sso", passport.authenticate("discourse"));

// passportDiscourse.route_callback == '/discourse_sso/verify_discourse_sso'
app.get(passportDiscourse.route_callback, (req,res,next) =>
  passport.authenticate("discourse", {
    // estas opciones parece que no se usan
    successRedirect: "/auth/done",
    failureRedirect: "/login"
  }, (err, profile) => {
    // acá llegamos después de la función done del strategy
    if (err){
      log('Discourse login error: %o', err)
      return res.status(500).json({ error: err.message })
    }

    User.findByEmail(profile.email, function (err, user) {

      if (err){
        log('Finding user error: %o', err)
        return res.status(500).json({ error: err.message })
      }

      if (user){
        log('Discourse log in. User id: %s', user.id)
        jwt.setUserOnCookie(user, res)
        return res.redirect('/')
      }

      log('Discourse user not found: %s. Creating it.', profile.email)
      discourseSignup(profile, (err, user) => {
        if (err){
          log('Discourse signup error:', err)
          return res.status(500).json({ error: err.message })
        }

        log('Loggin in new Discourse user. Id: %s', user.id)
        jwt.setUserOnCookie(user, res)
        return res.redirect('/')
      })

    })

  })(req,res,next)
);

function discourseSignup (profile, fn) {
  try {
    user = new User()

    user.set('emailValidated', true)
    if (profile.displayName) {
      user.set('firstName', profile.displayName)
    }
    if (profile.email) {
      user.set('email', profile.email)
    }

    user.save(fn)
  } catch (err) {
    return fn(err, null)
  }
}
