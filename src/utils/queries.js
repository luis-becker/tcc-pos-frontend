'use client'

import authUtils from "./authUtils"

const AUTH_URI = '/api/v1/auth'
const SCHEDULE_URI = '/api/v1/schedule'
const USER_URI = '/api/v1/user'
const NOTIFICATIONS_URI = '/api/v1/notification'

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

function getUserById(id) {
  let method = 'GET'
  return authUtils.fetchAuth(USER_URI+'/'+id, {method})
}

function createSchedule(schedule) {
  let method = 'POST'
  let headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}
  let body = JSON.stringify(schedule)
  return authUtils.fetchAuth(SCHEDULE_URI, {method, headers, body})
}

function getNotifications() {
  let method = 'GET'
  return authUtils.fetchAuth(NOTIFICATIONS_URI, {method})
}

function ackNotifications(notifications) {
  let method = 'POST'
  let headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}
  let body = JSON.stringify(notifications)
  return authUtils.fetchAuth(NOTIFICATIONS_URI+'/ack', {method, headers, body})
}

export default {
  register,
  login,
  getSchedules,
  cancelSchedule,
  getUser,
  updateUser,
  createUser,
  getUserById,
  createSchedule,
  getNotifications,
  ackNotifications,
  ackNotifications
}