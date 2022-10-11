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

export const PATTERNS_AND_TAGS = gql`
query getPatternsAndTags($name: String) {
  patterns(
  where: {
    _and: [{ name: { _ilike: "%%" } }, { tags: { _contains: ["auth", "finance"] } }]
  }
){
    name
    description
    tags
  }
}
`
