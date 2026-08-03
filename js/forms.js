const subscriptionForm = document.querySelector('[data-subscription-form]');
const subscriptionNotice = document.querySelector('[data-subscription-notice]');

subscriptionForm.addEventListener('submit', (event) => {
  event.preventDefault();
  subscriptionNotice.textContent = 'You’re subscribed. Welcome to Flora!';
  subscriptionForm.reset();
});

