export interface ModeElementChange {
  elements: (HTMLElement | null)[];
  edit: (element: HTMLElement) => void;
  revert: (element: HTMLElement) => void;
}

export const clarityMode: ModeElementChange[] = [
  {
    elements: [
      document.querySelector('header'),
      document.querySelector('#partial-discussion-header'),
      document.querySelector('.tabnav'),
      document.querySelector('.pr-toolbar'),
    ],
    edit: (element: HTMLElement) => {
      element.setAttribute('style', 'display: none !important;');
    },
    revert: (element: HTMLElement) => {
      element.removeAttribute('style');
    },
  },
  {
    elements: [
      document.querySelector('diff-file-filter'),
    ],
    edit: (element: HTMLElement) => {
      element.setAttribute('style', `
        width: 800px;
        min-width: 50%;
        max-width: 85%;
        margin-left: auto;
        margin-right: auto;
      `);
    },
    revert: (element: HTMLElement) => {
      element.removeAttribute('style');
    },
  },
];

export const activeClarityMode = () => {
  clarityMode.forEach((mode) => {
    mode.elements.forEach((element) => {
      if (element) {
        mode.edit(element);
      }
    });
  });
}

export const revertClarityMode = () => {
  clarityMode.forEach((mode) => {
    mode.elements.forEach((element) => {
      if (element) {
        mode.revert(element);
      }
    });
  });
}