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

export default function User({params}) {

  const userId = params.userId
  const router = useRouter()

  const [loggedUser, setLoggedUser] = useState()
  const [pageUser, setPageUser] = useState()
  const [currDate, setCurrDate] = useState(new Date())
  const { width: windowWidth } = useWindowDimensions()

  useEffect(() => {
    fetchUsers()
  }, [])

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
    return agenda?.filter((e) => {
      return e.weekDay == wday
    })
  }

  function renderHourGroups() {
    let nGroups = 1
    if(windowWidth > 700) {
      nGroups = 7
    }
    let hourGroups = []
    for (let i = 0; i < nGroups; i++) {
      hourGroups.push(<HourGroup detailsCallback={()=>{}} hourList={getHoursFromWeekDay(i + currDate.getDay())} key={`hour-group-${i}`} />)
    }
    return hourGroups
  }


  return(
    <div className={styles['page-background']}>
      <div className={styles['page-container']}>
        <div className={styles['header-content']}>
          <Header titleFirst='Horários de' titleSecond={pageUser?.name}/>
          <div className={styles['hour-group-container']} >
            {renderHourGroups()}
          </div>
        </div>
        <div className={styles['menu-container']}>
          <Menu />
        </div>
      </div>
    </div>
  )
}