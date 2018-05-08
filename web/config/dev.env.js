'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const omap = require('object.map')
const env = require('dotenv').config()

module.exports = merge(prodEnv, omap(env.parsed, val => JSON.stringify(val)), {
  NODE_ENV: '"development"'
})
