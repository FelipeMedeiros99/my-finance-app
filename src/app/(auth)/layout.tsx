import styles from "./style.module.css"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex items-center justify-center flex-col h-screen w-full bg-gray-100 p-5">
      {children}
    </main>
  )
}