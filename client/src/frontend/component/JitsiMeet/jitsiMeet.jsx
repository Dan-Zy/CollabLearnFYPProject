// jitsiSetup.js
export const setupJitsiMeeting = ({ domain, roomName, displayName, email, jitsiContainerRef, configOverwrite, userInfo }) => {
  const options = {
    roomName,
    width: '100%',
    height: '100%',
    parentNode: jitsiContainerRef.current,
    configOverwrite,
    userInfo,
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

            api.addEventListener('videoConferenceLeft', () => {
              window.opener.postMessage('meetingEnded', '*');
              window.close();
            });
          };
        </script>
      </body>
    </html>
  `);
};