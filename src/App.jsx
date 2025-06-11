import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ChatRoom from './components/ChatRoom';
import '../src/App.css';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import AudioCall from './components/streming/AudioCall';
import VideoCall from './components/streming/VideoCall';
import UserProfile from './components/userProfile';
function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div className="loading">Wellcome..</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <ChatRoom user={user} /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/userprofile/:userId" element={<UserProfile />} />
        <Route path='/audiocall' element={user ? <AudioCall/>: <Navigate to="/"/>}/>
        <Route path='/videocall' element={user ? <VideoCall/>: <Navigate to="/"/>}/>
      </Routes>
    </Router>
  );
}

export default App;
