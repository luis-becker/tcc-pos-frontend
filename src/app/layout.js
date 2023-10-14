import styles from "./global.module.css"

export const metadata = {
  title: 'AgendaC',
  description: 'Created by Luís Becker',
}

export default function RootLayout({ children }) {
 return (
    <html lang="pt-BR">
      <body className={styles.layout}>{children}</body>
    </html>
  )
}
