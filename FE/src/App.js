import React, { Suspense } from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';

import CreateNewNoteCard from './containers/Create/CreateNewNoteCard/CreateNewNoteCard';
import CreateNewStack from './containers/Create/CreateNewStack/CreateNewStack';
import Stacks from './containers/Stacks/Stacks';
import NoteCards from './containers/NoteCards/NoteCards';
import Layout from './components/Layout/Layout';
import Home from './containers/Home/Home';

import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

const cache = new InMemoryCache();
const link = ApolloLink.from([
  new createHttpLink({
    uri: "http://localhost:8082/graphql"
  })
])

const client = new ApolloClient({
  link: link,
  cache: cache
});

const app = (props) => {

  let routes = (
    <Switch>
      <Route path="/stacks" component={Stacks} />
      <Route path="/notecards" component={NoteCards} />
      <Route path="/newstack" component={CreateNewStack} />
      <Route path="/newnotecard" component={CreateNewNoteCard} />
      <Route path="/" exact component={Home} />
      <Redirect to="/" />
    </Switch>

  );
  
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <BrowserRouter>
          <Layout>
            <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
          </Layout>
        </BrowserRouter>
    </div>

    </ApolloProvider>
  );
}

export default app;
