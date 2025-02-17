'use strict'
/* jshint esversion: 6, asi: true, node: true */
// util.js

// private
require('colors') // allow for color property extensions in log messages
var debug = require('debug')('WebSSH2')
var Auth = require('basic-auth')

let defaultCredentials = {username: null, password: null};

exports.setDefaultCredentials = function (username, password) {
    defaultCredentials.username = username;
    defaultCredentials.password = password;
}

exports.basicAuth = function basicAuth (req, res, next) {
  var myAuth = Auth(req)
  if (myAuth && myAuth.pass !== '') {
    req.session.username = myAuth.name
    req.session.userpassword = myAuth.pass
    debug('myAuth.name: ' + myAuth.name.yellow.bold.underline +
      ' and password ' + ((myAuth.pass) ? 'exists'.yellow.bold.underline
      : 'is blank'.underline.red.bold))
  } else {
    req.session.username = defaultCredentials.username;
    req.session.userpassword = defaultCredentials.password;
  }
    console.log("req.session: " +req.session.username + " pass: " + req.session.userpassword);
    console.log("def: " +defaultCredentials.username + " pass: " + defaultCredentials.password);
  if (!req.session.userpassword) {
    res.statusCode = 401
    debug('basicAuth credential request (401)')
    res.setHeader('WWW-Authenticate', 'Basic realm="WebSSH"')
    res.end('Username and password required for web SSH service.')
    return
  }
  next()
}

// takes a string, makes it boolean (true if the string is true, false otherwise)
exports.parseBool = function parseBool (str) {
  return (str.toLowerCase() === 'true')
}
