import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './VideoCall.module.css'; 
import ChatRoom from '../ChatRoom'; 
import { MdKeyboardVoice } from "react-icons/md";
import { BsFillMicMuteFill } from "react-icons/bs";
import { CiVideoOn } from "react-icons/ci";
import { FaVideoSlash } from "react-icons/fa6";

import UserList from '../UserList';

const VideoCall = () => {
  const { собеседникId } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  
  // count up timer //
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    console.log(`Initiating video call with user: ${собеседникId} (Web - Styled)`);

    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(localStream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
        // --- SIGNALING LOGIC WILL GO HERE ---
      })
      .catch(error => {
        console.error('Error accessing media devices:', error);
      });
        setIsRunning(true); // Start timer after video is enabled
    return () => {
      console.log('Video call ended (Web - Styled).');
      if (localVideoRef.current?.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      // --- CLEANUP SIGNALING ---
    };
  }, [собеседникId]);



  useEffect(() => {  // --- START/STOP TIMER LOGIC ---
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 59) {
            setMinutes((initialMinutes = 0) => initialMinutes + 0);
            setMinutes((initialMinutes = 0) => initialMinutes + 1);
            setSeconds(0);
            
            return 0;
          }
          return prevSeconds + 1;
        });
      }, 1000);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
    console.log('Mute toggled (Web - Styled):', !isMuted);
  };

  const toggleCamera = () => {
    setIsCameraOff(!isCameraOff);
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getVideoTracks().forEach(track => {
        track.enabled = !isCameraOff;
      });
    }else{

    
    console.log('Camera toggled (Web - Styled):', !isCameraOff);
    }
  };

  const hangUp = () => {
    console.log('Hanging up call (Web - Styled).',);
    // --- SEND HANG UP SIGNAL ---
     if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop = !isCameraOff);
     setIsCameraOff(true);

    setIsRunning(false);

    navigate('/');
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Video Call  {собеседникId}</h3>
      <div className={styles.videoContainer}>
        <video ref={remoteVideoRef} autoPlay className={styles.video} />
        <video ref={localVideoRef} autoPlay muted className={styles.localVideo} />
      </div>
      <div className={styles.timer}>
        {formatTime(minutes)}:{formatTime(seconds)}
      </div>
      <div className={styles.controls}>
        <button className={styles.button} onClick={toggleMute}>
          {isMuted ? <MdKeyboardVoice  style={{color:"black",fontSize:"20px"}} /> : <BsFillMicMuteFill style={{color:"black",fontSize:"20px"}} /> }
        </button>
        <button className={styles.button} onClick={toggleCamera}>
          {isCameraOff ? <CiVideoOn style={{color:"black",fontSize:"20px"}}/> : <FaVideoSlash style={{color:"black",fontSize:"20px"}} />}
        </button>
        <button className={`${styles.button} ${styles.hangUpButton}`} onClick={hangUp}>
          End Call
        </button>
      </div>
    </div>
  );
};

export default VideoCall;