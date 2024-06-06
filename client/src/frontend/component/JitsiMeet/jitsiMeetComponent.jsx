import React, { useEffect } from 'react';

const JitsiMeetComponent = ({ roomName, displayName }) => {
  useEffect(() => {
    const domain = 'meet.jit.si';
    const options = {
      roomName,
      width: '100%',
      height: '100%',
      parentNode: document.getElementById('jitsi-container'),
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: true,
      },
      userInfo: {
        displayName,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'desktop', 'fullscreen',
          'fodeviceselection', 'profile', 'chat', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
          'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
        ],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        DEFAULT_REMOTE_DISPLAY_NAME: 'Fellow Jitster',
        DEFAULT_LOCAL_DISPLAY_NAME: 'me',
        LANG_DETECTION: true,
        INVITATION_POWERED_BY: true,
      },
    };
    const api = new window.JitsiMeetExternalAPI(domain, options);

    return () => api.dispose();
  }, [roomName, displayName]);

  return <div id="jitsi-container" style={{ height: '100vh', width: '100%' }} />;
};

export default JitsiMeetComponent;
