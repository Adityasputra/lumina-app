const typeDefs = `#graphql
    type User {
        _id: ID!
        name: String!
        username: String!
        email: String!
        followers: [User]
        following: [User]
    }

    input register {
        name: String!
        username: String!
        email: String!
        password: String!
    }

    type Mutation {
        register(input: register!): User!
    }
`;
