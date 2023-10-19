'use client'

import authUtils from "./authUtils"

const AUTH_URI = '/api/v1/auth'
const SCHEDULE_URI = '/api/v1/schedule'
const USER_URI = '/api/v1/user'

function register(email, password) {
  let method = 'POST'
  let headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}
  let body = JSON.stringify({email, password})
  return fetch(AUTH_URI + '/register', {method, headers, body})
}

function login(email, password) {
  let method = 'POST'
  let headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}
  let body = JSON.stringify({email, password})
  return fetch(AUTH_URI + '/login', {method, headers, body})
}

function getSchedules() {
  let method = 'GET'
  return authUtils.fetchAuth(SCHEDULE_URI, {method})
}

function cancelSchedule(schedule) {
  let method = 'DELETE'
  return authUtils.fetchAuth(SCHEDULE_URI + `/${schedule._id}`, {method})
}

function getUser() {
  let method = 'GET'
  return authUtils.fetchAuth(USER_URI, {method})
}

function updateUser(user) {
  let method = 'PATCH'
  let headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}
  let body = JSON.stringify(user)
  return authUtils.fetchAuth(USER_URI, {method, headers, body})
}

function createUser(user) {
  let method = 'POST'
  let headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}
  let body = JSON.stringify(user)
  return authUtils.fetchAuth(USER_URI, {method, headers, body})
}

export default {
  register,
  login,
  getSchedules,
  cancelSchedule,
  getUser,
  updateUser,
  createUser
}