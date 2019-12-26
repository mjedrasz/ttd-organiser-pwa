import { gql } from 'apollo-boost';

export default gql`
mutation UpdateThingToDo($id: ID!, $thingToDo: ThingToDoInput!) {
  updateThingToDo(
    input: {
      id: $id
      thingToDo: $thingToDo
    }
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
          name
          imageUri
        }
        category
  }
}`;