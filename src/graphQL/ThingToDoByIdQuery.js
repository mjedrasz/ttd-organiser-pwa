import { gql } from 'apollo-boost';

export default gql`
query thingToDoById($id: ID!) {
  thingToDoById(id: $id) {
        __typename
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
            bookingMandatory
            adultMandatory
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
              imageUri
              name
              key
              bucket
              region
            }
            category
        } 
}`;