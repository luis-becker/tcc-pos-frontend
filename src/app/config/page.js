'use client'

import Header from '@/src/components/header/Header'
import styles from './page.module.css'
import Menu from '@/src/components/menu/Menu'
import { useEffect, useState } from 'react'
import queries from '@/src/utils/queries'
import { useRouter } from 'next/navigation'

export default function config() {

  const [user, setUser] = useState({ name: 'Loading...' })
  const router = useRouter()

  useEffect(() => {
    fetchUser()
  }, [])

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
    setUser(await res.json())
  }

  async function updateName(event) {
    let name = event.target.value
    await updateUser({ ...user, name })
  }

  return (
    <div className={styles['page-background']}>
      <div className={styles['page-container']}>
        <div className={styles['header-content']}>
          <Header menuActive='config' titleFirst='Configuração' titleSecond={user.name} config callback={updateName} />
          <div></div>
        </div>
        <div className={styles['menu-container']}>
          <Menu active='config' />
        </div>
      </div>
    </div>
  )
}