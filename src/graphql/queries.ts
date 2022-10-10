import { gql } from "@apollo/client";

export const PATTERNS = gql`
query {
    patterns {
        name
        description
        tags
        content
        id
    }
}
`

export const PATTERNS_LIKE = gql`
query getPatternsLike($name: String){
    patterns(where: {name: {_ilike: $name}}) {
      name
      description
      tags
      id
      content
    }
  }
`
