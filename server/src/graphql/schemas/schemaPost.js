const typeDefs = `#graphql
    type Post {
        _id: ID
        content: String!
        tags: [String]
        imgUrls: String
        authorId: ID!
        author: Author
        comments: [Comment]
        likes: [Like]
        createdAt: String
        updatedAt: String
    }

    type Author {
        username: String!
        name: String!
    }

    type Comment {
        content: String!
        username: String!
        createdAt: String
        updatedAt: String
    }

    type Like {
        username: String!
        createdAt: String
        updatedAt: String
    }

    type Query {
        getPosts: [Post]
        getPostById(id: ID!): Post
    }

    input createPost {
        content: String!
        tags: [String]
        imgUrls: String
    }

    type Mutation {
        createPost(input: createPost!): Post!
        commentPost(postId: ID!, content: String!): Post!
        likePost(postId: ID!): Post!
    }
`;

export default typeDefs;
