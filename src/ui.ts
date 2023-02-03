import Storage from './storage';
import { shortenLink } from './api';
import { ShortenedLink } from './interfaces/ShortenedLink';

export default class UI {
  private readonly urlRegex = new RegExp(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i
  );
  private readonly storage: Storage;
  private readonly menu: HTMLElement;
  private readonly menuBtn: HTMLButtonElement;
  private readonly container: HTMLElement;
  private readonly form: HTMLFormElement;
  private readonly input: HTMLInputElement;

  constructor(storage: Storage) {
    this.storage = storage;
    this.menu = document.querySelector<HTMLElement>('#menu')!;
    this.menuBtn = document.querySelector<HTMLButtonElement>('#menu-btn')!;
    this.container =
      document.querySelector<HTMLDivElement>('#shortened-links')!;
    this.form = document.querySelector<HTMLFormElement>('#shorten-form')!;
    this.input = this.form.querySelector<HTMLInputElement>('input')!;
  }

  init(): void {
    this.menuBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
    this.input.addEventListener('input', this.validateLinkInput.bind(this));
    this.form.addEventListener('submit', this.handleFormSubmit.bind(this));

    this.displayShortenedLinks();
  }

  private toggleMobileMenu(): void {
    this.menu.classList.toggle('hidden');
  }

  private async handleFormSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    if (!this.validateLinkInput()) {
      return;
    }

    const link = this.input.value.trim();
    const [shortenedLink, error] = await shortenLink(link);
    if (!shortenedLink) {
      this.markAsInvalid(this.input, error.message);
      return;
    }
    this.form.reset();

    this.storage.addShortenedLink(shortenedLink);
    this.displayShortenedLink(shortenedLink);
  }

  private validateLinkInput(): boolean {
    const value = this.input.value.trim();
    if (value.length < 1 || !this.urlRegex.test(value)) {
      this.markAsInvalid(this.input, 'Please add a valid link');
      return false;
    }
    this.markAsValid(this.input);
    return true;
  }

  private markAsInvalid(input: HTMLInputElement, message: string): void {
    input.setAttribute('data-invalid', '');
    const errorElement = input.nextElementSibling;
    if (!errorElement) {
      return;
    }
    errorElement.textContent = message;
  }

  private markAsValid(input: HTMLInputElement): void {
    input.removeAttribute('data-invalid');
    const errorElement = input.nextElementSibling;
    if (!errorElement) {
      return;
    }
    errorElement.textContent = '';
  }

  private displayShortenedLinks(): void {
    const shortenedLinks = this.storage.getShortenedLinks();
    this.container.append(
      ...shortenedLinks.map((shortenedLink) =>
        this.createShortenedLinkElement(shortenedLink)
      )
    );
  }

  private displayShortenedLink(shortenedLink: ShortenedLink): void {
    this.container.prepend(this.createShortenedLinkElement(shortenedLink));
  }

  private createShortenedLinkElement(
    shortenedLink: ShortenedLink
  ): HTMLDivElement {
    const elementContainer = document.createElement('div');
    elementContainer.dataset.id = shortenedLink.id;
    elementContainer.className =
      'shortened-link flex flex-col md:flex-row md:items-center bg-white rounded-md text-base md:text-lg text-very-dark-blue';
    elementContainer.insertAdjacentHTML(
      'afterbegin',
      `<p class="p-4 md:p-6 overflow-hidden whitespace-nowrap text-ellipsis md:flex-1">
      ${shortenedLink.original}
    </p>
    <hr class="text-gray opacity-70 md:hidden" />`
    );

    const innerContainer = document.createElement('div');
    innerContainer.className =
      'flex flex-col gap-4 md:flex-row md:items-center md:gap-6 p-4 md:p-6';
    innerContainer.insertAdjacentHTML(
      'afterbegin',
      `<a
        target="_blank"
        href="${shortenedLink.short}"
        class="text-cyan overflow-hidden whitespace-nowrap text-ellipsis">
        ${shortenedLink.short}
      </a>`
    );
    elementContainer.appendChild(innerContainer);

    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'flex justify-end gap-3';
    innerContainer.appendChild(controlsContainer);

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.className =
      'bg-cyan hover:bg-light-cyan text-white font-bold block w-full sm:w-32 py-2 rounded-md disabled:bg-dark-violet transition-colors';
    copyButton.onclick = (event) => this.copy(event, shortenedLink.short);
    controlsContainer.appendChild(copyButton);

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('aria-label', 'Delete');
    deleteButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
      </svg>
      <span class="sr-only">Delete</span>
    `;
    deleteButton.className =
      'bg-red fill-white hover:bg-opacity-80 font-bold block px-3 py-2 rounded-md transition-colors';
    deleteButton.onclick = this.delete.bind(this);
    controlsContainer.appendChild(deleteButton);

    return elementContainer;
  }

  private async copy(event: MouseEvent, shortLink: string): Promise<void> {
    const button = event.target as HTMLButtonElement;
    try {
      await navigator.clipboard.writeText(shortLink);
      this.copyIndicator(button, true);
    } catch (error) {
      this.copyIndicator(button, false);
    }
  }

  private copyIndicator(button: HTMLButtonElement, success: boolean): void {
    button.disabled = true;
    button.textContent = success ? 'Copied!' : 'Not copied!';
    setTimeout(() => {
      button.textContent = 'Copy';
      button.disabled = false;
    }, 1000);
  }

  private delete(event: MouseEvent): void {
    const button = event.target as HTMLButtonElement;
    const container = button.closest('.shortened-link') as HTMLDivElement;
    const id = container.dataset.id;
    if (id) {
      this.storage.removeShortenedLink(id);
    }
    container.remove();
  }
}
