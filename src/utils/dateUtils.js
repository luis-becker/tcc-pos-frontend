'use client'

function getWeekday(date) {
    const day = date.getDay();
    return getWeekdayName(day)
}

function getWeekdayName(value) {
    const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return weekdays[value];
}

export default {
    getWeekday,
    getWeekdayName
};