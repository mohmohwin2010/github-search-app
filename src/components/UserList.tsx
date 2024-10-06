// src/components/UserList.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
// import './css/UserList.css'; 

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
  
  return (
    // <div className="user-list-container">
      
    //   <div className="users-section">
    //     <h2 className='text-left'>Users</h2>
    //     <div className="users-list">
    //       {users.map(({ node }) => (
            
    //         <div className="user-card" key={node.login} onClick={() => onUserClick(node.login)} style={{ cursor: 'pointer' }}>
    //           <img src={node.avatarUrl} alt={node.login} className="user-avatar" />
    //           <Link to={`/user/${node.login}`} className="user-name">
    //             {node.login}
    //           </Link>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </div>
    <div className="user-list-container">
      <div className="users-section">
        <h2 className='text-left'>Users</h2>
        <div className="d-flex flex-wrap justify-content-center"> {/* Use flexbox to arrange cards */}
          {users.map(({ node }) => (
            <div className="card m-2" key={node.login} style={{ width: '100px', cursor: 'pointer' }} onClick={() => onUserClick(node.login)}>
              <img src={node.avatarUrl} alt={node.login} className="card-img-top" />
              <div className="card-body text-center">
                <Link to={`/user/${node.login}`} className="card-title user-name text-decoration-none">
                  {node.login}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
