import React, { useState } from "react";
import usersData from "./users.json"; // Adjust the path based on your project
import  "../styles/UserProfile.css"


const UserProfile = () => {
  // Filter users with a defined status
  const [selectedUserId, setSelectedUserId] = useState(usersData.users[0].id);
  const filteredUser = usersData.users.filter(user => user.id === selectedUserId);


  return (
    <div className="user-profile-wrapper">
      <div>
        
        {
        usersData.users.map(user => (
          <div
            key={user.id}
            onClick={() => setSelectedUserId(user.id === selectedUserId ? null : user.id)}
            className={`user-item ${selectedUserId === user.id ? 'user-item-selected' : ''}`}
          >
            <h1>{user.displayName}</h1>
          </div>
        ))}
      </div>
  
      <div className="user-profile-container">
        <h3 style={{color:"white"}}>User Profile</h3> 
        {filteredUser.length > 0 ? (
          <div className="profile-info" style={{alignItems:"center",justifyContent:"center", gap:"10px"}}>
            <img src={filteredUser[0].photoURL} alt="" className="profile-image" style={{alignItems:"center",justifyContent:"center"}} />
            <h1 style={{fontSize:"20px"}} className="text-lg leading-6 tracking-wide"> {filteredUser[0].displayName}</h1>
            <p style={{color:"#39eb62"}}><u>{filteredUser[0].email}</u></p>
            <p style={{color:"#39eb62"}}> {filteredUser[0].mobileNo}</p>
            <p> <strong>About :</strong> {filteredUser[0].about}</p>
          </div>
        ) : (
          <p style={{color:"#39eb62"}}>Fething data...</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
