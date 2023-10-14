import styles from './Greeting.module.css'
import {Lexend_Deca} from "next/font/google"
const lexendDeca = Lexend_Deca({subsets: ["latin"]})

export default function Greeting(props) {
  let name = props.id
  let greeting = props.greeting
  let id = `greeting-${name}`

  return (
    <div className={styles.greeting} id={id} name={name}>
      <p style={lexendDeca.style}>{greeting}</p>
    </div>
  )
}