import React, { useRef, useState } from 'react';

function GoLiveCard() {
  const jitsiContainerRef = useRef(null);
  const [roomName ,setRoomName] = useState('')
  const [EventTitle ,setEventTitle] = useState('')
   
  const handleClick = () => {
    const displayName = 'sulman';
    const email = '201400052@gift.edu.pk';
    const password = 'hasmal12';
    const domain = 'meet.jit.si'; // Replace with your Jitsi Meet domain

    const configOverwrite = {
      startWithAudioMuted: true,
      startWithVideoMuted: false,
    };

    const options = {
      roomName,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      configOverwrite,
      userInfo: {
        displayName: displayName,
      },
    };

    const url = `https://${domain}/${roomName}`;
    const windowFeatures = "menubar=no,location=no,resizable=yes,scrollbars=yes,status=no";
    window.open(url, '_blank', windowFeatures);
    
    const newWindow = window.open("", '_blank', windowFeatures);
    newWindow.document.write(`
      <html>
        <head>
          <title>Jitsi Meeting</title>
          <script src="https://${domain}/external_api.js"></script>
        </head>
        <body>
          <div id="jitsi-container" style="height: 100vh; width: 100%;"></div>
          <script>
            window.onload = () => {
              const api = new JitsiMeetExternalAPI("${domain}", ${JSON.stringify(options)});
              api.addEventListener('videoConferenceJoined', () => {
                api.executeCommand('displayName', '${displayName}');
                api.executeCommand('email', '${email}');
                api.executeCommand('password', '${password}');
                // Set the user as moderator
                api.executeCommand('password', '${password}');
              });

              api.addEventListener('participantRoleChanged', (event) => {
                if (event.role === 'moderator') {
                  // Special rights: moderator commands
                  // Example command to kick participant
                  api.executeCommand('kickParticipant', '<participantID>');
                  // Example command to mute participant
                  api.executeCommand('muteParticipant', '<participantID>');
                  // Add more commands as needed
                }
              });
            };
          </script>
        </body>
      </html>
    `);
  };

  return (
    <div className="flex flex-col h-[60vh] w-[95%] bg-white shadow-md rounded-lg m-1 p-1 lg:flex-2 sm:flex-1 text-[1vw]">
      <div className="flex flex-col items-center flex-1">
        {/* {icon} This will be the passed icon component */}
        <h3 className="text-2xl text-[#7d7dc3] antialiased font-bold m-2">Golive</h3>
        <p className="text-l m-2">Go live by yourself or with others</p>
       
        <input 
        value={EventTitle}
        onChange={(e) => setEventTitle(e.target.value)}
        type="text" placeholder='Title of event' className='flex text-center flex-col m-2 h-[5vh] w-[80%] justify-center items-center border border-[#7d7dc3] rounded' />

        <input 
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        type="text" placeholder='Enter your room name' className='flex text-center flex-col m-2 h-[5vh] w-[80%] justify-center items-center border border-[#7d7dc3] rounded' />
       
      </div>
      <button
        onClick={handleClick}
        className="flex justify-center text-center text-white bg-indigo-500 text-[1vw] p-2 rounded hover:bg-indigo-600"
      >
        GoLive
      </button>
    </div>
  );
}

export default GoLiveCard;
