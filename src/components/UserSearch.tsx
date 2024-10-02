// src/components/UserSearch.tsx
import React, { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import UserList from './UserList';

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

const UserSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchUsers, { loading, data, error }] = useLazyQuery(SEARCH_USERS);

  const handleSearch = () => {
    searchUsers({ variables: { query: searchTerm } });
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search GitHub Users"
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <UserList users={data.search.edges} />}
    </div>
  );
};

export default UserSearch;
