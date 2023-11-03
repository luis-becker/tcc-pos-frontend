'use client'

import Header from "@/src/components/header/Header"
import styles from "./page.module.css"
import Menu from "@/src/components/menu/Menu"
import { useEffect, useState } from "react"
import queries from "@/src/utils/queries"
import { useRouter } from "next/navigation"

export default function Info() {

  const [user, setUser] = useState()
  const [thisLocation, setLocation] = useState()
  const [notifications, setNotifications] = useState([])
  const router = useRouter()

  useEffect(() => {
    fetchUser()
    fetchNotifications()
    setLocation(location?.hostname)
  }, [])

  async function fetchNotifications() {
    let res = await queries.getNotifications()
    let n = await res.json()
    if (res.status == 200) setNotifications(n)
    else if (res.status == 401) router.push('/login')
  }


  async function fetchUser() {
    let res = await queries.getUser()
    if (res.status == 200) setUser(await res.json())
    else if (res.status == 401) router.push('/login')
    else if (res.status == 404) {
      res = await queries.createUser({ name: 'Usuário' })
      if (res.status == 201) setUser(await res.json())
    }
  }

  function getShareLink() {
    return `${thisLocation}/user/${user?._id}`
  }

  async function ackNotification (e) {
    await queries.ackNotifications([e.target.getAttribute('id')])
    let dot = e.target.lastElementChild
    dot.style.display = 'none'
  }

  function renderNotifications() {
    return (
      notifications.map((notification) => {
        return (
          <li key={notification._id}>
            <div onClick={ackNotification} id={notification._id}>
              <p>{notification.message}</p>
              <img src="/images/dot.svg" />
            </div>
          </li>
        )
      })
    )
  }

  return (
    <div className={styles['page-background']}>
      <div className={styles['page-container']}>
        <div className={styles['header-content']}>
          <Header menuActive='info' titleFirst='Minhas' titleSecond='Informações' />
          <div>
            <div className={styles['share-link-container']}>
              <p>Link de compartilhamento</p>
              <p>{getShareLink()}</p>
            </div>
            <div className={styles['notifications-container']}>
              <p>
                Notificações
              </p>
              <ul>
                {
                  renderNotifications()
                }
              </ul>
            </div>
          </div>
        </div>
        <div className={styles['menu-container']}>
          <Menu active='info' />
        </div>
      </div>
    </div>
  )
}