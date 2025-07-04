// Popup script for the extension
document.addEventListener('DOMContentLoaded', () => {
  const activateBtn = document.getElementById('activateBtn') as HTMLButtonElement;
  
  if (activateBtn) {
    activateBtn.addEventListener('click', async () => {
      try {
        // Get the current active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (tab.id) {
          // Execute script in the current tab
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              // This function runs in the context of the web page
              const button = document.querySelector('.github-helper-btn') as HTMLButtonElement;
              if (button) {
                button.click();
              } else {
                // If button doesn't exist, create it
                const event = new CustomEvent('githubHelperActivate');
                document.dispatchEvent(event);
              }
            }
          });
        }
      } catch (error) {
        console.error('Error activating helper:', error);
      }
    });
  }

  // Check if we're on a GitHub page
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
    const currentTab = tabs[0];
    const isGitHub = currentTab.url?.includes('github.com');
    
    const statusText = document.querySelector('.status-text') as HTMLElement;
    const statusIndicator = document.querySelector('.status-indicator') as HTMLElement;
    
    if (statusText && statusIndicator) {
      if (isGitHub) {
        statusText.textContent = 'Extension is active on GitHub';
        statusIndicator.style.background = '#2ea44f';
        if (activateBtn) {
          activateBtn.disabled = false;
        }
      } else {
        statusText.textContent = 'Navigate to GitHub to use this extension';
        statusIndicator.style.background = '#656d76';
        if (activateBtn) {
          activateBtn.disabled = true;
        }
      }
    }
  });
}); 