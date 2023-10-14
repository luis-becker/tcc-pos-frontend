import styles from './Button.module.css'
import {Lexend_Deca} from "next/font/google"
const lexendDeca = Lexend_Deca({subsets: ["latin"]})

export default function Button(props) {
  let name = props.id
  let id = `greeting-${name}`
  let type = props.type || "button"
  let text = props.text
  let onClick = props.onClick

  return (
    <button className={styles.button} type={type} id={id} name={name} style={lexendDeca.style} onClick={onClick}>
      {text}
    </button>
  )
}