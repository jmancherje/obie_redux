import React from 'react'
import { Route, IndexRoute } from 'react-router'

import { App } from './main.js'

export default (
  <Route path='/' component={App} />
  <Route path='/dashboard' component={Dashboard} />
)