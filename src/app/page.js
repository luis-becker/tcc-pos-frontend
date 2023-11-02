'use client'

import { useEffect, useState } from "react"
import queries from "../utils/queries"
import { useRouter } from "next/navigation"
import Menu from "../components/menu/Menu"
import styles from './page.module.css'
import Header from "../components/header/Header"
import Schedule from "../components/schedule/Schedule"
import dateUtils from "@/src/utils/dateUtils"
import {Lexend_Deca} from "next/font/google"

const lexendDeca = Lexend_Deca({subsets: ["latin"]})

export default function Home() {
  const [schedules, setSchedules] = useState([])
  const [user, setUser] = useState()
  const [cancelCallback, setCancelCallback] = useState(() => { })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  async function fetchSchedules() {
    let res = await queries.getSchedules()
    if (res.status == 401) router.push('/login')
    setSchedules(await res.json())
  }

  async function fetchUser() {
    let res = await queries.getUser()
    if (res.status == 401) router.push('/login')
    setUser(await res.json())
  }

  function groupSchedulesByDate(schedules) {
    let groupedSchedules = {}
    schedules.forEach(schedule => {
      schedule.time.start = schedule.time.start.split('.')[0]
      schedule.time.end = schedule.time.end.split('.')[0]
      if (schedule.canceled == true) return
      let date = new Date(schedule.time.start)
      let wday = dateUtils.getWeekday(date)
      let day = date.getDate()
      let month = date.getMonth() + 1
      month = month < 10 ? `0${month}` : month
      let year = date.getFullYear()
      let key = `${year}-${month}-${day}`
      if (!groupedSchedules[key]) groupedSchedules[key] = []
      groupedSchedules[key].push({ dateString: `${wday} ${day}/${month}`, schedule })
    })
    return groupedSchedules
  }

  function getSchedulesComponents(schedules) {
    if (schedules.length == 0) return []
    let groupComponent = []
    let groupedSchedules = groupSchedulesByDate(schedules)
    let sortedGourps = Object.entries(groupedSchedules).sort((a, b) => {
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return 0;
    })

    sortedGourps.forEach(([key, value]) => {
      groupComponent.push(
        <li key={key}>
          <p>{value[0].dateString}</p>
          <ul>
            {value.map(schedule => {
              return (
                <li key={schedule.schedule._id}>
                  <Schedule schedule={schedule.schedule} modalOps={{ setIsModalOpen, setCancelCallback }} user={user}/>
                </li>
              )
            })}
          </ul>
        </li>
      )
    })
    groupComponent.push(
      <br key='br' />
    )
    return groupComponent
  }

  useEffect(function () {
    fetchSchedules()
    fetchUser()
  }, [])

  function closeModal() {
    setIsModalOpen(false)
    setCancelCallback(() => { })
  }

  async function cancelSchedule() {
    await cancelCallback()
    closeModal()
  }

  return (
    <div className={styles['page-background']}>
      <div className={styles['page-container']}>
        <div className={styles['header-schedules']}>
          <Header menuActive='schedules' titleFirst='Meus' titleSecond='Agendamentos' />
          <div>
            <div className={styles['schedules-container']}>
              <ul>
                {
                  getSchedulesComponents(schedules)
                }
              </ul>
            </div>
          </div>
        </div>
        <div className={styles['menu-container']}>
          <Menu active='schedules' />
        </div>
      </div>
      <div className={`${styles['modal-background']} ${!isModalOpen && styles['hide-modal']}`} onClick={closeModal}>
        <div className={styles['modal']}>
          <p>Cancelar agendamento?</p>
          <div>
            <button style={lexendDeca.style} onClick={closeModal}>Não</button>
            <button style={lexendDeca.style} onClick={cancelSchedule}>Sim</button>
          </div>
        </div>
      </div>
    </div>
  )
}