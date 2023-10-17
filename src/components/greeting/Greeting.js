'use client'

import styles from './Greeting.module.css'

export default function Greeting(props) {
  let name = props.id
  let greeting = props.greeting
  let id = `greeting-${name}`

  return (
    <div className={styles.greeting} id={id} name={name}>
      <p>{greeting}</p>
    </div>
  )
}