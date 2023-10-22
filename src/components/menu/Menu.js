'use client'

import { useRouter } from 'next/navigation'
import styles from './Menu.module.css'

export default function Menu(props) {
  const router = useRouter()
  const isActive = {}
  switch (props.active) {
    case 'config':
      isActive.config = `${styles.active}`
      break
    case 'schedules':
      isActive.schedules = styles.active
      break
    case 'info':
      isActive.info = styles.active
      break;
  }

  function onClickConfig() {
    if (isActive.config) return
    router.push('/config')
  }
  function onClickSchedules() {
    if (isActive.schedules) return
    router.push('/')
  }
  function onClickShare() {
    if (isActive.info) return
    router.push('/info')
  }

  return (
    <div className={styles['menu-container']}>
      <div className={styles['menu-bar']}/>
      <div className={styles['buttons-container']}>
        <button className={isActive.config} onClick={onClickConfig}>
          <img src="/images/person_gear.svg" />
        </button>
        <button className={isActive.schedules} onClick={onClickSchedules}>
          <img src="/images/calendar_check.svg" />
        </button>
        <button className={isActive.info} onClick={onClickShare}>
          <img src="/images/globe.svg" />
        </button>
      </div>
    </div>
  )
}