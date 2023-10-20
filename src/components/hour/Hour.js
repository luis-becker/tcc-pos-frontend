'use client'
import styles from './Hour.module.css';

export default function Hour(props) {
    let start = props.start
    let end = props.end

    let startString = start.hour + 'h' + start.minute
    return(
        <div className={styles.hour}>
            <p>{startString}</p>
        </div>
    )
}