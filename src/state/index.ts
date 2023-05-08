import { atom } from "jotai"

import { readAppConfig, writeAppConfig } from "./persistence"
import { type AppConfiguration, type Subscription } from "./types"

export const appConfigAtom = atom<AppConfiguration | null>(null)

export const subscriptionsAtom = atom<Subscription[]>(
  (get) => get(appConfigAtom)?.subscriptions ?? [],
)

export const updateSubscriptionAtom = atom(
  null,
  async (
    get,
    set,
    update: {
      name: Subscription["name"]
      params: Subscription["params"]
    },
  ) => {
    const subscriptions = get(subscriptionsAtom)
    const indexToUpdate = subscriptions.findIndex((s) => s.name === update.name)
    const newSubscriptions = subscriptions.slice()
    newSubscriptions[indexToUpdate] = {
      ...newSubscriptions[indexToUpdate],
      params: { ...newSubscriptions[indexToUpdate].params, ...update.params },
    }
    const appConfig = await readAppConfig()
    const updatedAppConfig: AppConfiguration = {
      ...appConfig,
      subscriptions: newSubscriptions,
    }
    set(appConfigAtom, updatedAppConfig)
    await writeAppConfig(updatedAppConfig)
  },
)
