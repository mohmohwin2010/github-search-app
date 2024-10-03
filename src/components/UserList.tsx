// src/components/UserList.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './css/UserList.css'; 

interface User {
  node: {
    login: string;
    avatarUrl: string;
    url: string;
  };
}

interface Props {
  users: User[];
  onUserClick: (login: string) => void;
}

const UserList: React.FC<Props> = ({ users, onUserClick }) => {
  
  console.log(users);
  return (
    <div className="user-list-container">
      
      <div className="users-section">
        <h2>Users</h2>
        <div className="users-list">
          {users.map(({ node }) => (
            
            <div className="user-card" key={node.login} onClick={() => onUserClick(node.login)} style={{ cursor: 'pointer' }}>
              <img src={node.avatarUrl} alt={node.login} className="user-avatar" />
              <Link to={`/user/${node.login}`} className="user-name">
                {node.login}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
