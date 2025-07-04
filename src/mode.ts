export interface ModeElementChange {
  elements: (HTMLElement | null)[];
  edit: (element: HTMLElement) => void;
  revert: (element: HTMLElement) => void;
}

export const clarityMode: ModeElementChange[] = [
  // add the progress bar at the top

  // make the files arranged in a horizontal carousel

  // add a Check button and a Next button. The check is for marking it as viewed, and the next is for moving to the next file.
  // add a back button to go back to the previous file (if not the first file)
];

// we have a list of .js-diff-progressive-container

export const activeClarityMode = () => {
  clarityMode.forEach((mode) => {
    mode.elements.forEach((element) => {
      if (element) {
        mode.edit(element);
      }
    });
  });

  // add modified styles to existing classes
  const style = document.createElement('style');
  style.id = 'clarity-pr-style';
  style.textContent = `
    header, footer, #partial-discussion-header, .tabnav, .pr-toolbar, .file-actions{
      display: none !important;
    }

    body {
      overflow: hidden;
    }

    .sticky-file-header {
      position: relative;
      top: 0;
    }

    #files {
      display: flex;
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
    }

    .js-diff-progressive-container {
      display: flex;
      min-width: max-content;
    }
  `;
  document.head.appendChild(style);
}

export const revertClarityMode = () => {
  clarityMode.forEach((mode) => {
    mode.elements.forEach((element) => {
      if (element) {
        mode.revert(element);
      }
    });
  });

  // remove modified styles from existing classes
  const style = document.getElementById('clarity-pr-style');
  if (style) {
    style.remove();
  }
}