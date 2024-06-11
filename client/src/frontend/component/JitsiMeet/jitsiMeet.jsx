// src/components/JitsiMeet/JitsiMeet.js

import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const JitsiMeet = () => {
  const { roomName } = useParams();
  const jitsiContainerRef = useRef(null);

  useEffect(() => {
    const loadJitsiScript = () => {
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = initializeJitsiMeet;
      document.body.appendChild(script);
    };
    const url = `https://${domain}/${roomName}`;
    const windowFeatures = "menubar=no,location=no,resizable=yes,scrollbars=yes,status=no";
    window.open(url, '_blank', windowFeatures);
    
    const initializeJitsiMeet = () => {
      const domain = 'meet.jit.si';
      const options = {
        roomName,
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: 'Moderator',
        },
        configOverwrite: {
          enableWelcomePage: false,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen', 'fodeviceselection',
            'hangup', 'profile', 'chat', 'recording', 'etherpad', 'sharedvideo', 'settings',
            'raisehand', 'videoquality', 'filmstrip', 'stats', 'shortcuts', 'tileview', 'videobackgroundblur',
            'download', 'help', 'mute-everyone', 'e2ee'
          ],
        },
      };
      const api = new window.JitsiMeetExternalAPI(domain, options);

      api.addEventListener('videoConferenceJoined', () => {
        api.executeCommand('password', 'your_password'); // Set a password for the room
        api.executeCommand('moderator', 'true'); // Make the creator the moderator
      });

      api.addEventListener('participantRoleChanged', (event) => {
        if (event.role === 'moderator') {
          api.executeCommand('password', 'your_password'); // Ensure the moderator can manage the room
        }
      });
    };

    if (window.JitsiMeetExternalAPI) {
      initializeJitsiMeet();
    } else {
      loadJitsiScript();
    }

    return () => {
      if (window.JitsiMeetExternalAPI) {
        window.JitsiMeetExternalAPI.dispose();
      }
    };
  }, [roomName]);

  return <div ref={jitsiContainerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default JitsiMeet;
