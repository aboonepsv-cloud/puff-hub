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
// Lottery form
function updateDate() {
  const el = document.getElementById('todayDate');
  if (el) el.textContent = new Date().toLocaleDateString('en-US');
}
updateDate();

function calcTotals() {
  const instSold = parseFloat(document.getElementById('instSold')?.value) || 0;
  const instPaid = parseFloat(document.getElementById('instPaid')?.value) || 0;
  const onlineSold = parseFloat(document.getElementById('onlineSold')?.value) || 0;
  const onlinePay = parseFloat(document.getElementById('onlinePay')?.value) || 0;
  const cc = parseFloat(document.getElementById('cc')?.value) || 0;
  const payIn = parseFloat(document.getElementById('payIn')?.value) || 0;
  const payOut = parseFloat(document.getElementById('payOut')?.value) || 0;

  const instNet = instSold - instPaid;
  const onlineNet = onlineSold - Math.abs(onlinePay);
  const netDeposit = instNet + onlineNet - Math.abs(cc) + payIn - Math.abs(payOut);

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val.toFixed(2);
  };
  set('instNet', instNet);
  set('onlineNet', onlineNet);
  set('netDeposit', netDeposit);
}

document.querySelectorAll('#page-lottery input, #page-lottery select').forEach(el => {
  el.addEventListener('input', calcTotals);
});

document.getElementById('addRow')?.addEventListener('click', () => {
  const tbody = document.querySelector('#ticketTable tbody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" class="bin"></td>
    <td><input type="text" class="game"></td>
    <td><input type="number" class="start"></td>
    <td><input type="number" class="end"></td>
    <td>
      <select class="status">
        <option value="">—</option>
        <option>Open</option>
        <option>Activated</option>
        <option>Partial Pack Settle</option>
        <option>Settled</option>
      </select>
    </td>
    <td><button type="button" class="remove-row">×</button></td>
  `;
  tbody.appendChild(tr);
  tr.querySelector('.remove-row').addEventListener('click', () => tr.remove());
});

document.querySelectorAll('.remove-row').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('tr').remove());
});

document.getElementById('submitLottery')?.addEventListener('click', () => {
  const status = document.getElementById('submitStatus');
  status.textContent = 'Submitting...';
  status.style.color = '#00ffaa';

  // Collect data
  const data = {
    store: '4',
    date: new Date().toISOString().slice(0, 10),
    instSold: document.getElementById('instSold').value,
    instPaid: document.getElementById('instPaid').value,
    onlineSold: document.getElementById('onlineSold').value,
    onlinePay: document.getElementById('onlinePay').value,
    cc: document.getElementById('cc').value,
    vouchers: document.getElementById('vouchers').value,
    payIn: document.getElementById('payIn').value,
    payInSource: document.getElementById('payInSource').value,
    payOut: document.getElementById('payOut').value,
    payOutSource: document.getElementById('payOutSource').value,
    tickets: []
  };

  document.querySelectorAll('#ticketTable tbody tr').forEach(tr => {
    data.tickets.push({
      bin: tr.querySelector('.bin').value,
      game: tr.querySelector('.game').value,
      start: tr.querySelector('.start').value,
      end: tr.querySelector('.end').value,
      status: tr.querySelector('.status').value
    });
  });

  // TODO: send to Apps Script endpoint
  console.log('Submit data:', data);
  setTimeout(() => {
    status.textContent = 'Submitted (test mode — Apps Script connection next)';
  }, 600);
});

// Lottery form logic
function updateDate() {
  const el = document.getElementById('todayDate');
  if (el) el.textContent = new Date().toLocaleDateString('en-US');
}
updateDate();

function calcTotals() {
  const instSold = parseFloat(document.getElementById('instSold')?.value) || 0;
  const instPaid = parseFloat(document.getElementById('instPaid')?.value) || 0;
  const onlineSold = parseFloat(document.getElementById('onlineSold')?.value) || 0;
  const onlinePay = parseFloat(document.getElementById('onlinePay')?.value) || 0;
  const cc = parseFloat(document.getElementById('cc')?.value) || 0;
  const payIn = parseFloat(document.getElementById('payIn')?.value) || 0;
  const payOut = parseFloat(document.getElementById('payOut')?.value) || 0;

  const instNet = instSold - instPaid;
  const onlineNet = onlineSold - Math.abs(onlinePay);
  const netDeposit = instNet + onlineNet - Math.abs(cc) + payIn - Math.abs(payOut);

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val.toFixed(2);
  };
  set('instNet', instNet);
  set('onlineNet', onlineNet);
  set('netDeposit', netDeposit);
}

function validateRows() {
  const errors = [];
  document.querySelectorAll('#ticketTable tbody tr').forEach((tr, i) => {
    const start = parseFloat(tr.querySelector('.start')?.value);
    const end = parseFloat(tr.querySelector('.end')?.value);
    const statusCell = tr.querySelector('.row-status');
    statusCell.textContent = '';
    statusCell.style.color = '';

    if (!isNaN(start) && !isNaN(end) && end < start) {
      statusCell.textContent = 'ERROR';
      statusCell.style.color = '#ff4466';
      errors.push('Row ' + (i+1) + ': Ending # lower than Starting #');
    }
  });
  const errDiv = document.getElementById('formErrors');
  if (errDiv) errDiv.textContent = errors.join(' | ');
  return errors.length === 0;
}

document.querySelectorAll('#page-lottery input, #page-lottery select').forEach(el => {
  el.addEventListener('input', () => { calcTotals(); validateRows(); });
  el.addEventListener('change', () => { calcTotals(); validateRows(); });
});

document.getElementById('addRow')?.addEventListener('click', () => {
  const tbody = document.querySelector('#ticketTable tbody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><select class="price entry"><option value="">—</option><option value="1">$1</option><option value="2">$2</option><option value="3">$3</option><option value="5">$5</option><option value="10">$10</option><option value="20">$20</option><option value="30">$30</option></select></td>
    <td><input type="text" class="bin entry"></td>
    <td><input type="text" class="game entry"></td>
    <td><input type="number" class="start entry"></td>
    <td><input type="number" class="end entry"></td>
    <td><select class="status entry"><option value="">—</option><option>Open</option><option>Activated</option><option>Partial Pack Settle</option><option>Settled</option></select></td>
    <td class="row-status"></td>
    <td><button type="button" class="remove-row">×</button></td>
  `;
  tbody.appendChild(tr);
  tr.querySelector('.remove-row').addEventListener('click', () => tr.remove());
  tr.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => { calcTotals(); validateRows(); });
    el.addEventListener('change', () => { calcTotals(); validateRows(); });
  });
});

document.querySelectorAll('.remove-row').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('tr').remove());
});

// SUBMIT — replace SCRIPT_URL after you deploy
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEpwj4kpxJEMUZoXGRHMjXCfaL6yqBFba9ahTK6ekvNW0JpB8_PzB0Q4KirmAbRekygA/exec';

document.getElementById('submitLottery')?.addEventListener('click', async () => {
  if (!validateRows()) {
    document.getElementById('submitStatus').textContent = 'Fix errors before submitting.';
    document.getElementById('submitStatus').style.color = '#ff4466';
    return;
  }

  const status = document.getElementById('submitStatus');
  status.textContent = 'Submitting...';
  status.style.color = '#00ffaa';

  const data = {
    store: '4',
    date: new Date().toISOString().slice(0, 10),
    instSold: document.getElementById('instSold').value,
    instPaid: document.getElementById('instPaid').value,
    onlineSold: document.getElementById('onlineSold').value,
    onlinePay: document.getElementById('onlinePay').value,
    cc: document.getElementById('cc').value,
    vouchers: document.getElementById('vouchers').value,
    payIn: document.getElementById('payIn').value,
    payInSource: document.getElementById('payInSource').value,
    payOut: document.getElementById('payOut').value,
    payOutSource: document.getElementById('payOutSource').value,
    tickets: []
  };

  document.querySelectorAll('#ticketTable tbody tr').forEach(tr => {
    data.tickets.push({
      price: tr.querySelector('.price')?.value || '',
      bin: tr.querySelector('.bin')?.value || '',
      game: tr.querySelector('.game')?.value || '',
      start: tr.querySelector('.start')?.value || '',
      end: tr.querySelector('.end')?.value || '',
      status: tr.querySelector('.status')?.value || ''
    });
  });

  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.ok) {
      status.textContent = 'Submitted: ' + result.fileName;
      // Clear form
      document.querySelectorAll('#page-lottery .entry').forEach(el => el.value = '');
      calcTotals();
    } else {
      status.textContent = 'Error: ' + (result.error || 'Unknown');
      status.style.color = '#ff4466';
    }
  } catch (err) {
    status.textContent = 'Network error: ' + err.message;
    status.style.color = '#ff4466';
  }
});
