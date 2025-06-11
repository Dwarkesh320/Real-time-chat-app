import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './AudioCall.module.css';
import { MdKeyboardVoice } from "react-icons/md";
import { BsFillMicMuteFill } from "react-icons/bs";
import UserList from '../UserList';

const AudioCall = () => {
  const { собеседникId } = useParams();
  const navigate = useNavigate();
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true); // Track microphone access

  // count up timer //
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    console.log(`Initiating audio call with user: ${собеседникId} (Web - Styled)`);

    const enableMicrophone = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (localAudioRef.current) {
          localAudioRef.current.srcObject = localStream;
        }
        setIsMicEnabled(true);
        setIsRunning(true); // Start timer after mic is enabled
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setIsMicEnabled(false);
        // Optionally display an error message to the user
      }
    };

    enableMicrophone();

    return () => {
      console.log('Audio call ended (Web - Styled).');
      if (localAudioRef.current?.srcObject) {
        localAudioRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      setIsRunning(false); // Ensure timer stops on unmount
    };
  }, [собеседникId]);

  useEffect(() => { 

    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 59) {
            setMinutes((prevMinutes) => prevMinutes + 1);
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
    if (isMicEnabled) {
      setIsMuted(!isMuted);
      if (localAudioRef.current?.srcObject) {
        localAudioRef.current.srcObject.getAudioTracks().forEach(track => {
          track.enabled = !isMuted;
        });
      }
      console.log('Mute toggled (Web - Styled):', !isMuted);
    } else {
      console.log('Microphone is disabled.');
      // Optionally inform the user that the microphone is disabled
    }
  };

  const handleendCall = () => {
    if (localAudioRef.current?.srcObject) {
      localAudioRef.current.srcObject.getAudioTracks().forEach(track =>{
          track.stop();
      });
    }
    setIsRunning(false);
    setIsMicEnabled(false); // Disable microphone access on call end
    console.log('Hanging up call (Web - Styled).', isMuted);

    // --- SEND HANG UP SIGNAL ---
    navigate('/');
  };

  // Function to re-enable microphone access
  const enableMicAfterEnd = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = localStream;
      }
      setIsMicEnabled(true);
      console.log('Microphone access re-enabled.');
      // Optionally restart the timer if needed: setIsRunning(true);
    } catch (error) {
      console.error('Error re-enabling microphone:', error);
      setIsMicEnabled(false);
      // Optionally display an error message
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Audio Call</h3>
        <img src="https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?semt=ais_hybrid&w=740" alt="" style={{borderRadius:"40px",width:"350px"}} />
      <div className={styles.timer}>
        {formatTime(minutes)}:{formatTime(seconds)}
      </div>
      <div className={styles.audioContainer}>
        <audio ref={localAudioRef} autoPlay muted={!isMicEnabled || isMuted} /> {/* Control muted based on mic enabled state */}
        <audio ref={remoteAudioRef} autoPlay />
      </div>
      <div className={styles.controls}>
        <button className={styles.button} onClick={toggleMute} disabled={!isMicEnabled}>
          {isMuted ? <MdKeyboardVoice   style={{color:"black",fontSize:"20px"}} /> : <BsFillMicMuteFill style={{color:"black",fontSize:"20px"}} /> }
        </button>
        <button className={`${styles.button} ${styles.hangUpButton}`} onClick={handleendCall}>
          Call Ended
        </button>
        {!isMicEnabled && (
          <button className={styles.button} onClick={enableMicAfterEnd}>
            Enable Microphone
          </button>
        )}
      </div>
    </div>
  );
};

export default AudioCall;