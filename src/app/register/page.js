'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Input from "@/src/components/input/Input"
import Greeting from "@/src/components/greeting/Greeting"
import Button from "@/src/components/button/Button"
import styles from "./page.module.css"
import Title from "@/src/components/title/Title"
import Error from "@/src/components/error/Error"

export default function Register() {
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState()
  const router = useRouter()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      setError("Senhas não coincidem.")
      return
    }
    let res = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password, password
      })
    })
    if(res.status == 409) {
      setError('Email já cadastrado.')
    } else if (res.status == 201){
      setError(null)
      router.push('/login')
    } else {
      setError('Não foi possivel criar sua conta.')
    }
  }

  const emailChange = (event) => {
    setEmail(event.target.value)
  }

  const confirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value)
  }

  const passwordChange = (event) => {
    setPassword(event.target.value)
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