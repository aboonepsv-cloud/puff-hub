document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  const dateEl = document.getElementById('todayDate');
  if (dateEl) dateEl.textContent = today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

  // Simple game lookup placeholder — replace with real list later
  const gameNames = {
    '1814': 'Example Game Name',
    // Add more as needed
  };

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
      if (statusCell) {
        statusCell.textContent = '';
        statusCell.style.color = '';
        if (!isNaN(start) && !isNaN(end) && end < start) {
          statusCell.textContent = 'ERROR';
          statusCell.style.color = '#ff4466';
          errors.push('Row ' + (i + 1) + ': Ending # lower than Starting #');
        }
      }
    });
    const errDiv = document.getElementById('formErrors');
    if (errDiv) errDiv.textContent = errors.join(' | ');
    return errors.length === 0;
  }

  function bindRow(tr) {
    const gameInput = tr.querySelector('.game');
    const nameCell = tr.querySelector('.game-name');
    if (gameInput && nameCell) {
      gameInput.addEventListener('input', () => {
        const book = gameInput.value.trim();
        nameCell.textContent = gameNames[book] || (book ? '…' : '');
      });
    }
    tr.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', () => { calcTotals(); validateRows(); });
      el.addEventListener('change', () => { calcTotals(); validateRows(); });
    });
    tr.querySelector('.remove-row')?.addEventListener('click', () => tr.remove());
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
      <td class="game-name"></td>
      <td><input type="number" class="start entry"></td>
      <td><input type="number" class="end entry"></td>
      <td><select class="status entry"><option value="">—</option><option>Open</option><option>Activated</option><option>Partial Pack Settle</option><option>Settled</option></select></td>
      <td class="row-status"></td>
      <td><button type="button" class="remove-row">×</button></td>
    `;
    tbody.appendChild(tr);
    bindRow(tr);
  });

  document.querySelectorAll('#ticketTable tbody tr').forEach(bindRow);

  document.getElementById('submitLottery')?.addEventListener('click', async () => {
    if (!validateRows()) {
      document.getElementById('submitStatus').textContent = 'Fix errors before submitting';
      document.getElementById('submitStatus').style.color = '#ff4466';
      return;
    }
    const status = document.getElementById('submitStatus');
    status.textContent = 'Submitting...';
    status.style.color = '#00ffaa';

    const data = {
      store: document.getElementById('storeSelect')?.value || '4',
      date: new Date().toISOString().slice(0, 10),
      instSold: document.getElementById('instSold')?.value || '',
      instPaid: document.getElementById('instPaid')?.value || '',
      onlineSold: document.getElementById('onlineSold')?.value || '',
      onlinePay: document.getElementById('onlinePay')?.value || '',
      cc: document.getElementById('cc')?.value || '',
      vouchers: document.getElementById('vouchers')?.value || '',
      payIn: document.getElementById('payIn')?.value || '',
      payInSource: document.getElementById('payInSource')?.value || '',
      payOut: document.getElementById('payOut')?.value || '',
      payOutSource: document.getElementById('payOutSource')?.value || '',
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

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEpwj4kpxJEMUZoXGRHMjXCfaL6yqBFba9ahTK6ekvNW0JpB8_PzB0Q4KirmAbRekygA/exec';
    try {
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'text/plain' }
      });
      const result = await res.json();
      if (result.ok) {
        status.textContent = 'Submitted: ' + result.fileName;
        status.style.color = '#00ffaa';
      } else {
        status.textContent = 'Error: ' + (result.error || 'Unknown');
        status.style.color = '#ff4466';
      }
    } catch (e) {
      status.textContent = 'Network error: ' + e.message;
      status.style.color = '#ff4466';
    }
  });

  // Sidebar navigation
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
});
