import styles from "./global.module.css"
import {Lexend_Deca} from "next/font/google"

const lexendDeca = Lexend_Deca({subsets: ["latin"], weight:'500'})


export const metadata = {
  title: 'AgendaC',
  description: 'Created by Luís Becker',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={styles.layout} style={lexendDeca.style}>
          {children}
      </body>
    </html>
  )
}
