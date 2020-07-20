import { ApolloServer, gql } from 'apollo-server-micro'
import * as events from './events';

const typeDefs = gql`
  scalar DateTime
  type Query {
    events(filter: Filter): [Event]
  }
  type Event {
    Title: String!
    Time: DateTime!
    Image: String!
    Location: Location!
    AvailableSeats: [AvailableSeat]!
  }
  type Location {
    City: String!
    State: String!
    Country: String!
  }
  type AvailableSeat {
    id: String!
  }
  input Filter {
    id: Int
    title: String
    description: String
    location: String
    time: String
  }
`

function filterData(filter, resultEvents) {
  if (filter.id != null) {
    return [resultEvents[filter.id]];
  } else {
    if (filter.title) {
      return resultEvents.filter((e) => {
        return e.Title === filter.title
      });
    }
    if (filter.description) {
      return resultEvents.filter((e) => {
        return e.Title.includes(filter.description)
      });
    }
    if (filter.location) {
      return resultEvents.filter((e) => {
        return e.Location.City === filter.location || e.Location.State === filter.location || e.Location.Country === filter.location
      });
    }
    if (filter.time) {
      return resultEvents.filter((e) => {
        return e.Time.includes(filter.time)
      });
    }
  }
}

const resolvers = {
  Query: {
    events(parent, args, context) {
      let resultEvents = events;
      if (args.hasOwnProperty('filter')) {
        resultEvents = filterData(args.filter, resultEvents);
      }
      return resultEvents;
    }
  },
  Event: {
    AvailableSeats: (event, _args, _context) => {
      if (event.hasOwnProperty('AvailableSeats')) {
          return event.AvailableSeats
      } else {
          return [];
      }
    }
  }
}



const apolloServer = new ApolloServer({ typeDefs, resolvers })

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({ path: '/api/graphql' })
