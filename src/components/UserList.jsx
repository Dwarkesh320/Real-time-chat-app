import React from 'react';
import '../styles/UserList.css';
import { RiRadioButtonLine } from "react-icons/ri";
function UserList({ users, selectedUser, onSelectUser }) {
  return (
    <div className="user-list" style={{  overflowY: 'auto' }}>
      <div className="users">
        {users.length > 0 ? (
          users.map((user) => (
            <div 
              key={user.uid}
              className={`user-item ${selectedUser?.uid === user.uid ? 'selected' : ''}`}
              onClick={() => onSelectUser(user)}
            > 
              <div className="user-avatar">
                {user.photoURL ? (
                  <img src={user.photoURL || <RiRadioButtonLine className='onlineusers' /> } alt={user.displayName} className="user-image" />
                ) : (
                  <div className="avatar-fallback">
                    {user.displayName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-info">
                <div className="user-name">{user.displayName}</div>
                <div className="user-status">{user.status !=='Online'||user.status == 'Ofline' || <RiRadioButtonLine className='onlineusers' />}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-users">No users available</div>
        )}
      </div>
    </div>
  );
}

export default UserList;