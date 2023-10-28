'use client'

import styles from './Schedule.module.css'
import { Lexend_Deca } from "next/font/google"
import queries from "@/src/utils/queries"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const lexendDeca = Lexend_Deca({ subsets: ["latin"], weight: '500' })

export default function Schedule(params) {

  let schedule = params.schedule

  if (schedule == undefined) return (<></>)
  if (schedule.canceled) return (<></>)

  const { setIsModalOpen, setCancelCallback } = params.modalOps

  const router = useRouter()

  let service = schedule?.service
  let address = schedule?.address

  let user = params.user
  let title = schedule?.owner.ref == user?._id ? schedule?.attendee.name || service : service

  let startTime = new Date(params.schedule?.time.start)
  let hours = startTime.getHours()
  let minutes = startTime.getMinutes()
  let formattedMinutes = (minutes < 10) ? `0${minutes}` : minutes;
  let stringStartTime = `${hours}:${formattedMinutes}`

  let endTime = new Date(params.schedule?.time.end)
  let hoursDifference = (endTime - startTime) / (60 * 60 * 1000)

  let decimalHours = Math.floor(hoursDifference)
  let minutesDifference = (hoursDifference - decimalHours) * 60
  let duration = decimalHours > 0 ? `${decimalHours}h` : ''
  duration += minutesDifference > 0 ? `${minutesDifference}` : ''
  duration += decimalHours == 0 ? 'min' : ''

  function cancelSchedule() {
    setCancelCallback(cancelCallback)
    setIsModalOpen(true)
  }

  const [hide, setHide] = useState(false)

  function cancelCallback() {
    return async () => {
      let res = await queries.cancelSchedule(params.schedule)
      if (res.status == 401) router.push('/login')
      setHide(true)
    }
  }

  let className = `${styles['schedule-container']} ${hide && styles['hide']}`

  return (
    <button className={className}>
      <div>
        <p style={lexendDeca.style}>{title}</p>
        <p style={lexendDeca.style}>{stringStartTime}</p>
      </div>
      <div>
        <p style={lexendDeca.style}>{address}</p>
        <p style={lexendDeca.style}>{duration}</p>
      </div>
      <div className={styles['cancel']} style={lexendDeca.style} onClick={cancelSchedule}>
        <p>Cancelar</p>
      </div>
    </button>
  )
}