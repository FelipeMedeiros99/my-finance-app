import styles from "./style.module.css"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className={styles.mainContainer}>
      {children}
    </main>
  )
}