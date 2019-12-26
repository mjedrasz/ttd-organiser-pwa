import { gql } from 'apollo-boost';

export default gql`
mutation CreateThingToDo($input: ThingToDoInput!) {
  createThingToDo(
    input: $input
  ) {
        id
        name
        description
        type
        where {
          __typename
          location {
            __typename
            lat
            lon
          }
          address
        }
        when {
          __typename
          dateTime {
            __typename
            from
            to
          }
          occurrences {
              __typename
                dayOfWeek
                hours {
                    from
                    to
                }
          }
        }
        contact {
          __typename
          email
          phone
          www
        }
        price {
            __typename
            from
            to
        }
        target {
          __typename
          age {
            __typename
            from
            to
          }
          type
        }
        image {
          __typename
          key
          bucket
          region
        }
        category
  }
}`;