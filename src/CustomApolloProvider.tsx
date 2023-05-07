import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  split,
} from "@apollo/client"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { getMainDefinition } from "@apollo/client/utilities"
import { createClient } from "graphql-ws"
import { PropsWithChildren, useMemo } from "react"

export default function CustomApolloProvider({
  children,
  url,
}: PropsWithChildren<{ url: string }>) {
  const client = useMemo(() => {
    const httpLink = new HttpLink({
      uri: `http://${url}`,
    })

    const wsLink = new GraphQLWsLink(
      createClient({
        url,
      }),
    )

    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        )
      },
      wsLink,
      httpLink,
    )

    return new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
    })
  }, [url])

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
