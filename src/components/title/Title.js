import styles from './Title.module.css'
import {Comfortaa} from "next/font/google"
const comfortaa = Comfortaa({subsets: ["latin"]})

export default function Title() {
  return (
    <div className={styles.title}>
      <p style={comfortaa.style}>A</p>
      <p style={comfortaa.style}>gendaC</p>
    </div>
  )
}