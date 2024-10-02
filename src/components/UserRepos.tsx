import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

interface Repository {
  name: string;
  description: string | null;
  url: string;
}

interface UserReposData {
  user: {
    repositories: {
      edges: Array<{
        node: Repository;
      }>;
      pageInfo: {
        endCursor: string | null;
        hasNextPage: boolean;
      };
    };
  };
}

interface UserReposVars {
  username: string;
  after?: string | null;
}

const GET_USER_REPOS = gql`
  query GetUserRepos($username: String!, $after: String) {
    user(login: $username) {
      repositories(first: 10, after: $after, orderBy: { field: NAME, direction: ASC }) {
        edges {
          node {
            name
            description
            url
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

const UserRepos: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [cursor, setCursor] = useState<string | null>(null);

  // Ensure useQuery is always called, even if `username` doesn't exist
  const { loading, error, data, fetchMore } = useQuery<UserReposData, UserReposVars>(GET_USER_REPOS, {
    variables: { username: username || '', after: cursor }, // Pass a default empty string for username
    skip: !username, // Skip the query if username is undefined
    notifyOnNetworkStatusChange: true,
  });

  const loadMore = () => {
    if (data?.user.repositories.pageInfo.hasNextPage) {
      fetchMore({
        variables: { after: data.user.repositories.pageInfo.endCursor },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;
          return {
            user: {
              ...prevResult.user,
              repositories: {
                ...fetchMoreResult.user.repositories,
                edges: [
                  ...prevResult.user.repositories.edges,
                  ...fetchMoreResult.user.repositories.edges,
                ],
              },
            },
          };
        },
      });
    }
  };

  if (!username) return <p>No username provided.</p>; // Handle case when username is not provided

  if (loading && !data) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Repositories of {username}</h2>
      <ul>
        {data?.user.repositories.edges.map(({ node }: { node: Repository }) => (
          <li key={node.name}>
            <Link to={`/user/${username}/repo/${node.name}`}>{node.name}</Link>
            <p>{node.description}</p>
          </li>
        ))}
      </ul>
      {data?.user.repositories.pageInfo.hasNextPage && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
};

export default UserRepos;
