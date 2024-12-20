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
        me: User
        users: [User]
        getUserById(id: ID!): User
        searchUser(keyword: String!): [User]
    }

    type LoginResponse {
        access_token: String!
    }

    input register {
        name: String!
        username: String!
        email: String!
        password: String!
    }

    input login {
        email: String!
        password: String!
    }

    type Mutation {
        register(input: register!): User!
        login(input: login!): LoginResponse!
    }
`;

export default typeDefs;
