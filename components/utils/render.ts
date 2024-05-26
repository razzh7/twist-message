import { ReactElement } from 'react';
import { createRoot } from 'react-dom/client';

export const render = (app: ReactElement, container: Element | DocumentFragment) => {
  const root = createRoot(container);

  root.render(app);

  return root;
};