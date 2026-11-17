document.addEventListener('DOMContentLoaded', () => {
  const DATA = {
    '4': {
      name: '4 Juniata',
      lottery: '1j5ti-mDHQXztevzN9JTXHCZlVmItFlNkfhhh5xQNAWg',
      schedule: '1yLYXwOfFTRuz6L1_WWT_4OpSUuJt4iRMNXA_G3ozTT8',
      timesheet: '1FTRqMTIoqFizbfUCh13bfqtv2yksFzt8hvJdXLT5N4E'
    },
    '7': {
      name: '7 Bellwood',
      lottery: '1YB_syuyeaF-GuAQc6ePiDJaWdp3k1PXLDAoLDZC7s94',
      schedule: '1AORokd7lBmPjAMUUNtJuAy6XHVwPdZcVlzW95DzZ3a8',
      timesheet: '1N1Da1BcHSDyogDT94C38ZXvaigMcJTa3p9v4oAQ1KY0'
    },
    '17': {
      name: '17 Mt. Joy',
      lottery: '1GG8YVoDLeTXrfKdkWYoS5ronlGgZCJ3_L8VvaxlJeq0',
      schedule: '1EEE3q32HxqzY2c84CT6D8KcwPebzooW9z5uVTgEG9wo',
      timesheet: '1mZAC8obFVQzor_1HT9p8MTZPxNdQ1qexLWkP9fJJTys'
    }
  };

  function embed(id, frameId) {
    const f = document.getElementById(frameId);
    if (f && id) f.src = 'https://docs.google.com/spreadsheets/d/' + id + '/edit?usp=sharing&rm=minimal';
  }

  function loadStore(store) {
    const d = DATA[store];
    if (!d) return;
    embed(d.lottery, 'lotteryFrame');
    embed(d.schedule, 'schedFrame');
    embed(d.timesheet, 'tsFrame');
    ['lotteryStore','schedStore','tsStore'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = d.name;
    });
  }

  const select = document.getElementById('storeSelect');
  if (select) {
    loadStore(select.value);
    select.addEventListener('change', () => loadStore(select.value));
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
