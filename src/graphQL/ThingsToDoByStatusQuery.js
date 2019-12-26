import { gql } from 'apollo-boost';

export default gql`
query ThingsToDoByStatus($status: ThingToDoStatus!, $after: String) {
  thingsToDoByStatus(status: $status, first: 8, after: $after) {
    __typename
    edges {
        node {
            id
            name
            description
            image {
              imageUri
              name
            }
        }   
    }  
    pageInfo {
      hasNextPage
      endCursor
    }     
  }   
}`;   