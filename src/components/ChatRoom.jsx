import React, { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import {collection,query,orderBy,onSnapshot,addDoc,serverTimestamp,where,updateDoc,doc,setDoc,getFirestore, limit,deleteDoc} from 'firebase/firestore';
import { auth, db } from '../firebase';
import UserList from './UserList';
import ChatMessages from './ChatMessage';
import ChatList from './ChatList';
import '../styles/ChatRoom.css';
import { useNavigate, } from 'react-router-dom';
import { RiRadioButtonLine } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";

//icons//
import { AiOutlineUser } from "react-icons/ai";    
import { IoLogOutOutline } from "react-icons/io5"; 
import { IoCallOutline } from "react-icons/io5";
import { CiVideoOn } from "react-icons/ci";
import { IoMdMore } from "react-icons/io";
import {LuSend} from "react-icons/lu";
  //buttons//
 import { Dropdown,Button } from 'antd';
//import userProfile from './userProfile';
import {Menu,MenuHandler,MenuList,MenuItem,} from "@material-tailwind/react";
import { MdBlockFlipped } from "react-icons/md";

/// calls components //
import AudioCall from './streming/AudioCall';
import VideoCall from './streming/VideoCall';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import usersData from "../components/users.json"; // Adjust the path based on your project

function ChatRoom({ user }) {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [ setisBlock] = useState(false);

  const messageInputRef = useRef(null);
  const dummy = useRef();
  const navigate = useNavigate();
  const { userId } = useParams(usersData.users.id);

 // const [isOpen, setisOpen] = useState(false);
  //const toggleMenu = () => setisOpen(!isOpen);

  // const handleclick = () => {
  //   navigate('/userProfile');
  //  };

   

  const gotoUserProfile = () => {
    navigate(`/userprofile/:${selectedUser.uid}`);
    
    // navigate('/userProfile', { state: { userId: selectedUser.uid } });
    // setSelectedUser(users.filter((user) => user.uid === selectedUser.uid)[0]);
   
  };

  const handleBlockUser = async () => {
    const userRef = doc(db, 'users', selectedUser.uid);
    await updateDoc(userRef, {
      isBlocked: true,
    })
    setisBlock(true);
    console.log('User blocked successfully!');
  };
  
  // const onMenuClick = e => {
  //   console.log('click', e);

  // };

  const handleDeleteChat = async (e) => {
    e.preventDefault();
    try{
    const chatRef = doc(db, 'chats', chatId);
    await deleteDoc(chatRef);
    }catch (error) {
      console.error("error hendling ",error)
    }
  };



  const items = [
    {
      key:1,
      label: " 🙍‍♂️ User Info",
      onClick: () => gotoUserProfile() ,

      
      // Navigate to user profile page
    //   onClick: handleclick,  
          

    },
    {
      key:2,
      label: "✅ Select message",
      
    },
    {
      key:3,
      label:"🕗 Disappearing msg",
      
      
    },
    {
      key:4,
      label:"❌ Close chat",
      onClick: () => navigate(0),
      

    },
    {
      key:5,
      label: "🚫 Block user" ,
      onClick: () => {
        handleBlockUser();
        setisBlock(true);
      },
    },
    {
      key:6,
      label:"⛔  Clear chat",
      onClick: () => {
        setMessages([]);
      }

    },
    {
      key:7,  
      label:"🗑  Delete chat",
      onClick: () => {
        handleDeleteChat();
        setMessages([]);
      }
    }

  ]


  useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '!=', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('createdAt'),limit(25));
    
    const unsubscribe = onSnapshot(q, snapshot => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messages);
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    });

    const updateUserStatus = async () => {
      const db = getFirestore();
      await updateDoc(doc(db, "users", user.uid), {
        status: "Online",
        lastSeen: serverTimestamp()
      });
    };
    updateUserStatus();
    
    return unsubscribe;
  }, [user.uid]);



  useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '!=', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!selectedUser) return;

    const getChatId = () => {
      const ids = [user.uid, selectedUser.uid].sort();
      return `${ids[0]}_${ids[1]}`;
    };

    const newChatId = getChatId();
    setChatId(newChatId);

    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('chatId', '==', newChatId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(messageList);

      const unreadMessages = messageList.filter(
        (msg) => msg.receiverId === user.uid && !msg.readAt
      );

      if (unreadMessages.length > 0) {
        unreadMessages.forEach(async (msg) => {
          await updateDoc(doc(db, 'messages', msg.id), {
            readAt: serverTimestamp(),
          });
        });
      }

      setTimeout(() => {
        if (dummy.current) {
          dummy.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });

    return () => unsubscribe();
  }, [selectedUser, user]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMessages([]);
    setActiveTab('chat');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedUser || !chatId) return;

    try {
      const chatRef = doc(db, 'chats', chatId);
      await setDoc(
        chatRef,
        {
          participants: [user.uid, selectedUser.uid],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await addDoc(collection(db, 'messages'), {
        chatId,
        text: newMessage,
        senderId: user.uid,
        senderName: user.displayName,
        receiverId: selectedUser.uid,
        receiverName: selectedUser.displayName,
        createdAt: serverTimestamp(),
        sentAt: serverTimestamp(),
        readAt: null,
      });

      await updateDoc(chatRef, {
        lastMessage: {
          text: newMessage,
          senderId: user.uid,
          timestamp: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      });

      setNewMessage('');
      setIsTyping(false);
      messageInputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };



     
      
  return (
    <div className="chat-room">
      <header className="chat-header">
        <h1> ChatsApp</h1>
        <div className="user-info">
          <span>🙏, {user.displayName}</span>
          
          <button className="logout-btn" onClick={handleLogout}>
            <IoLogOutOutline style={{fontSize:"25px"}} />
          </button>
        </div>
      </header>

      <div className="chat-container">
        <div className="sidebar">
          <div className="sidebar-tabs">
            <button
              className={activeTab === 'users' ? 'active' : ''}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button
              className={activeTab === 'chats' ? 'active' : ''}
              onClick={() => setActiveTab('chats', )
                
              }
            >
              Chats
            </button>
          </div>

          {activeTab === 'users' ? (
            <UserList
              users={users}
              selectedUser={selectedUser}
              onSelectUser={handleSelectUser}
            />
          ) : (
            <ChatList
              currentUser={user}
              setActiveChat={({ user }) => {
                setSelectedUser(user);
                setActiveTab('chat');
              }}
            />
          )}
        </div>

        <div className="chat-main">
        
          {selectedUser ? (
            <>
              <div className="chat-user-header">
                
                {selectedUser.photoURL ? (
                  <h1>
                     <p className='' style={{}}>
                  <img
                  src={selectedUser.photoURL}
                  alt={selectedUser.displayName}
                  className="user-image"  

                  />
                  {selectedUser.status == 'Online'  &&  <RiRadioButtonLine className='onlinedot' style={{color:" #4caf50" , fontSize:"15px",marginBottom:"10px"}} />}
                  </p>

                  <p> {selectedUser.displayName }</p>
                
                  </h1>
                  
                ) : selectedUser.displayName ? (
                  <div className="avatar-fallback">
                    {selectedUser.displayName.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="avatar-fallback">
                    {selectedUser.displayName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="call-icons" style={{display:"flex",gap:"25px"}}>
                 <Link to="/audioCall" target="_blank"> <IoCallOutline style={{color:"aqua",fontSize:"25px"}} /></Link>
                 <Link to="/videoCall" target='_blank'> <CiVideoOn style={{color:"aqua",fontSize:"25px"}} /></Link> 
                 <div style={{display:"flex",backgroundColor:"none",borderRadius:"5px"}}> 
                          {/* <Dropdown.Button menu={{items, onClick: onMenuClick}}  placement="bottomRight" type="primary" variant="solid" >
                            More
                            
                        </Dropdown.Button> */}

              <Menu
                    animate={{
                      mount: { y: 0 },
                      unmount: { y: 25 },
                    }} >
                    <MenuHandler className=" text-white " >
                      <IoMdMore className='font-auto border-none' style={{fontSize:"30px"}}/>
                    </MenuHandler>
                    
                    <MenuList className='bg-white w-40 border-none ml-4 p-2.5 ' >
                           
                      {
                        items.map((item) => (
                          <MenuItem key={item.key} onClick={item.onClick} className="bg-black text-white hover:bg-[#075e54] m-2 hover:border-none" style={{border:"none"}}>
                            <p></p>
                           <Link to=""> <p className='hover:bg-[#075e54] w-full z-30 rounded-none'>{item.icons} {item.label}</p>
                          
                           </Link>
                           
                            {/* {
                              item.key === 1 && (
                                <div className="user-profile" onClick={gotoUserProfile}>
                                 
                                  <span>{selectedUser.displayName}</span>
                                </div>
                              )
                            } */}
                          </MenuItem>
                        ))
                      }
                    </MenuList>
                  </Menu>
                      
              </div>   
                        

                </div>
                {isTyping && <div className="typing-indicator">typing...</div>}
              
              </div>

              <ChatMessages messages={messages} currentUser={user} />

              <form className="message-form" onSubmit={handleSendMessage}>
                <input
                  type="text" 
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder="Type a message..."
                  ref={messageInputRef}
                  required
                />
                  

                <button type="submit"><LuSend /></button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <p>Select a user to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatRoom; 
