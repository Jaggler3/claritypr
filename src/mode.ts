// Constants
const SELECTORS = {
  REVIEWS_TOGGLE: '.js-reviews-toggle',
  REVIEW_CHANGES_MODAL: '#review-changes-modal',
  FILES: '#files',
  CLARITY_PR_TOP_CONTAINER: '#clarity-pr-top-container',
  PROGRESS_BAR_FILL: '.clarity-pr-progress-bar-fill',
  CLOSE_BUTTON: '.clarity-pr-close-button',
  CHECK_BUTTON: '.clarity-pr-check-button',
  BACK_BUTTON: '.clarity-pr-back-button',
  NEXT_BUTTON: '.clarity-pr-next-button',
  JS_FILE: '.js-file',
  DIFF_PROGRESSIVE_CONTAINER: '.js-diff-progressive-container',
  CLARITY_PR_STYLE: '#clarity-pr-style'
} as const;

const STYLES = {
  CLARITY_MODE: `
    header, footer, #partial-discussion-header, diff-file-filter > .tabnav, .file-actions {
      display: none !important;
    }

    .pr-toolbar {
      position: absolute;
      top: -200px !important;
    }

    #review-changes-modal {
      position: fixed;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
    }

    body {
      overflow: hidden;
    }

    .sticky-file-header {
      top: 0;
    }

    #files {
      display: flex;
      padding-left: 32px !important;
    }

    #repo-content-pjax-container > div {
      padding: 0 !important;
      margin: 0 !important;
    }

    copilot-diff-entry {
      width: 100vw;
      height: 100vh;
      padding-top: 200px;
      padding-bottom: 200px;
      overflow-y: scroll;
      display: grid !important;
      place-items: center;
    }

    .js-file {
      width: 800px;
      min-width: 50vw;
      max-width: 85vw;
      overflow-y: scroll;
      min-height: 200px;
      max-height: calc(100vh - 400px);
    }

    .js-diff-progressive-container {
      display: flex;
      min-width: max-content;
    }

    #clarity-pr-top-container {
      position: fixed;
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      top: 0;
      left: 0;
      padding: 0 20px;
      z-index: 1000;
    }

    .clarity-pr-progress-bar {
      width: 300px;
      height: 10px;
      background-color: #161b22;
      border-radius: 5px;
      margin-right: 40px;
    }

    .clarity-pr-progress-bar-fill {
      height: 100%;
      background-color: #238636;
      width: 10px;
      border-radius: 5px;
    }

    .clarity-pr-buttons {
      display: flex;
      gap: 10px;
    }

    .clarity-pr-close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: #161b22;
      border-radius: 50%;
      border: none;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }

    .clarity-pr-close-button svg {
      width: 20px;
      height: 20px;
    }

    .clarity-pr-buttons button {
      background-color: #161b22;
      border: none;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      color: #fff;
    }

    .clarity-pr-check-button {
      font-size: 24px;
    }

    .clarity-pr-back-button {
      font-size: 24px;
    }

    .clarity-pr-next-button {
      font-size: 24px;
    }

    .forced-submit-screen {
      inset: 50% auto auto 50% !important;
      transform: translate(-50%, 50%) !important;
    }
  `
} as const;

// State management
interface ClarityState {
  isInSubmitScreen: boolean;
  isInClarityMode: boolean;
  checkedFiles: Set<number>;
  currentFileIndex: number;
  filesLength: number;
}

const state: ClarityState = {
  isInSubmitScreen: false,
  isInClarityMode: false,
  checkedFiles: new Set(),
  currentFileIndex: 0,
  filesLength: 0
};

// Utility functions
const getElement = <T extends HTMLElement>(selector: string): T | null => {
  return document.querySelector(selector) as T | null;
};

const getRequiredElement = <T extends HTMLElement>(selector: string): T => {
  const element = getElement<T>(selector);
  if (!element) {
    throw new Error(`Required element not found: ${selector}`);
  }
  return element;
};

const toggleSubmitScreen = (): void => {
  const reviewChangesButton = getElement<HTMLElement>(SELECTORS.REVIEWS_TOGGLE);
  if (reviewChangesButton) {
    reviewChangesButton.click();
  }
};

// Auto-toggle submit screen logic
setInterval(() => {
  if (!state.isInClarityMode) return;
  
  const popover = getElement<HTMLElement>(SELECTORS.REVIEW_CHANGES_MODAL);
  if (!popover) return;
  
  const popoverIsVisible = popover.checkVisibility();
  if ((state.isInSubmitScreen && !popoverIsVisible) || (!state.isInSubmitScreen && popoverIsVisible)) {
    toggleSubmitScreen();
  }
}, 100);

// UI management functions
const createTopContainer = (): HTMLElement => {
  const topContainer = document.createElement('div');
  topContainer.id = 'clarity-pr-top-container';
  topContainer.innerHTML = `
    <button class="clarity-pr-close-button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
    <div class="clarity-pr-progress-bar">
      <div class="clarity-pr-progress-bar-fill"></div>
    </div>
    <div class="clarity-pr-buttons">
      <button class="clarity-pr-check-button">&check;</button>
      <button class="clarity-pr-back-button">←</button>
      <button class="clarity-pr-next-button">→</button>
    </div>
  `;
  return topContainer;
};

const addStyles = (): void => {
  const style = document.createElement('style');
  style.id = 'clarity-pr-style';
  style.textContent = STYLES.CLARITY_MODE;
  document.head.appendChild(style);
};

const removeStyles = (): void => {
  const style = document.getElementById('clarity-pr-style');
  if (style) {
    style.remove();
  }
};

// Progress and navigation functions
const updateProgress = (): void => {
  const progressBarFill = getElement<HTMLElement>(SELECTORS.PROGRESS_BAR_FILL);
  if (!progressBarFill) return;
  
  const progressBarFillWidthPercentage = (state.checkedFiles.size / state.filesLength) * 100;
  progressBarFill.style.width = `${progressBarFillWidthPercentage}%`;
};

const changeCurrentFile = (): void => {
  document.head.parentElement!.scrollLeft = window.innerWidth * state.currentFileIndex + 32;
  
  const checkButton = getElement<HTMLElement>(SELECTORS.CHECK_BUTTON);
  if (!checkButton) return;
  
  if (state.checkedFiles.has(state.currentFileIndex)) {
    checkButton.setAttribute("style", "background: #238636");
  } else {
    checkButton.removeAttribute("style");
  }
};

const showSubmitScreen = (): void => {
  const diffContainers = document.querySelectorAll(SELECTORS.DIFF_PROGRESSIVE_CONTAINER);
  diffContainers.forEach((container) => {
    (container as HTMLElement).style.opacity = "0";
  });
  state.isInSubmitScreen = true;
};

const hideSubmitScreen = (): void => {
  const diffContainers = document.querySelectorAll(SELECTORS.DIFF_PROGRESSIVE_CONTAINER);
  diffContainers.forEach((container) => {
    (container as HTMLElement).style.opacity = "1";
  });
  state.isInSubmitScreen = false;
};

// Event handlers
const setupEventHandlers = (): void => {
  const closeButton = getElement<HTMLElement>(SELECTORS.CLOSE_BUTTON);
  const checkButton = getElement<HTMLElement>(SELECTORS.CHECK_BUTTON);
  const backButton = getElement<HTMLElement>(SELECTORS.BACK_BUTTON);
  const nextButton = getElement<HTMLElement>(SELECTORS.NEXT_BUTTON);

  if (!closeButton || !checkButton || !backButton || !nextButton) {
    console.error('Required buttons not found');
    return;
  }

  closeButton.addEventListener("click", () => {
    revertClarityMode();
  });

  checkButton.addEventListener("click", () => {
    state.checkedFiles.add(state.currentFileIndex);
    updateProgress();
    
    if (state.currentFileIndex === state.filesLength - 1) {
      showSubmitScreen();
    } else {
      hideSubmitScreen();
      state.currentFileIndex++;
      changeCurrentFile();
    }
  });

  backButton.addEventListener("click", () => {
    if (state.currentFileIndex > 0) {
      state.currentFileIndex--;
      changeCurrentFile();
      hideSubmitScreen();
    }
  });

  nextButton.addEventListener("click", () => {
    if (state.currentFileIndex < state.filesLength - 1) {
      state.currentFileIndex++;
      changeCurrentFile();
      hideSubmitScreen();
    } else {
      showSubmitScreen();
    }
  });
};

// Main functions
export const activeClarityMode = (): void => {
  if (state.isInClarityMode) return;
  
  try {
    state.isInClarityMode = true;
    state.checkedFiles.clear();
    state.currentFileIndex = 0;

    // Add styles
    addStyles();

    // Create and add top container
    const filesContainer = getRequiredElement<HTMLElement>(SELECTORS.FILES);
    const topContainer = createTopContainer();
    filesContainer.appendChild(topContainer);

    // Initialize file navigation
    const files = document.querySelectorAll(SELECTORS.JS_FILE);
    state.filesLength = files.length;

    if (state.filesLength === 0) {
      console.warn('No files found to review');
      return;
    }

    // Setup event handlers
    setupEventHandlers();

    // Initialize UI
    changeCurrentFile();
    updateProgress();

  } catch (error) {
    console.error('Failed to activate clarity mode:', error);
    revertClarityMode();
  }
};

export const revertClarityMode = (): void => {
  if (!state.isInClarityMode) return;
  
  try {
    state.isInClarityMode = false;
    state.isInSubmitScreen = false;
    state.checkedFiles.clear();
    state.currentFileIndex = 0;

    // Remove styles
    removeStyles();

    // Restore opacity of all diff containers to ensure files are visible
    const diffContainers = document.querySelectorAll(SELECTORS.DIFF_PROGRESSIVE_CONTAINER);
    diffContainers.forEach((container) => {
      (container as HTMLElement).style.opacity = "1";
    });

    // Remove the top container
    const topContainer = getElement<HTMLElement>(SELECTORS.CLARITY_PR_TOP_CONTAINER);
    if (topContainer) {
      topContainer.remove();
    }

  } catch (error) {
    console.error('Failed to revert clarity mode:', error);
  }
};