// src/components/UserList.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface User {
  node: {
    login: string;
    avatarUrl: string;
    url: string;
  };
}

interface Props {
  users: User[];
}

const UserList: React.FC<Props> = ({ users }) => {
  return (
    <ul>
      {users.map(({ node }) => (
        <li key={node.login}>
          <img src={node.avatarUrl} alt={node.login} width={50} />
          <Link to={`/user/${node.login}`}>{node.login}</Link>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
