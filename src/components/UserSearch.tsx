// src/components/UserSearch.tsx
import React, { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import './css/SearchBar.css'; 
import UserList from './UserList';
import RepoList from './RepoList';
import UserRepos from './UserRepos';

const SEARCH_USERS = gql`
  query SearchUsers($query: String!) {
    search(query: $query, type: USER, first: 10) {
      edges {
        node {
          ... on User {
            login
            avatarUrl
            url
          }
        }
      }
    }
  }
`;

const USER_REPOS = gql`
  query UserRepos($login: String!, $after: String) {
    user(login: $login) {
      repositories(first: 5, after: $after) {
        edges {
          node {
            name
            url
            stargazerCount
            watchers {
              totalCount
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

const UserSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchUsers, { loading, data, error }] = useLazyQuery(SEARCH_USERS);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [fetchRepos, { data: repoData, loading: loadingRepos, error: repoError }] = useLazyQuery(USER_REPOS);

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      searchUsers({ variables: { query: searchTerm } });
      setSelectedUser(null); // Reset selected user when searching
    }
  };

  const handleUserClick = (login: string) => {
    if (selectedUser === login) {
      // If the user is already selected, deselect them
      setSelectedUser(null);
    } else {
      setSelectedUser(login);
      fetchRepos({ variables: { login } });
    }
  };

  return (
    <div className="user-list-container">
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search GitHub Users"
          aria-label="Search GitHub Users"
        />
        <button onClick={handleSearch} aria-label="Search">
          Search
        </button>
      </div>

      {loading && <p>Loading users...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <UserList users={data.search.edges} onUserClick={handleUserClick} />}

      {selectedUser && (
        <div>
          <h2>MMK Repositories for {selectedUser}</h2>
          {loadingRepos && <p>Loading repositories...</p>}
          {repoError && <p>Error: {repoError.message}</p>}
          {repoData && (
            <UserRepos repositories={repoData.user.repositories.edges} />
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
