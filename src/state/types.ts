import { z } from "zod"

const SubscriptionSchema = z.object({
  name: z.string(),
  url: z.string(),
  graphql: z.string(),
  jsonPath: z.string(),
  outputFile: z.string(),
  params: z
    .record(
      z.string(),
      z.union([
        z.object({ type: z.literal("boolean"), value: z.boolean() }),
        z.object({ type: z.literal("number"), value: z.number() }),
        z.object({ type: z.literal("string"), value: z.string() }),
      ]),
    )
    .optional(),
})
export const AppConfigurationSchema = z.object({
  subscriptions: z.array(SubscriptionSchema),
})
export type Subscription = z.infer<typeof SubscriptionSchema>
export type AppConfiguration = z.infer<typeof AppConfigurationSchema>
