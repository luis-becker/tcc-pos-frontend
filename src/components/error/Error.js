import styles from './Error.module.css'

export default function Error(props) {
  let name = props.id
  let message = props.message
  let id = `error-${name}`
  let hidden = !!message || styles.hidden
  return (
    <div className={`${styles["error-container"]} ${hidden}`} id={id}>
      <p>{message}</p>
    </div>
  )
}