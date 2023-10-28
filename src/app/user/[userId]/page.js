'use client'

import queries from "@/src/utils/queries"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import styles from './page.module.css'
import Header from "@/src/components/header/Header"
import Menu from "@/src/components/menu/Menu"
import useWindowDimensions from "@/src/utils/useWindowDimensions"
import dateUtils from "@/src/utils/dateUtils"
import HourGroup from "@/src/components/hour-group/HourGroup"
import {Lexend_Deca} from "next/font/google"

const lexendDeca = Lexend_Deca({subsets: ["latin"], weight:'500'})

export default function User({params}) {

  const userId = params.userId
  const router = useRouter()
  const today = new Date()

  const [loggedUser, setLoggedUser] = useState()
  const [pageUser, setPageUser] = useState()
  const [currDate, setCurrDate] = useState(new Date())
  const { width: windowWidth } = useWindowDimensions()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selected, setSelected] = useState({})
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    fetchUsers()
    setRefresh(false)
  }, [refresh])

  async function fetchUsers() {
    let res = await queries.getUser()
    if (res.status == 200) setLoggedUser(await res.json())
    else if (res.status == 401) router.push('/login')
    else if (res.status == 404) {
      res = await queries.createUser({ name: 'Usuário' })
      if (res.status == 201) setUser(await res.json())
    }

    res = await queries.getUserById(userId)
    if (res.status == 200) setPageUser(await res.json())
    else if (res.status == 401) router.push('/login')
    else if (res.status == 404) router.push('/404')
  }

  function getHoursFromWeekDay(wday) {
    let agenda = pageUser?.agenda
    let filteredAgenda = agenda?.filter((e) => {
      return e.weekDay == wday
    })

    let schedules = pageUser?.schedules
    return filteredAgenda?.filter((e) => {
      for(let s of schedules) {
        let sStartDate = new Date(s.startTime.split('.')[0])
        let sEndDate = new Date(s.endTime.split('.')[0])

        let diffTime = sStartDate - currDate;
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let sStartTime = sStartDate.getHours() + sStartDate.getMinutes()/60
        let sEndTime = sEndDate.getHours() + sEndDate.getMinutes()/60
        let eStartTime = e.startTime.hour + e.startTime.minute/60
        let eEndTime = e.endTime.hour + e.endTime.minute/60

        if((!(sStartDate.getDay() != wday)) &&
          (!(diffDays > 6 || diffDays < 0)) &&
          ((sStartTime < eEndTime && sEndTime > eStartTime) || (eStartTime < sEndTime && eEndTime > sStartTime))) return false
        }
        
        return true
    })
  }

  function renderHourGroups() {
    let nGroups = 1
    if(windowWidth > 700) {
      nGroups = 7
    }
    let hourGroups = []
    for (let i = 0; i < nGroups; i++) {
      let weekDay = (i + currDate.getDay()) % 7
      hourGroups.push(<HourGroup detailsCallback={openModal} hourList={getHoursFromWeekDay(weekDay)} key={`hour-group-${i}`} />)
    }
    return hourGroups
  }

  function renderHourGroupsDays() {
    let nGroups = 1
    if(windowWidth > 700) {
      nGroups = 7
    }
    let hourGroupsDays = []
    for (let i = 0; i < nGroups; i++) {
      let date = new Date(currDate.getTime())
      date.setMilliseconds(date.getMilliseconds() + (i * 24 * 60 * 60 * 1000))
      let weekDay = date.getDay()
      let dateString = dateUtils.getDateString(date)

      hourGroupsDays.push(
        <div className={styles['date-plus-weekday']} key={`date-plus-weekday${i}`}>
          <p key={`hour-group-day-${i}`} >{dateString}</p>
          <p key={`hour-group-weekday-${i}`} >{dateUtils.getWeekdayName(weekDay)}</p>
        </div>
      )
    }
    return hourGroupsDays
  }

  function selectDate(e) {
    let date = e.target.value ? new Date(e.target.value) : new Date()
    let timezoneOffset = date.getTimezoneOffset()
    date.setTime(date.getTime() + timezoneOffset * 60 * 1000)
    setCurrDate(date)
  }

  function dateString(date) {
    let month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    let day = date.getDate() < 10 ?  `0${date.getDate()}` : date.getDate()
    return `${date.getFullYear()}-${month}-${day}`
  }

  function next() {
    let date = new Date()
    date.setTime(currDate.getTime() + (24 * 60 * 60 * 1000))
    setCurrDate(date)
  }

  function previous() {
    let date = new Date()
    date.setTime(currDate.getTime() - (24 * 60 * 60 * 1000))
    setCurrDate(date)
  }

  function disableLeftButton() {
    return currDate.getTime() <= today.getTime()
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  async function schedule() {
    let date = dateUtils.getNextDay(currDate, selected.weekDay)
    let start = new Date(date.getTime())
    start.setHours(selected.startTime.hour)
    start.setMinutes(selected.startTime.minute)
    let end = new Date(date.getTime())
    end.setHours(selected.endTime.hour)
    end.setMinutes(selected.endTime.minute)

    let startDay = start.getDate() > 9 ? start.getDate() : `0${start.getDate()}`
    let startMonth = start.getMonth() > 8 ? start.getMonth() + 1 : `0${start.getMonth() + 1}`
    let startHour = start.getHours() > 9 ? start.getHours() : `0${start.getHours()}`
    let startMinute = start.getMinutes() > 9 ? start.getMinutes() : `0${start.getMinutes()}`
    let endDay = end.getDate() > 9 ? end.getDate() : `0${end.getDate()}`
    let endMonth = end.getMonth() > 8 ? end.getMonth() + 1 : `0${end.getMonth() + 1}`
    let endHour = end.getHours() > 9 ? end.getHours() : `0${end.getHours()}`
    let endMinute = end.getMinutes() > 9 ? end.getMinutes() : `0${end.getMinutes()}`
    let service = pageUser.service || pageUser.name
    let newSchedule = {
      owner: {ref: pageUser._id, name: pageUser.name},
      time:{
        start:`${start.getFullYear()}-${startMonth}-${startDay}T${startHour}:${startMinute}:00`,
        end:`${end.getFullYear()}-${endMonth}-${endDay}T${endHour}:${endMinute}:00`
      },
      service: service,
      address: pageUser.address
    }
    let res = await queries.createSchedule(newSchedule)
    if (res.status == 401) router.push('/login')
    setRefresh(true)
    closeModal()
  }

  function openModal(hour) {
    setSelected(hour)
    setIsModalOpen(true)
  }

  return(
    <div className={styles['page-background']}>
      <div className={styles['page-container']}>
        <div className={styles['header-content']}>
          <Header titleFirst='Horários de' titleSecond={pageUser?.name}/>
          <div className={styles["selectors"]}>
            <button onClick={previous} disabled={disableLeftButton()}><img src="/images/chevron_left.svg"/></button>
            <input type='date' style={lexendDeca.style} onChange={selectDate} min={dateString(today)} value={dateString(currDate)}></input>
            <button onClick={next}><img src="/images/chevron_right.svg"/></button>
          </div>
          <div className={styles['hour-groups-days']}>
            {renderHourGroupsDays()}
          </div>
          <div className={styles['hour-groups-container']} >
            {renderHourGroups()}
          </div>
        </div>
        <div className={styles['menu-container']}>
          <Menu />
        </div>
      </div>
      <div className={`${styles['modal-background']} ${!isModalOpen && styles['hide-modal']}`} onClick={closeModal}>
        <div className={styles['modal']}>
          <p>Realizar agendamento?</p>
          <div>
            <button style={lexendDeca.style} onClick={closeModal}>Não</button>
            <button style={lexendDeca.style} onClick={schedule}>Sim</button>
          </div>
        </div>
      </div>
    </div>
  )
}