import React from 'react'
import usersData from "./users.json"; // Adjust the path based on your project
import { useState } from 'react';

const SelectMsg = () => {

  const [selectedUserId, setSelectedUserId] = useState(usersData.users[0].id);
  const filteredUser = usersData.users.filter(user => user.id === selectedUserId);
  const [selectedMsg, setSelectedMsg] = useState(null);


  const handleSelectMsg = (user) => {
    setSelectedMsg(user);
  };
  // const users = [
  //   { uid: '1', displayName: 'User 1', photoURL: '', status: 'Online' },
  //   { uid: '2', displayName: 'User 2', photoURL: '', status: 'Offline' },
  //   { uid: '3', displayName: 'User 3', photoURL: '', status: 'Online' },
  //   { uid: '4', displayName: 'User 4', photoURL: '', status: 'Offline' },
  //   { uid: '5', displayName: 'User 5', photoURL: '', status: 'Online' },
  //   { uid: '6', displayName: 'User 6', photoURL: '', status: 'Offline' },
  //   { uid: '7', displayName: 'User 7', photoURL: '', status: 'Online' },
  //   { uid: '8', displayName: 'User 8', photoURL: '', status: 'Offline' },


  return (
      <div className="select-msg" onClick={handleSelectMsg}>
        <input type="checked" />
        {filteredUser.map(massage => (
             <div key={massage.id} className="user-item">
            <div className="user-info">
              <h4>{massage.displayName}</h4>
              <h1>{massage.text}</h1>
              <p>{massage.status}</p>
            </div>
          </div>
        ))}
    </div>
  )
}

export default SelectMsg
