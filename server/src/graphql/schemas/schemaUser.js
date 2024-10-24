const typeDefs = `#graphql
    type User {
        _id: ID!
        name: String!
        username: String!
        email: String!
        followers: [User]
        following: [User]
    }

    type Query {
        users: [User]
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

export default typeDefs;
