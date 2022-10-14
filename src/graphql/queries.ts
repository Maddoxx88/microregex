import { gql } from "@apollo/client";

export const PATTERNS = gql`
query {
    patterns {
        name
        description
        tags
        content
        preview
    }
}
`

export const PATTERNS_LIKE = gql`
query getPatternsLike($name: String){
    patterns(where: {name: {_ilike: $name}}) {
      name
      description
      tags
      preview
      content
    }
  }
`

export const PATTERNS_AND_TAGS_Q = gql`
query getPatterns($where: patterns_bool_exp) {
  patterns(where: $where) {
    name
    description
    tags
    content
    preview
  }
}
`
