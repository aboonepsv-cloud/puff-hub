document.addEventListener('DOMContentLoaded', () => {
  const SHEETS = {
    '4': '1j5ti-mDHQXztevzN9JTXHCZlVmItFlNkfhhh5xQNAWg',
    '7': '1YB_syuyeaF-GuAQc6ePiDJaWdp3k1PXLDAoLDZC7s94',
    '17': '1GG8YVoDLeTXrfKdkWYoS5ronlGgZCJ3_L8VvaxlJeq0'
  };
  const NAMES = { '4': '4 Juniata', '7': '7 Bellwood', '17': '17 Mt. Joy' };

  function loadSheet(store) {
    const id = SHEETS[store];
    const frame = document.getElementById('lotteryFrame');
    if (id && frame) {
      frame.src = 'https://docs.google.com/spreadsheets/d/' + id + '/edit?usp=sharing&rm=minimal';
    }
    const label = document.getElementById('sheetStore');
    if (label) label.textContent = NAMES[store] || store;
  }

  const select = document.getElementById('storeSelect');
  if (select) {
    loadSheet(select.value);
    select.addEventListener('change', () => loadSheet(select.value));
  }

  document.querySelectorAll('.sidebar nav a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.sidebar nav a').forEach(x => x.classList.remove('active'));
      a.classList.add('active');
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      const page = document.getElementById('page-' + a.dataset.page);
      if (page) page.classList.add('active');
    });
  });

  // Chat toggle
  const chatPanel = document.querySelector('.chat-panel');
  const toggleBtn = document.getElementById('toggleChat');
  const reopenBtn = document.getElementById('reopenChat');
  if (toggleBtn && chatPanel) {
    toggleBtn.addEventListener('click', () => {
      chatPanel.classList.add('closed');
      if (reopenBtn) reopenBtn.style.display = 'block';
    });
  }
  if (reopenBtn && chatPanel) {
    reopenBtn.addEventListener('click', () => {
      chatPanel.classList.remove('closed');
      reopenBtn.style.display = 'none';
    });
  }
});
