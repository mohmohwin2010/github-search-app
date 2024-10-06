import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

console.log(process.env.REACT_APP_GITHUB_TOKEN);
const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
  headers: {
    // Authorization: `Bearer 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`,
    Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
  },
});
console.log(httpLink);
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
