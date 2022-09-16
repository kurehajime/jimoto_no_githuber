const functions = require('@google-cloud/functions-framework');

functions.http('githubUsers', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    global.fetch = require("node-fetch");
    const { ApolloClient, InMemoryCache, gql } = require("@apollo/client/core");
    const searchQuery = gql`
    query ($location: String!,$cursor: String){
      search(query: $location, type: USER, first: 20,after:$cursor) {
        pageInfo {
          startCursor
          hasNextPage
          endCursor
        }
        userCount
        edges {
          node {
            ... on User {
              login
              company
              twitterUsername
              avatarUrl
              bio
              websiteUrl
            }
          }
        }
      }
    }
  `;
    const apolloClient = new ApolloClient({
      uri: "https://api.github.com/graphql",
      headers: { authorization: `Bearer ${process.env.GHTOKEN}` },
      cache: new InMemoryCache(),
    });
    async function search() {
      console.log("q:")
      console.log(req.query)
      const searchResult = await apolloClient
        .query({
          query: searchQuery, variables: {
            location: `location:${req.query.pref} type:user`,
            cursor: req.query.cursor === "" ? null : req.query.cursor
          }
        })
        .then((result) => {
          return result;
        })
        .catch((error) => {
          console.log(error);
        });
      return JSON.stringify(searchResult, undefined, 2);
    }
    const response = await search();
    res.send(response);
  }
});
