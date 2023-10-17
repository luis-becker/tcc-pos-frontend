'use client'

import Menu from '../menu/Menu'
import styles from './Header.module.css'
import {Lexend_Deca} from "next/font/google"

const lexendDeca = Lexend_Deca({subsets: ["latin"], weight:'500'})

export default function Header(props) {
  return (
    <div className={styles['header-container']}>
      <div>
        <div className={styles['img-container']}>
          <img src="/images/person_black.svg" />
        </div>
        <div className={styles['header-title-container']}>
          <p style={lexendDeca.style}>{props.titleFirst}</p>
          <p style={lexendDeca.style}>{props.titleSecond}</p>
        </div>
      </div>
      <div className={styles['menu-container']}>
        <Menu active={props.menuActive}/>
      </div>
    </div>
  )
}