document.querySelectorAll('.sidebar nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    link.classList.add('active');
    const page = link.dataset.page;
    document.getElementById('page-' + page).classList.add('active');
  });
});

const storeSelect = document.getElementById('storeSelect');
storeSelect.addEventListener('change', () => {
  const store = storeSelect.value;
  console.log('Selected store:', store);
  // Later: load that store's forms and data
});

const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const sendBtn = document.getElementById('sendChat');

function addMessage(text, isStore) {
  const div = document.createElement('div');
  div.className = 'message ' + (isStore ? 'store' : 'office');
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendBtn.addEventListener('click', () => {
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage('You: ' + text, true);
  chatInput.value = '';
});

chatInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendBtn.click();
});

document.getElementById('toggleChat').addEventListener('click', () => {
  const panel = document.querySelector('.chat-panel');
  panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
});