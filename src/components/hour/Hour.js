'use client'
import styles from './Hour.module.css';

export default function Hour(props) {
    let start = props.info.startTime
    let end = props.info.endTime
    let weekDay = props.info.weekDay

    let hourString = start.hour < 10 ? `0${start.hour}` : start.hour
    let minuteString = start.minute < 10 ? `0${start.minute}` : start.minute
    let startString = hourString + 'h' + minuteString

    function onClick() {
        let hour = {
            weekDay: weekDay,
            startTime: start,
            endTime: end
        }
        props.callback(hour)
    }
    return(
        <div className={styles.hour} onClick={onClick}>
            <p>{startString}</p>
        </div>
    )
}