import React from 'react';

function EventOptionCard({ icon, title, description, buttonText }) {
  const handleClick = () => {
    const roomName = 'hlw';
    const displayName = 'hassan';
    const domain = 'meet.jit.si';
    const configOverwrite = {
      startWithAudioMuted: true,
      startWithVideoMuted: true,
    };

    const options = {
      roomName,
      width: '100%',
      height: '100%',
      parentNode: document.body,
      configOverwrite,
      userInfo: {
        displayName,
      },
    };

    const url = `https://${domain}/${roomName}`;
    const windowFeatures = "menubar=no,location=no,resizable=yes,scrollbars=yes,status=no";

    window.open(url, '_blank', windowFeatures);

    // Open Jitsi Meet in a new tab with external API options
    const newWindow = window.open("", '_blank', windowFeatures);
    newWindow.document.write(`
      <html>
        <head>
          <script src="https://${domain}/external_api.js"></script>
        </head>
        <body>
          <div id="jitsi-container" style="height: 100vh; width: 100%;"></div>
          <script>
            const api = new JitsiMeetExternalAPI("${domain}", ${JSON.stringify(options)});
          </script>
        </body>
      </html>
    `);
  };

  return (
    <div className="flex flex-col h-[60vh] w-[95%] bg-white shadow-md rounded-lg m-1 p-1 lg:flex-2 sm:flex-1 text-[1vw]">
      <div className="flex flex-col items-center flex-1">
        {icon} {/* This will be the passed icon component */}
        <h3 className="text-[2vw]">{title}</h3>
        <p className="text-[1vw]">{description}</p>
      </div>
      <button
        onClick={handleClick}
        className="flex justify-center text-center text-white bg-[#7d7dc3] text-[1vw] p-2 rounded"
      >
        {buttonText}
      </button>
    </div>
  );
}

export default EventOptionCard;
