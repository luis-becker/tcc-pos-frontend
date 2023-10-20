'use client'

import Header from '@/src/components/header/Header'
import styles from './page.module.css'
import Menu from '@/src/components/menu/Menu'
import { useEffect, useState } from 'react'
import queries from '@/src/utils/queries'
import { useRouter } from 'next/navigation'
import HourGroup from '@/src/components/hour-group/HourGroup'
import { Lexend_Deca } from "next/font/google"

const lexendDeca = Lexend_Deca({ subsets: ["latin"] })

export default function config() {
  
  const router = useRouter()
  const [user, setUser] = useState({ name: 'Loading...' })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputHour, setInputHour] = useState({ weekDay: null, startTime: { hour: null, minute: null }, endTime: { hour: null, minute: null } })
  
    useEffect(() => {
      fetchUser()
    }, [])

  function clearInputs() {
    let inputs = document.getElementsByTagName('input')
    Array.from(inputs).forEach(function (element) {
      element.value = ''
    });
  }

  function closeModal() {
    setInputHour({ weekDay: null, startTime: { hour: null, minute: null }, endTime: { hour: null, minute: null } })
    clearInputs()
    setIsModalOpen(false)
  }

  function openModal(day) {
    inputHour.weekDay = day
    setIsModalOpen(true)
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

  async function updateUser(userToUpdate) {
    let res = await queries.updateUser(userToUpdate)
    if (res.status == 401) router.push('/login')
    else if (res.status == 200) {
      setUser(await res.json())
    }
  }

  async function updateName(event) {
    let name = event.target.value
    await updateUser({ ...user, name })
    clearInputs()
  }

  function updateHour(e) {
    let name = e.target.name
    let value = e.target.value
    let hour = inputHour

    switch (name) {
      case 'startHour':
        if (value < 0 || value > 23) hour.startTime.hour = null
        hour.startTime.hour = Number(e.target.value)
        break
      case 'startMinute':
        if (value < 0 || value > 59) hour.startTime.minute = null
        hour.startTime.minute = Number(e.target.value)
        break
      case 'endHour':
        if (value < 0 || value > 23) hour.endTime.hour = null
        hour.endTime.hour = Number(e.target.value)
        break
      case 'endMinute':
        if (value < 0 || value > 59) hour.endTime.minute = null
        hour.endTime.minute = Number(e.target.value)
        break
    }

    setInputHour(hour)
  }

  async function updateAgenda() {
    console.log(inputHour)
    if (inputHour.weekDay == null) return
    if (inputHour.startTime.hour == null) return
    if (inputHour.startTime.minute == null) return
    if (inputHour.endTime.hour == null) return
    if (inputHour.endTime.minute == null) return

    let userToUpdate = user
    userToUpdate.agenda.push(inputHour)

    await updateUser(userToUpdate)
    closeModal()
  }

  function renderHourGroups() {
    let agenda = user.agenda
    let hourGroups = []
    for (let i = 0; i < 7; i++) {
      hourGroups.push(<HourGroup callback={openModal} weekDay={i} />)
    }
    return hourGroups
  }

  return (
    <div className={styles['page-background']}>
      <div className={styles['page-container']}>
        <div className={styles['header-content']}>
          <Header menuActive='config' titleFirst='Configuração' titleSecond={user.name} config callback={updateName} />
          <div>
            <HourGroup callback={openModal} weekDay={0} />
          </div>
        </div>
        <div className={styles['menu-container']}>
          <Menu active='config' />
        </div>
      </div>
      <div className={`${styles['modal-background']} ${!isModalOpen && styles['hide-modal']}`} onClick={closeModal}>
        <div className={styles['modal']} onClick={(e) => { e.stopPropagation() }} id='new-hour-modal'>
          <p>Novo Horário</p>
          <div>
            <p>início: </p>
            <input type="number" placeholder='00' onChange={updateHour} name='startHour' />
            <span>h</span>
            <input type="number" placeholder='00' onChange={updateHour} name='startMinute' />
          </div>
          <div>
            <p>fim: </p>
            <input type="number" placeholder='00' onChange={updateHour} name='endHour' />
            <span>h</span>
            <input type="number" placeholder='00' onChange={updateHour} name='endMinute' />
          </div>
          <div>
            <button style={lexendDeca.style} onClick={closeModal}>Cancelar</button>
            <button style={lexendDeca.style} onClick={updateAgenda}>Criar</button>
          </div>
        </div>
      </div>
    </div>
  )
}