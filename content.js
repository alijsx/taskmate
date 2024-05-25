function setVolume(volume) {
    const mediaElements = document.querySelectorAll('video, audio');
    mediaElements.forEach(media => {
      // Calculate the boosted volume
      const boostedVolume = Math.min(1, media.volume * volume);
      media.volume = boostedVolume;
      media.dataset.boostedVolume = boostedVolume; // Store boosted volume
    });
  }
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'setVolume') {
      setVolume(request.volume);
      sendResponse({ status: 'volume set' }); // Send response back to the popup
    }
  });
  