import { activeClarityMode } from "./mode";

// GitHub uses client-side routing, so we need to observe for navigation changes
let currentUrl = window.location.href;

const observer = new MutationObserver(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    // Recreate button on navigation
    setTimeout(() => load(), 100);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Wait for the page to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => load());
} else {
  load();
}

function load() {
  //-- create activation button --
  const buttonContainer = document.querySelector('.pr-review-tools');
  if (!buttonContainer) return
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = `
    <div class="diffbar-item dropdown js-reviews-container ml-2">
      <a aria-label="Activate ClarityPR" data-view-component="true" class="Button--secondary Button--small Button d-inline-flex mr-2">
        <span class="Button-content">
          <span class="Button-label">View with ClarityPR</span>
        </span>
      </a>
    </div>
  `;
  const button = tempDiv.firstElementChild;
  if (!button) return;
  buttonContainer.appendChild(button);
  button.addEventListener('click', () => {
    activeClarityMode();
  });
}