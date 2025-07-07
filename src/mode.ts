const toggleSubmitScreen = () => {
  const reviewChangesButton = document.querySelector(".js-reviews-toggle") as HTMLElement
  reviewChangesButton.click()
}

let isInSubmitScreen = false;
let isInClarityMode = false;
setInterval(() => {
  if (!isInClarityMode) return
  // if we are in the submit screen, but the popover is not visible, show it
  const popover = document.querySelector("#review-changes-modal") as HTMLElement
  if (!popover) return
  const popoverIsVisible = popover.checkVisibility()
  if ((isInSubmitScreen && !popoverIsVisible) || (!isInSubmitScreen && popoverIsVisible)) {
    toggleSubmitScreen()
  }
}, 100);

export const activeClarityMode = () => {
  if (isInClarityMode) return
  isInClarityMode = true;

  // add modified styles to existing classes
  const style = document.createElement('style');
  style.id = 'clarity-pr-style';
  style.textContent = `
    header, footer, #partial-discussion-header, nav.tabnav, .file-actions {
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
  `;
  document.head.appendChild(style);

  const topContainer = document.createElement('div');
  topContainer.id = 'clarity-pr-top-container';
  // progress bar, check button, next button, back button
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
  `

  const filesContainer = document.querySelector("#files");
  filesContainer!.appendChild(topContainer);

  const progressBarFill = document.querySelector(".clarity-pr-progress-bar-fill");
  const closeButton = document.querySelector(".clarity-pr-close-button");
  const checkButton = document.querySelector(".clarity-pr-check-button");
  const backButton = document.querySelector(".clarity-pr-back-button");
  const nextButton = document.querySelector(".clarity-pr-next-button");

  const files = document.querySelectorAll(".js-file");
  const filesLength = files.length;

  let checkedFiles = new Set<number>();
  let currentFileIndex = 0;

  const updateProgress = () => {
    const progressBarFillWidthPercentage = (checkedFiles.size / filesLength) * 100;
    (progressBarFill as HTMLElement).style.width = `${progressBarFillWidthPercentage}%`;
  }

  const changeCurrentFile = () => {
    document.head.parentElement!.scrollLeft = window.innerWidth * currentFileIndex + 32
    if (checkedFiles.has(currentFileIndex)) {
      checkButton!.setAttribute("style", "background: #238636")
    } else {
      checkButton!.removeAttribute("style")
    }
  }

  changeCurrentFile()

  const showSubmitScreen = () => {
    // hide all .js-diff-progressive-container using opacity 0
    const diffContainers = document.querySelectorAll(".js-diff-progressive-container")
    diffContainers.forEach((container) => {
      (container as HTMLElement).style.opacity = "0"
    })

    isInSubmitScreen = true;
  }

  const hideSubmitScreen = () => {
    // show all .js-diff-progressive-container using opacity 1
    const diffContainers = document.querySelectorAll(".js-diff-progressive-container")
    diffContainers.forEach((container) => {
      (container as HTMLElement).style.opacity = "1"
    })

    isInSubmitScreen = false;
  }

  closeButton!.addEventListener("click", () => {
    revertClarityMode();
  });

  checkButton!.addEventListener("click", () => {
    checkedFiles.add(currentFileIndex);
    updateProgress();
    if (currentFileIndex === filesLength - 1) {
      showSubmitScreen();
    } else {
      hideSubmitScreen();
      currentFileIndex++;
      changeCurrentFile();
    }
  });

  backButton!.addEventListener("click", () => {
    if (currentFileIndex > 0) {
      currentFileIndex--;
      changeCurrentFile();
      hideSubmitScreen();
    }
  });

  nextButton!.addEventListener("click", () => {
    if (currentFileIndex < filesLength - 1) {
      currentFileIndex++;
      changeCurrentFile();
      hideSubmitScreen();
    } else {
      showSubmitScreen();
    }
  });
}

export const revertClarityMode = () => {
  if (!isInClarityMode) return
  isInClarityMode = false;

  // remove modified styles from existing classes
  const style = document.getElementById('clarity-pr-style');
  if (style) {
    style.remove();
  }

  // remove the top container
  const topContainer = document.querySelector("#clarity-pr-top-container");
  if (topContainer) {
    topContainer.remove();
  }
}