'use client'

function getWeekday(date) {
    const day = date.getDay();
    const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return weekdays[day];
}

export default {
    getWeekday
};