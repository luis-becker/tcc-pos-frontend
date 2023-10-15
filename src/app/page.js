'use client'

import { useEffect, useState } from "react"
import queries from "../utils/queries"
import { useRouter } from "next/navigation"
import Menu from "../components/menu/Menu"

export default function Home() {
  const [schedules, setSchedules] = useState([])
  const router = useRouter()

  async function fetchSchedules() {
    let res = await queries.getSchedules()
    if (res.status == 401) router.push('/login')
    setSchedules(await res.json())
  }

  useEffect(function () {
    fetchSchedules()
  }, [])

  useEffect(function () {
    console.log(schedules)
  }, [schedules])

  return (
    <div>
      <div>
        <h1>AgendaC</h1>
        <div>
          <p>Olá Mundo</p>
        </div>
        <a href="/login">Login</a><br />
        <a href="/register">Criar Conta</a>
      </div>
      <Menu active='schedules'/>
    </div>
  )
}