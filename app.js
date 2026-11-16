document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  document.getElementById('todayDate').textContent = today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

  const PRICES = [1, 2, 3, 5, 10, 20, 30];
  const ROWS_PER_PRICE = 6;

  // Placeholder game list — replace with real master list later
  const GAME_LIST = {
    '1814': { name: 'Sample $1 Game', price: 1, tickets: 300 },
    // Add more book numbers here
  };

  function buildSections() {
    const container = document.getElementById('priceSections');
    container.innerHTML = '';
    PRICES.forEach(price => {
      const section = document.createElement('div');
      section.className = 'price-section';
      section.dataset.price = price;
      section.innerHTML = `
        <h4>$${price} Tickets</h4>
        <table>
          <thead>
            <tr>
              <th>Bin #</th>
              <th>Game / Book #</th>
              <th>Game Name</th>
              <th>Starting #</th>
              <th>Ending #</th>
              <th>Sold</th>
              <th>Value</th>
              <th>Pack Status</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <div class="section-total">Section total: <span class="sec-tickets">0</span> tickets / $<span class="sec-value">0.00</span></div>
      `;
      const tbody = section.querySelector('tbody');
      for (let i = 0; i < ROWS_PER_PRICE; i++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><input type="text" class="bin entry"></td>
          <td><input type="text" class="game entry"></td>
          <td class="auto-cell game-name"></td>
          <td><input type="number" class="start entry"></td>
          <td><input type="number" class="end entry"></td>
          <td class="auto-cell sold">0</td>
          <td class="auto-cell value">0.00</td>
          <td>
            <select class="status entry">
              <option value="">—</option>
              <option>Open</option>
              <option>Activated</option>
              <option>Partial Pack Settle</option>
              <option>Settled</option>
            </select>
          </td>
          <td class="auto-cell row-status"></td>
        `;
        tbody.appendChild(tr);
      }
      container.appendChild(section);
    });
    bindAll();
  }

  function bindAll() {
    document.querySelectorAll('.price-section input, .price-section select').forEach(el => {
      el.addEventListener('input', recalc);
      el.addEventListener('change', recalc);
    });
    document.querySelectorAll('#page-lottery .entry').forEach(el => {
      el.addEventListener('input', recalc);
    });
    recalc();
  }

  function recalc() {
    let totalTickets = 0;
    let totalValue = 0;
    const errors = [];

    document.querySelectorAll('.price-section').forEach(section => {
      const price = parseInt(section.dataset.price, 10);
      let secTickets = 0;
      let secValue = 0;

      section.querySelectorAll('tbody tr').forEach(tr => {
        const book = tr.querySelector('.game')?.value.trim();
        const start = parseFloat(tr.querySelector('.start')?.value);
        const end = parseFloat(tr.querySelector('.end')?.value);
        const nameCell = tr.querySelector('.game-name');
        const soldCell = tr.querySelector('.sold');
        const valueCell = tr.querySelector('.value');
        const statusCell = tr.querySelector('.row-status');

        let game = GAME_LIST[book] || null;
        if (nameCell) nameCell.textContent = game ? game.name : (book ? 'Unknown' : '');

        let sold = 0;
        let value = 0;
        if (!isNaN(start) && !isNaN(end) && end >= start) {
          sold = end - start;
          value = sold * price;
          if (statusCell) { statusCell.textContent = ''; statusCell.style.color = ''; }
        } else if (!isNaN(start) && !isNaN(end) && end < start) {
          if (statusCell) { statusCell.textContent = 'ERROR'; statusCell.style.color = '#ff4466'; }
          errors.push('Ending < Starting');
        }

        if (soldCell) soldCell.textContent = sold;
        if (valueCell) valueCell.textContent = value.toFixed(2);
        secTickets += sold;
        secValue += value;
      });

      section.querySelector('.sec-tickets').textContent = secTickets;
      section.querySelector('.sec-value').textContent = secValue.toFixed(2);
      totalTickets += secTickets;
      totalValue += secValue;
    });

    const instSoldEl = document.getElementById('instSold');
    if (instSoldEl) instSoldEl.value = totalTickets;

    const instPaid = parseFloat(document.getElementById('instPaid')?.value) || 0;
    const onlineSold = parseFloat(document.getElementById('onlineSold')?.value) || 0;
    const onlinePay = parseFloat(document.getElementById('onlinePay')?.value) || 0;
    const cc = parseFloat(document.getElementById('cc')?.value) || 0;
    const payIn = parseFloat(document.getElementById('payIn')?.value) || 0;
    const payOut = parseFloat(document.getElementById('payOut')?.value) || 0;

    const instNet = totalValue - instPaid;
    const onlineNet = onlineSold - Math.abs(onlinePay);
    const netDeposit = instNet + onlineNet - Math.abs(cc) + payIn - Math.abs(payOut);

    document.getElementById('instNet').textContent = instNet.toFixed(2);
    document.getElementById('onlineNet').textContent = onlineNet.toFixed(2);
    document.getElementById('netDeposit').textContent = netDeposit.toFixed(2);

    const errDiv = document.getElementById('formErrors');
    if (errDiv) errDiv.textContent = errors.length ? 'Fix red ERROR rows before submit' : '';
  }

  buildSections();

  document.getElementById('submitLottery')?.addEventListener('click', async () => {
    const status = document.getElementById('submitStatus');
    status.textContent = 'Submitting...';
    status.style.color = '#00ffaa';

    const tickets = [];
    document.querySelectorAll('.price-section tbody tr').forEach(tr => {
      const book = tr.querySelector('.game')?.value.trim();
      if (!book) return;
      tickets.push({
        price: tr.closest('.price-section').dataset.price,
        bin: tr.querySelector('.bin')?.value || '',
        game: book,
        start: tr.querySelector('.start')?.value || '',
        end: tr.querySelector('.end')?.value || '',
        status: tr.querySelector('.status')?.value || ''
      });
    });

    const data = {
      store: document.getElementById('storeSelect')?.value || '4',
      date: new Date().toISOString().slice(0, 10),
      instSold: document.getElementById('instSold')?.value || '0',
      instPaid: document.getElementById('instPaid')?.value || '',
      onlineSold: document.getElementById('onlineSold')?.value || '',
      onlinePay: document.getElementById('onlinePay')?.value || '',
      cc: document.getElementById('cc')?.value || '',
      vouchers: document.getElementById('vouchers')?.value || '',
      payIn: document.getElementById('payIn')?.value || '',
      payInSource: document.getElementById('payInSource')?.value || '',
      payOut: document.getElementById('payOut')?.value || '',
      payOutSource: document.getElementById('payOutSource')?.value || '',
      tickets
    };

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEpwj4kpxJEMUZoXGRHMjXCfaL6yqBFba9ahTK6ekvNW0JpB8_PzB0Q4KirmAbRekygA/exec';
    try {
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'text/plain' }
      });
      const result = await res.json();
      status.textContent = result.ok ? ('Submitted: ' + result.fileName) : ('Error: ' + (result.error || 'Unknown'));
      status.style.color = result.ok ? '#00ffaa' : '#ff4466';
    } catch (e) {
      status.textContent = 'Network error: ' + e.message;
      status.style.color = '#ff4466';
    }
  });

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
