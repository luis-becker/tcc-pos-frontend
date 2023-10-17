import styles from './Button.module.css'

export default function Button(props) {
  let name = props.id
  let id = `greeting-${name}`
  let type = props.type || "button"
  let text = props.text
  let onClick = props.onClick

  return (
    <button className={styles.button} type={type} id={id} name={name} onClick={onClick}>
      {text}
    </button>
  )
}