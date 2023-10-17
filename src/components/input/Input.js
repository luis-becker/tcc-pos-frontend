import styles from './Input.module.css'

export default function Input(props) {
  let type = props.type
  let name = props.id
  let placeholder = props.placeholder
  let required = props.required
  let onChange = props.onChange
  let id = `input-${name}`
  let icon = props.icon

  return (
    <div className={styles.input}>
      <div className={styles['img-conteiner']}>
        <img src={icon} />
      </div>
      <input type={type} name={name} placeholder={placeholder} id={id} onChange={onChange} required={required}/>
    </div>
  )
}