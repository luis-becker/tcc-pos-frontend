'use client'
import Hour from '../hour/Hour'
import styles from './HourGroup.module.css'

export default function HourGroup(props) {

    let hourList = props.hourList
    let newCallback = props.newCallback
    let detailsCallback = props.detailsCallback
    let copyCallback = props.copyCallback
    let weekDay = props.weekDay
    
    function onClick() {
        newCallback(weekDay)
    }

    function onClickCopy() {
        copyCallback(weekDay)
    }

    function onClickHour(e) {
        detailsCallback(e)
    }

    function renderHourList() {
        let sortedHourList = hourList?.sort((a,b) => {
            if(a.startTime.hour < b.startTime.hour) return -1
            if(a.startTime.hour > b.startTime.hour) return 1
            if(a.startTime.minute < b.startTime.minute) return -1
            if(a.startTime.minute > b.startTime.minute) return 1
            return 0
        })
        return sortedHourList?.map((e,i)=>{
            return <Hour info={e} key={`hour-${i}`} callback={onClickHour}/>
        })
    }

    return (
        <div className={styles['hour-group']}>
            {renderHourList()}
            {newCallback !== undefined && <button onClick={onClick}>+</button>}
            {copyCallback !== undefined && <button onClick={onClickCopy}><img src='/images/copy.svg'/></button>}
        </div>
    )
}