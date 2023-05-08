import { useAtom } from "jotai"
import { useEffect, useState } from "react"

import { appConfigAtom } from "./state"
import { readAppConfig } from "./state/persistence"
import SubscriptionsList from "./SubscriptionsList"

export default function App() {
  const [appConfig, setAppConfig] = useAtom(appConfigAtom)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    async function initApp() {
      try {
        const appConfig = await readAppConfig()
        setAppConfig(appConfig)
      } catch (err: any) {
        setError(err.message)
      }
    }
    initApp()
  }, [])
  if (error) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-white dark:bg-black text-gray-800 dark:text-gray-200 p-4">
        <div className="inline">{error}</div>
      </div>
    )
  }
  if (!appConfig) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-white dark:bg-black text-gray-800 dark:text-gray-200 p-4">
        loading...
      </div>
    )
  }
  return (
    <div className="flex min-h-screen w-screen flex-col bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      <SubscriptionsList />
    </div>
  )
}
