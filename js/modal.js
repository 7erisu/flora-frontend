const backdrop = document.querySelector('[data-modal-backdrop]');
const modal = backdrop.querySelector('[role="dialog"]');
const closeButton = backdrop.querySelector('[data-modal-close]');
const orderForm = backdrop.querySelector('[data-order-form]');
const bouquetField = orderForm.elements.bouquet;
let previousFocus = null;

export const openModal = (bouquetName = '') => {
  previousFocus = document.activeElement;
  bouquetField.value = bouquetName;
  backdrop.classList.add('is-open');
  backdrop.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  closeButton.focus();
};

export const closeModal = () => {
  backdrop.classList.remove('is-open');
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  previousFocus?.focus();
};

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('.js-open-modal');
  if (trigger) openModal(trigger.dataset.bouquetName ?? '');
});

closeButton.addEventListener('click', closeModal);
backdrop.addEventListener('click', (event) => {
  if (event.target === backdrop) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && backdrop.classList.contains('is-open')) closeModal();
});

orderForm.addEventListener('submit', (event) => {
  event.preventDefault();
  orderForm.reset();
  closeModal();
  document.querySelector('[data-form-notice]').textContent = 'Thank you! We will contact you shortly.';
});

modal.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const focusable = [...modal.querySelectorAll('button, input, textarea')].filter((element) => !element.disabled);
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

