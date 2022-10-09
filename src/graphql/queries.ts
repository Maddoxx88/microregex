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
