const typeDefs = `#graphql
    type Follow {
        _id: ID
        followerId: ID
        followingId: ID
        createdAt: String
        updatedAt: String
    }

    type Mutation {
        followUser(followingId: ID!): Follow!
    }
`;

export default typeDefs;
