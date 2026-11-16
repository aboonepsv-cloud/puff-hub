document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  document.getElementById('todayDate').textContent = today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

  const PRICES = [1, 2, 3, 5, 10, 20, 30, 50];
  const ROWS_PER_PRICE = 4;

  const GAME_LIST = {"1814": {"name": "SANTA IS COMING", "tickets": 100, "price": 1}, "1813": {"name": "MINTY MULTIPLIER", "tickets": 100, "price": 2}, "1812": {"name": "JINGLE ALL THE WAY", "tickets": 100, "price": 3}, "1811": {"name": "WHAT`S UNDER THE TREE", "tickets": 60, "price": 5}, "1810": {"name": "NORTH POLE PAYOUT", "tickets": 60, "price": 10}, "1809": {"name": "MERRY & BRIGHT", "tickets": 30, "price": 20}, "1808": {"name": "LET IT SNOW", "tickets": 30, "price": 30}, "1807": {"name": "FESTIVE $5,000", "tickets": 50, "price": 50}, "1806": {"name": "CASH GRAB", "tickets": 100, "price": 1}, "1805": {"name": "GHOSTBUSTERS", "tickets": 100, "price": 2}, "1804": {"name": "FAT STACKS", "tickets": 60, "price": 5}, "1803": {"name": "CANDY-COATED CA$H", "tickets": 60, "price": 10}, "1802": {"name": "GAME SHOW EXPERIENCE", "tickets": 30, "price": 30}, "1801": {"name": "THE WIZARD OF OZ GLINDA THE", "tickets": 100, "price": 1}, "1800": {"name": "WINNER WINNER CHICKEN DINNER", "tickets": 100, "price": 2}, "1799": {"name": "THE WIZARD OF OZ YELLOW BRICK", "tickets": 60, "price": 5}, "1798": {"name": "THE WIZARD OF OZ THE GREAT AND", "tickets": 60, "price": 10}, "1797": {"name": "SNAKE, RATTLE AND ROLL", "tickets": 30, "price": 20}, "1796": {"name": "CA$H MONEY", "tickets": 50, "price": 50}, "1795": {"name": "BRIGHT BUCK$", "tickets": 100, "price": 1}, "1794": {"name": "$20 FRENZY", "tickets": 100, "price": 2}, "1793": {"name": "CROSSWORD DELUXE", "tickets": 60, "price": 5}, "1792": {"name": "WILD SIDE", "tickets": 60, "price": 5}, "1791": {"name": "VIP BONUS CASH", "tickets": 60, "price": 10}, "1790": {"name": "$1,500,000 SUPER STAR", "tickets": 30, "price": 30}, "1789": {"name": "SUPER 7S", "tickets": 100, "price": 2}, "1788": {"name": "LIGHTS, CAMERA, CROSSWORD", "tickets": 100, "price": 3}, "1787": {"name": "FEVER DOUBLER", "tickets": 60, "price": 5}, "1786": {"name": "RUBY RICH3S", "tickets": 60, "price": 10}, "1785": {"name": "THE GAME OF LIFE", "tickets": 30, "price": 20}, "1784": {"name": "MILLION DOLLAR WIN IT ALL", "tickets": 50, "price": 50}, "1783": {"name": "GOLD FISH", "tickets": 100, "price": 1}, "1782": {"name": "GUS", "tickets": 60, "price": 5}, "1781": {"name": "WIN WIN WIN", "tickets": 60, "price": 10}, "1780": {"name": "TRIPLE RED 777", "tickets": 30, "price": 30}, "1779": {"name": "A LATTE MONEY", "tickets": 100, "price": 1}, "1778": {"name": "MONEY RUSH", "tickets": 100, "price": 2}, "1777": {"name": "MONEY BOX BINGO", "tickets": 60, "price": 5}, "1776": {"name": "$100 BLOWOUT", "tickets": 60, "price": 5}, "1775": {"name": "$250 BLOWOUT", "tickets": 60, "price": 10}, "1774": {"name": "$500 BLOWOUT", "tickets": 30, "price": 20}, "1773": {"name": "5 STAR WINS", "tickets": 100, "price": 1}, "1771": {"name": "BIG BONUS TRIPLE PLAY", "tickets": 60, "price": 5}, "1770": {"name": "PHILADELPHIA 76ERS", "tickets": 60, "price": 5}, "1769": {"name": "CODE WORD CROSSWORD", "tickets": 60, "price": 10}, "1768": {"name": "$120,000,000 PAYOUT", "tickets": 30, "price": 30}, "1767": {"name": "$500 A WEEK FOR LIFE", "tickets": 100, "price": 1}, "1765": {"name": "$10,000 A MONTH FOR LIFE", "tickets": 60, "price": 5}, "1764": {"name": "$20,000 A MONTH FOR LIFE", "tickets": 60, "price": 10}, "1763": {"name": "$500,000 A YEAR FOR LIFE", "tickets": 30, "price": 20}, "1762": {"name": "$1,000,000 A YEAR FOR LIFE", "tickets": 50, "price": 50}, "1758": {"name": "ELF", "tickets": 60, "price": 5}, "1757": {"name": "$2,500 FESTIVE FRENZY", "tickets": 60, "price": 10}, "1755": {"name": "MERRY MONEY MATCH", "tickets": 30, "price": 30}, "1753": {"name": "CROSSWORD EXTRA", "tickets": 100, "price": 3}, "1751": {"name": "EXTREME GREEN", "tickets": 60, "price": 10}, "1750": {"name": "CASH SPECTACULAR", "tickets": 30, "price": 30}, "1747": {"name": "JURASSIC PARK", "tickets": 60, "price": 10}, "1746": {"name": "MILLIONAIRE LOADING", "tickets": 30, "price": 20}, "1744": {"name": "GOAT LOAD OF CASH CROSSWORD", "tickets": 60, "price": 5}, "1742": {"name": "$3 MILLION MEGA MOOLAH MULTIPL", "tickets": 30, "price": 30}, "1740": {"name": "BONUS BALL BINGO", "tickets": 100, "price": 3}, "1739": {"name": "MONOPOLY SECRET VAULT", "tickets": 60, "price": 5}, "1735": {"name": "SIX FIGURES", "tickets": 60, "price": 10}, "1734": {"name": "3S A CHARM", "tickets": 30, "price": 30}, "1724": {"name": "LADY LUCK", "tickets": 60, "price": 10}, "1723": {"name": "THE HUNT FOR $3,000,000", "tickets": 30, "price": 30}, "1719": {"name": "FAST $1,000", "tickets": 60, "price": 10}, "1717": {"name": "$5,000,000 LION`S SHARE", "tickets": 50, "price": 50}, "1707": {"name": "LUCKY 13", "tickets": 60, "price": 5}, "1706": {"name": "GAME OF THRONES", "tickets": 60, "price": 10}, "1696": {"name": "MEGA BUCKS", "tickets": 30, "price": 30}, "1693": {"name": "KEYS AND CASH", "tickets": 60, "price": 5}, "1682": {"name": "$160 MILLION CASH BLOWOUT", "tickets": 30, "price": 30}};

  function makeRow(price) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" class="bin entry"></td>
      <td><input type="text" class="game entry"></td>
      <td class="auto-cell game-name"></td>
      <td class="auto-cell tickets-per"></td>
      <td>
        <select class="status entry">
          <option value="">—</option>
          <option>Open</option>
          <option>Activated</option>
          <option>Partial Pack Settle</option>
          <option>Settled</option>
        </select>
      </td>
      <td><input type="number" class="start entry"></td>
      <td><input type="number" class="end entry"></td>
      <td class="auto-cell sold">0</td>
      <td class="auto-cell value">0.00</td>
      <td class="auto-cell row-status"></td>
      <td><button type="button" class="remove-row">×</button></td>
    `;
    return tr;
  }

  function buildSections() {
    const container = document.getElementById('priceSections');
    container.innerHTML = '';
    PRICES.forEach(price => {
      const section = document.createElement('div');
      section.className = 'price-section';
      section.dataset.price = price;
      section.innerHTML = `
        <h4>$${price} Tickets <button type="button" class="add-row">+ Row</button></h4>
        <table>
          <thead>
            <tr>
              <th>Bin #</th>
              <th>Game / Book #</th>
              <th>Game Name</th>
              <th>Tickets/Book</th>
              <th>Pack Status</th>
              <th>Starting #</th>
              <th>Ending #</th>
              <th>Sold</th>
              <th>Value</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <div class="section-total">Section total: <span class="sec-tickets">0</span> tickets / $<span class="sec-value">0.00</span></div>
      `;
      const tbody = section.querySelector('tbody');
      for (let i = 0; i < ROWS_PER_PRICE; i++) {
        tbody.appendChild(makeRow(price));
      }
      container.appendChild(section);
    });
    bindAll();
  }

  function bindAll() {
    document.querySelectorAll('.add-row').forEach(btn => {
      btn.onclick = () => {
        const section = btn.closest('.price-section');
        const tbody = section.querySelector('tbody');
        const tr = makeRow(section.dataset.price);
        tbody.appendChild(tr);
        bindRow(tr);
        recalc();
      };
    });
    document.querySelectorAll('.price-section tbody tr').forEach(bindRow);
    document.querySelectorAll('#page-lottery .entry').forEach(el => {
      el.addEventListener('input', recalc);
    });
    recalc();
  }

  function bindRow(tr) {
    tr.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', recalc);
      el.addEventListener('change', recalc);
    });
    tr.querySelector('.remove-row')?.addEventListener('click', () => { tr.remove(); recalc(); });
  }

  function recalc() {
    let totalTickets = 0;
    let totalValue = 0;
    const errors = [];

    document.querySelectorAll('.price-section').forEach(section => {
      const sectionPrice = parseInt(section.dataset.price, 10);
      let secTickets = 0;
      let secValue = 0;

      section.querySelectorAll('tbody tr').forEach(tr => {
        const book = tr.querySelector('.game')?.value.trim();
        const start = parseFloat(tr.querySelector('.start')?.value);
        const end = parseFloat(tr.querySelector('.end')?.value);
        const nameCell = tr.querySelector('.game-name');
        const tpbCell = tr.querySelector('.tickets-per');
        const soldCell = tr.querySelector('.sold');
        const valueCell = tr.querySelector('.value');
        const statusCell = tr.querySelector('.row-status');

        const game = GAME_LIST[book] || null;
        if (nameCell) nameCell.textContent = game ? game.name : (book ? 'Unknown' : '');
        if (tpbCell) tpbCell.textContent = game ? game.tickets : '';

        let sold = 0;
        let value = 0;
        let statusText = '';
        let statusColor = '';

        if (book && game && game.price !== sectionPrice) {
          statusText = 'WRONG PRICE';
          statusColor = '#ff4466';
          errors.push('Wrong price');
        } else if (!isNaN(start) && !isNaN(end) && end < start) {
          statusText = 'ERROR';
          statusColor = '#ff4466';
          errors.push('Ending < Starting');
        } else if (!isNaN(start) && !isNaN(end) && end >= start) {
          sold = end - start;
          value = sold * sectionPrice;
          statusText = 'OK';
          statusColor = '#00aa55';
        }

        if (soldCell) soldCell.textContent = sold;
        if (valueCell) valueCell.textContent = value.toFixed(2);
        if (statusCell) { statusCell.textContent = statusText; statusCell.style.color = statusColor; }
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
    if (errDiv) errDiv.textContent = errors.length ? 'Fix red ERROR / WRONG PRICE rows before submit' : '';
  }

  buildSections();

  document.getElementById('submitLottery')?.addEventListener('click', async () => {
    const status = document.getElementById('submitStatus');
    status.textContent = 'Submitting...';
    status.style.color = '#00aa55';

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
      status.style.color = result.ok ? '#00aa55' : '#ff4466';
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
