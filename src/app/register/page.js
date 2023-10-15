'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Input from "@/src/components/input/Input"
import Greeting from "@/src/components/greeting/Greeting"
import Button from "@/src/components/button/Button"
import styles from "./page.module.css"
import Title from "@/src/components/title/Title"
import Error from "@/src/components/error/Error"
import queries from "@/src/utils/queries"

export default function Register() {
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState()

  const router = useRouter()

  function emailChange (event) {
    setEmail(event.target.value)
  }

  function confirmPasswordChange (event) {
    setConfirmPassword(event.target.value)
  }

  function passwordChange (event) {
    setPassword(event.target.value)
  }

  async function handleSubmit (event) {
    event.preventDefault()
    if (password !== confirmPassword) return setError("Senhas não coincidem.")
    let res = await queries.register(email, password)
    if (res.status == 201) router.push('/login')
    if (res.status == 409) setError('Email já cadastrado.')
    else setError('Não foi possivel criar sua conta.')
  }

  return (
    <div className={styles["page-background"]}>
      <div className={styles["page-container"]}>
        <Title/>
        <Greeting greeting="Criação de Conta"/>
        <form onSubmit={handleSubmit}>
          <Input type="email" placeholder="E-mail" name="email" required onChange={emailChange} icon="/images/person.svg"/>
          <Input type="password" placeholder="Senha" name="psw" required onChange={passwordChange} icon="/images/lock.svg"/>
          <Input type="password" placeholder="Confirme sua Senha" name="psw" required onChange={confirmPasswordChange} icon="/images/lock.svg"/>
          <Error name="register" message={error}/>
          <Button type="submit" text="Criar Conta"/>
        </form>
      </div>
    </div>
  )
}