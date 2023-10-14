import styles from './Error.module.css'
import {Lexend_Deca} from "next/font/google"
const lexendDeca = Lexend_Deca({subsets: ["latin"]})

export default function Error(props) {
  let name = props.id
  let message = props.message
  let id = `error-${name}`
  let hidden = !!message || styles.hidden
  return (
    <div className={`${styles["error-container"]} ${hidden}`} style={lexendDeca.style} id={id}>
      <p>{message}</p>
    </div>
  )
}