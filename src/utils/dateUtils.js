'use client'

function getWeekday(date) {
    const day = date.getDay();
    return getWeekdayName(day)
}

function getWeekdayName(value) {
    const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return weekdays[value];
}

function getDateString(date) {
    let day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
    let month = date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
    return `${day}/${month}`
}

function getNextDay(today, wday) {
    let todayWday = today.getDay()
    let diff = wday - todayWday
    if (diff < 0) diff += 7
    let date = new Date()
    date.setTime(today.getTime() + (diff * 24 * 60 * 60 * 1000))
    return date
}

export default {
    getWeekday,
    getWeekdayName,
    getDateString,
    getNextDay
};