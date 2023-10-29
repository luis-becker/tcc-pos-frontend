'use client'

import Header from '@/src/components/header/Header'
import styles from './page.module.css'
import Menu from '@/src/components/menu/Menu'
import { useEffect, useState } from 'react'
import queries from '@/src/utils/queries'
import { useRouter } from 'next/navigation'
import HourGroup from '@/src/components/hour-group/HourGroup'
import { Lexend_Deca } from "next/font/google"
import useWindowDimensions from '@/src/utils/useWindowDimensions'
import dateUtils from '@/src/utils/dateUtils'

const lexendDeca = Lexend_Deca({ subsets: ["latin"] })

export default function Config() {

  const router = useRouter()
  const [user, setUser] = useState({ name: 'Loading...' })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputHour, setInputHour] = useState({ weekDay: null, startTime: { hour: null, minute: null }, endTime: { hour: null, minute: null } })
  const [wDay, setWDay] = useState(0)
  const { width: windowWidth } = useWindowDimensions()
  const [modalType, setModalType] = useState('new')

  useEffect(() => {
    fetchUser()
  }, [])

  function closeModal() {
    setInputHour({ weekDay: null, startTime: { hour: null, minute: null }, endTime: { hour: null, minute: null } })
    setIsModalOpen(false)
  }

  function openModalNew(day) {
    setModalType('new')
    inputHour.weekDay = day
    setIsModalOpen(true)
  }

  function openModalDetails(hour) {
    setModalType('details')
    setInputHour(hour)
    setIsModalOpen(true)
  }

  function openModalCopy(weekday) {
    setModalType('copy')
    setWDay(weekday)
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
  }
  
  async function updateService(event) {
    let service = event.target.value
    await updateUser({ ...user, service })
  }

  async function updateAddress(event) {
    let address = event.target.value
    await updateUser({ ...user, address })
  }

  function updateHour(e) {
    let name = e.target.name
    let value = e.target.value
    let hour = value.split(':')[0]
    let minute = value.split(':')[1]

    if (name == 'startTime') inputHour.startTime = { hour, minute }
    if (name == 'endTime') inputHour.endTime = { hour, minute }
    setInputHour(inputHour)
  }

  async function updateAgenda() {
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

  async function removeFromAgenda() {
    let userToUpdate = user
    let newAgenda = user.agenda.filter((e) => {
      if (e.weekDay != inputHour.weekDay) return true
      if (e.startTime.hour != inputHour.startTime.hour) return true
      if (e.startTime.minute != inputHour.startTime.minute) return true
      if (e.endTime.hour != inputHour.endTime.hour) return true
      if (e.endTime.minute != inputHour.endTime.minute) return true
      return false
    })
    userToUpdate.agenda = newAgenda
    await updateUser(userToUpdate)
    closeModal()
  }

  function getHoursFromWeekDay(wday) {
    let agenda = user.agenda
    return agenda?.filter((e) => {
      return e.weekDay == wday
    })
  }

  function renderHourGroups() {
    let hourGroups = []
    let nGroups = 7
    let currWeekDay = 0
    if (windowWidth < 700) {
      nGroups = 1
      currWeekDay += wDay
    }
    for (let i = 0; i < nGroups; i++) {
      hourGroups.push(<HourGroup newCallback={openModalNew} detailsCallback={openModalDetails} copyCallback={openModalCopy} weekDay={i + currWeekDay} hourList={getHoursFromWeekDay(i + currWeekDay)} key={`hour-group-${i}`} />)
    }
    return hourGroups
  }

  function renderWDaysNames() {
    let names = []
    let nGroups = 7
    let currWeekDay = 0
    if (windowWidth < 700) {
      nGroups = 1
      currWeekDay += wDay
    }
    for (let i = 0; i < nGroups; i++) {
      names.push(<span key={`wday-${i}`}>{dateUtils.getWeekdayName(i + currWeekDay)}</span>)
    }
    return names
  }

  function nextWeekday() {
    let nextWeekday = wDay + 1
    if (nextWeekday == 7) nextWeekday = 0
    setWDay(nextWeekday)
  }

  function previousWeekday() {
    let previousWeekday = wDay - 1
    if (previousWeekday == -1) previousWeekday = 6
    setWDay(previousWeekday)
  }

  async function copyHours(e) {
    e.preventDefault()
    let inputs = document.getElementsByName('wday-radio')
    let checked = Array.from(inputs).find(e=>e.checked)
    
    let hoursToCopy = user.agenda.filter(e=>e.weekDay==checked.value)
    let copiedHours = hoursToCopy.map((e)=> {
      let hour = {...e}
      hour.weekDay = wDay
      return hour
    })
    
    let userAgenda = user.agenda.filter(e=>e.weekDay!=wDay)
    userAgenda.push(...copiedHours)

    let userToUpdate = {...user}
    userToUpdate.agenda = userAgenda
    await updateUser(userToUpdate)
    closeModal()
  }

  function getModalContent() {
    if (modalType == 'new') return (
      <form className={styles['modal']}>
        <p>Novo Horário</p>
        <div>
          <p>início: </p>
          <input type="time" placeholder='00' onChange={updateHour} name='startTime' required />
        </div>
        <div>
          <p>fim: </p>
          <input type="time" onChange={updateHour} name='endTime' required />
        </div>
        <div>
          <button type='button' style={lexendDeca.style} onClick={closeModal}>Cancelar</button>
          <button type='button' style={lexendDeca.style} onClick={updateAgenda} className={styles['danger-button']}>Criar</button>
        </div>
      </form>
    )
    if (modalType == 'details') {
      let startHour = inputHour.startTime.hour < 10 ? `0${inputHour.startTime.hour}` : inputHour.startTime.hour
      let startMinute = inputHour.startTime.minute < 10 ? `0${inputHour.startTime.minute}` : inputHour.startTime.minute
      let endHour = inputHour.endTime.hour < 10 ? `0${inputHour.endTime.hour}` : inputHour.endTime.hour
      let endMinute = inputHour.endTime.minute < 10 ? `0${inputHour.endTime.minute}` : inputHour.endTime.minute
      let weekDayName = dateUtils.getWeekdayName(inputHour.weekDay)
      return (
        <>
          <p>Detalhes do horário</p>
          <div>
            <span>{weekDayName}</span>
          </div>
          <div>
            <span>{`início: ${startHour}h${startMinute}`}</span>
          </div>
          <div>
            <span>{`fim: ${endHour}h${endMinute}`}</span>
          </div>
          <div>
            <button style={lexendDeca.style} onClick={removeFromAgenda} className={styles['danger-button']}>Remover</button>
            <button style={lexendDeca.style} onClick={closeModal}>Cancelar</button>
          </div>
        </>
      )
    }
    if (modalType == 'copy') {
      let inputs = [
        (
          <div key="radio-domingo" wday="0">
            <input type="radio" id="radio-domingo" name="wday-radio" value="0" />
            <label htmlFor="radio-domingo">Domingo</label><br />
          </div>
        ),
        (
          <div key="radio-segunda" wday="1">
            <input type="radio" id="radio-segunda" name="wday-radio" value="1" />
            <label htmlFor="radio-segunda">Segunda</label><br />
          </div>
        ),
        (
          <div key="radio-terca" wday="2">
            <input type="radio" id="radio-terca" name="wday-radio" value="2" />
            <label htmlFor="radio-terca">Terça</label><br />
          </div>
        ),
        (
          <div key="radio-quarta" wday="3">
            <input type="radio" id="radio-quarta" name="wday-radio" value="3" />
            <label htmlFor="radio-quarta">Quarta</label><br />
          </div>
        ),
        (
          <div key="radio-quinta" wday="4">
            <input type="radio" id="radio-quinta" name="wday-radio" value="4" />
            <label htmlFor="radio-quinta">Quinta</label><br />
          </div>
        ),
        (
          <div key="radio-sexta" wday="5">
            <input type="radio" id="radio-sexta" name="wday-radio" value="5" />
            <label htmlFor="radio-sexta">Sexta</label><br />
          </div>
        ),
        (
          <div key="radio-sabado" wday="6">
            <input type="radio" id="radio-sabado" name="wday-radio" value="6" />
            <label htmlFor="radio-sabado">Sabado</label><br />
          </div>
        ),
      ]
      return (
        <form className={styles['modal']} onSubmit={copyHours}>
          <p>Copiar horários</p>
          {inputs.filter((e) => {
            if (Number(e.props.wday) == wDay) return false
            return true
          })}
          <div>
            <button type='button' style={lexendDeca.style} onClick={closeModal}>Cancelar</button>
            <button type='submit' style={lexendDeca.style} className={styles['danger-button']}>Copiar</button>
          </div>
        </form>
      )
    }
  }

  return (
    <div className={styles['page-background']}>
      <div className={styles['page-container']}>
        <div className={styles['header-content']}>
          <Header menuActive='config' titleFirst='Configuração' titleSecond={user.name} config callback={updateName} />
          <div>
            <input type='text' style={lexendDeca.style} placeholder='Serviço' onBlur={updateService} defaultValue={user.service} id='service-input'/><br/>
            <input type='text' style={lexendDeca.style} placeholder='Endereço' onBlur={updateAddress} defaultValue={user.address} id='address-input'/>
          </div>
          <div className={styles['wday-selector']}>
            <button onClick={previousWeekday}><img src="/images/chevron_left.svg" /></button>
            {renderWDaysNames()}
            <button onClick={nextWeekday}><img src="/images/chevron_right.svg" /></button>
          </div>
          <div className={styles['hour-group-container']}>
            {renderHourGroups()}
          </div>
        </div>
        <div className={styles['menu-container']}>
          <Menu active='config' />
        </div>
      </div>
      <div className={`${styles['modal-background']} ${!isModalOpen && styles['hide-modal']}`}>
        <div className={styles['modal']} onClick={(e) => { e.stopPropagation() }} id='new-hour-modal'>
          {getModalContent()}
        </div>
      </div>
    </div>
  )
}