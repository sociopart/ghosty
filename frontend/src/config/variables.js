import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { createUploadLink } from 'apollo-upload-client'
import * as ActionCable from "@rails/actioncable";
import ActionCableLink from "graphql-ruby-client/subscriptions/ActionCableLink";
import { split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";

import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';

export const httpLink = createUploadLink({
  uri: "/graphql",
  credentials: "include"
});
export const backendHostName = "0.0.0.0:5000";
export const backendUrl = "http://" + backendHostName;
export const railsToken = localStorage.getItem("csrftoken");
export const accessToken = Cookies.get("token");

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Setup a link for action cable
const cable = ActionCable.createConsumer("ws://"+ backendHostName + "/cable");
const actionCableLink = new ActionCableLink({ cable });

// Redirect subscriptions to the action cable link, while using the HTTP link for other queries
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  },
  actionCableLink,
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
       fetchPolicy: 'network-only',
       errorPolicy: 'all'
    }
  }
});
