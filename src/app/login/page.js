'use client'

import { useState } from "react"
import { Lexend_Deca } from "next/font/google"
import { useRouter } from "next/navigation"
import Input from "@/src/components/input/Input"
import Greeting from "@/src/components/greeting/Greeting"
import Button from "@/src/components/button/Button"
import styles from "./page.module.css"
import Title from "@/src/components/title/Title"
import AuthTokenSingleton from "@/src/utils/AuthTokenSingleton"
import Error from "@/src/components/error/Error"

const lexendDeca = Lexend_Deca({ subsets: ["latin"] })

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState()
  
  const router = useRouter()

  const handleSubmit = async (event) => {
    event.preventDefault()

    let res = await fetch("/api/v1/auth/login", {
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

    if(res.status == 401) {
      setError("Credenciais Inválidas.")
    }
    //TODO: save token and redirect to home page
  }

  const register = (event) => {
    router.push('/register')
  }

  const emailChange = (event) => {
    setEmail(event.target.value)
  }

  const passwordChange = (event) => {
    setPassword(event.target.value)
  }

  return (
    <div className={styles["page-background"]}>
      <div className={styles["page-container"]}>
        <Title />
        <Greeting greeting="Bem-vindo de volta!" />
        <form onSubmit={handleSubmit}>
          <Input type="email" placeholder="E-mail" name="email" required onChange={emailChange} icon="/images/person.svg" />
          <Input type="password" placeholder="Senha" name="psw" required onChange={passwordChange} icon="/images/lock.svg" />
          <Error name="login" message={error}/>
          <Button type="submit" text="Login" />
        </form>
        <div className={styles["registry-container"]}>
          <div>
            <p style={lexendDeca.style}>Não possui conta?</p>
          </div>
          <Button type="submit" text="Criar Conta" onClick={register} />
        </div>
      </div>
    </div>
  )
}