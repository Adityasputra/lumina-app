import { gql } from "@apollo/client";

export const Register = gql`
  mutation Mutation($input: register!) {
    register(input: $input) {
      _id
      name
      username
      email
      followers {
        _id
      }
      following {
        _id
      }
    }
  }
`;

export const Login = gql`
  mutation Mutation($input: login!) {
    login(input: $input) {
      access_token
    }
  }
`;
