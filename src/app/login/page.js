'use client'

import { useState } from "react"
import { Lexend_Deca } from "next/font/google"
import { useRouter } from "next/navigation"
import Input from "@/src/components/input/Input"
import Greeting from "@/src/components/greeting/Greeting"
import Button from "@/src/components/button/Button"
import styles from "./page.module.css"
import Title from "@/src/components/title/Title"
import Error from "@/src/components/error/Error"
import authUtils from "@/src/utils/authUtils"
import queries from "@/src/utils/queries"

const lexendDeca = Lexend_Deca({ subsets: ["latin"] })

export default function Login() {
  const [error, setError] = useState()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  function register() {
    router.push('/register')
  }
  function emailChange(event) {
    setEmail(event.target.value)
  }
  function passwordChange(event) {
    setPassword(event.target.value)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    let res = await queries.login(email, password)
    if (res.status == 200) {
      authUtils.saveAuthToken((await res.json()).authtoken)
      router.push('/')
    }
    else if (res.status == 401) setError("Credenciais Inválidas.")
    else setError("O serviço encontrou um erro.")
  }

  return (
    <div className={styles["page-background"]}>
      <div className={styles["page-container"]}>
        <Title />
        <Greeting greeting="Bem-vindo de volta!" />
        <form onSubmit={handleSubmit}>
          <Input type="email" placeholder="E-mail" name="email" required onChange={emailChange} icon="/images/person.svg" />
          <Input type="password" placeholder="Senha" name="psw" required onChange={passwordChange} icon="/images/lock.svg" />
          <Error name="login" message={error} />
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