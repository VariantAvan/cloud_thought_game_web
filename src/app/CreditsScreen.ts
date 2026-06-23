import creditsMd from '../../content/credits.md?raw';
import { renderMarkdown } from './renderMarkdown';

export class CreditsScreen {
  private container: HTMLElement;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Credits container #${containerId} not found`);
    this.container = el;
    this.container.innerHTML = renderMarkdown(creditsMd);
  }

  refresh(): void {
    this.container.innerHTML = renderMarkdown(creditsMd);
  }
}
