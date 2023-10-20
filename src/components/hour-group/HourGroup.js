'use client'
import Hour from '../hour/Hour'
import styles from './HourGroup.module.css'

export default function HourGroup(props) {

    let hourList = props.hourList
    let callback = props.callback
    let weekDay = props.weekDay
    
    function onClick() {
        callback(weekDay)
    }
    return (
        <div className={styles['hour-group']}>
            <Hour start={{hour:8, minute:30}}/>
            <button onClick={onClick}>+</button>
        </div>
    )
}