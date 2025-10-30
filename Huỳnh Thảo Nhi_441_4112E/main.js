
// main.js - handles menu navigation and Q1-Q7 functionality

// --- Helper ---
function el(id){return document.getElementById(id);}
function showSection(name){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  const s = document.getElementById(name);
  if(s) s.classList.add('active');
}

// DEFAULT student info (About me)
const student = {
  id: "113",
  name: "Huỳnh Thảo Nhi",
  className: "K234111441",
  avatar: "images/0c9b55dd3569b837e178.jpg"
};

// About me (Q2)
function renderAbout(){
    const aboutDiv = document.getElementById("about");
    aboutDiv.innerHTML = `
      <h2>About Me</h2>
      <p><b>Student ID:</b>K234111441</p>
      <p><b>Full Name:</b>Huỳnh Thảo Nhi</p>
      <p><b>Class:</b>K234112E</p>
      <img src="images/0c9b55dd3569b837e178.jpg" alt="avatar" style="width:140px;border-radius:10px;margin-top:10px;">
    `;
    showSection("about");
  }
  
// ---------- Q3: Books (load XML and render nice table) ----------
function loadBooks(){
  fetch('books.xml').then(r=>r.text()).then(txt=> {
    const parser = new DOMParser();
    const xml = parser.parseFromString(txt,'application/xml');
    const books = Array.from(xml.getElementsByTagName('book')).map(b=>({
      id: b.getElementsByTagName('id')[0]?.textContent || '',
      name: b.getElementsByTagName('name')[0]?.textContent || '',
      description: b.getElementsByTagName('description')[0]?.textContent || '',
      image: b.getElementsByTagName('image')[0]?.textContent || ''
    }));
    renderBooksTable(books);
  }).catch(err=>{
    el('books_area').innerHTML = '<p style="color:red">Không load được books.xml — kiểm tra đường dẫn.</p>';
  });
}

function renderBooksTable(books){
  let html = `<table><thead><tr><th>Cover</th><th>ID</th><th>Title</th><th>Description</th><th>Action</th></tr></thead><tbody>`;
  books.forEach(b=>{
    html += `<tr>
      <td><img class="thumb" src="${b.image}" alt="${escapeHtml(b.name)}"></td>
      <td>${escapeHtml(b.id)}</td>
      <td>${escapeHtml(b.name)}</td>
      <td>${escapeHtml(b.description).substring(0,220)}${b.description.length>220? '...':''}</td>
      <td><button class="btn" onclick='openBookDetail(${JSON.stringify(b).replaceAll("'","&#39;")})'>View</button></td>
    </tr>`;
  });
  html += `</tbody></table>`;
  el('books_area').innerHTML = html;
  showSection('books');
}

function openBookDetail(book){
  const content = `<h3>${escapeHtml(book.name)}</h3>
    <img src="${book.image}" style="width:200px;float:left;margin-right:12px;border-radius:6px;">
    <p><strong>ID:</strong> ${escapeHtml(book.id)}</p>
    <p>${escapeHtml(book.description)}</p>
    <div style="clear:both"></div>`;
  el('books_area').innerHTML = content;
  showSection('books');
}

// ---------- Q4: Customers (form + localStorage) ----------
const CUSTOMER_KEY = 'exam_customers_v1';

function loadCustomers(){
  const raw = localStorage.getItem(CUSTOMER_KEY);
  return raw ? JSON.parse(raw) : [];
}
function saveCustomers(list){ localStorage.setItem(CUSTOMER_KEY, JSON.stringify(list)); }

function renderCustomers(){
  const list = loadCustomers();
  let html = `<h3>Customers</h3>
    <div style="max-width:760px;">
      <div class="form-row"><input id="c_name" placeholder="Name"><input id="c_phone" placeholder="Phone"></div>
      <div class="form-row"><input id="c_email" placeholder="Email"><input id="c_age" type="number" placeholder="Age"></div>
      <div class="form-row"><button class="btn" onclick="addCustomer()">Add customer</button></div>
    </div>`;
  html += `<table><thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Age</th><th>Action</th></tr></thead><tbody>`;
  list.forEach((c,idx)=>{
    const cls = (c.age>=18 && c.age<=35) ? 'customer-row yellow' : 'customer-row magenta';
    html += `<tr class="${cls}"><td>${idx+1}</td><td>${escapeHtml(c.name)}</td><td>${escapeHtml(c.phone)}</td><td>${escapeHtml(c.email)}</td><td>${c.age}</td><td><button class="btn danger" onclick="removeCustomer(${idx})">Remove</button></td></tr>`;
  });
  html += `</tbody></table>`;
  el('customers_area').innerHTML = html;
  showSection('customers');
}

function addCustomer(){
  const name = el('c_name').value.trim();
  const phone = el('c_phone').value.trim();
  const email = el('c_email').value.trim();
  const age = Number(el('c_age').value || 0);
  if(!name){ alert('Name required'); return; }
  const list = loadCustomers();
  list.push({name,phone,email,age});
  saveCustomers(list);
  renderCustomers();
  el('c_name').value='';el('c_phone').value='';el('c_email').value='';el('c_age').value='';
}

function removeCustomer(idx){
  if(!confirm('Confirm remove this customer?')) return;
  const list = loadCustomers();
  list.splice(idx,1);
  saveCustomers(list);
  renderCustomers();
}

// ---------- Q5: Styles demo ----------
function renderStyle(){
  const html = `<h3>Style: Inline / Internal / External</h3>
    <p>Inline style example: <span style="color:blue;font-weight:bold">This text is inline-styled</span></p>
    <p>Internal style example below (see <code>&lt;style&gt;</code> in head of this page)</p>
    <p>External style: loaded from <code>style.css</code>. Try resizing window.</p>`;
  el('style_area').innerHTML = html;
  showSection('style');
}

// ---------- Q6: Weather API (demo using Open-Meteo fallback) ----------
const sampleCities = [
  {name:"Ho Chi Minh City", lat:10.8231, lon:106.6297},
  {name:"Hanoi", lat:21.0278, lon:105.8342},
  {name:"Da Nang", lat:16.0544, lon:108.2022}
];

// =============== WEATHER API (Tuổi Trẻ) - FULL 63 PROVINCES ===============
function loadWeatherAPI(){
    const provinces = {
      "": "--Chọn tỉnh--",
      "2347719": "An Giang",
      "20070078": "Bình Dương",
      "20070086": "Bình Phước",
      "2347731": "Bình Thuận",
      "2347730": "Bình Định",
      "20070081": "Bạc Liêu",
      "20070087": "Bắc Giang",
      "20070084": "Bắc Kạn",
      "20070088": "Bắc Ninh",
      "2347703": "Bến Tre",
      "2347704": "Cao Bằng",
      "20070082": "Cà Mau",
      "2347732": "Cần Thơ",
      "28301718": "Điện Biên",
      "20070085": "Đà Nẵng",
      "1252375": "Đà Lạt",
      "2347720": "Đắk Lắk",
      "28301719": "Đắk Nông",
      "2347721": "Đồng Nai",
      "2347722": "Đồng Tháp",
      "2347733": "Gia Lai",
      "2347727": "Hà Nội",
      "2347728": "TP. Hồ Chí Minh",
      "2347734": "Hà Giang",
      "2347741": "Hà Nam",
      "2347736": "Hà Tĩnh",
      "2347737": "Hòa Bình",
      "20070079": "Hưng Yên",
      "20070080": "Hải Dương",
      "2347707": "Hải Phòng",
      "28301720": "Hậu Giang",
      "2347738": "Khánh Hòa",
      "2347723": "Kiên Giang",
      "20070076": "Kon Tum",
      "2347708": "Lai Châu",
      "2347710": "Long An",
      "2347740": "Lào Cai",
      "2347709": "Lâm Đồng",
      "2347718": "Lạng Sơn",
      "20070089": "Nam Định",
      "2347742": "Nghệ An",
      "2347743": "Ninh Bình",
      "2347744": "Ninh Thuận",
      "20070091": "Phú Thọ",
      "2347745": "Phú Yên",
      "2347746": "Quảng Bình",
      "2347711": "Quảng Nam",
      "20070077": "Quảng Ngãi",
      "2347712": "Quảng Ninh",
      "2347747": "Quảng Trị",
      "2347748": "Sóc Trăng",
      "2347713": "Sơn La",
      "2347715": "Thanh Hóa",
      "2347716": "Thái Bình",
      "20070083": "Thái Nguyên",
      "2347749": "Thừa Thiên Huế",
      "2347717": "Tiền Giang",
      "2347750": "Trà Vinh",
      "2347751": "Tuyên Quang",
      "2347714": "Tây Ninh",
      "2347752": "Vĩnh Long",
      "20070090": "Vĩnh Phúc",
      "2347729": "Vũng Tàu",
      "2347753": "Yên Bái"
    };
  
    let html = `<h3>Dự báo thời tiết Tuổi Trẻ</h3>
                <label>Chọn tỉnh:</label>
                <select id="province">
                  ${Object.entries(provinces).map(([id, name]) => `<option value="${id}">${name}</option>`).join('')}
                </select>
                <button onclick="fetchWeather()">Xem dự báo</button>
                <div id="weatherResult" style="margin-top:20px;"></div>`;
    el('weather_area').innerHTML = html;
    showSection('weather');
  }
  
  async function fetchWeather(){
    const id = document.getElementById('province').value;
    const resultDiv = document.getElementById('weatherResult');
    if(!id){
      resultDiv.innerHTML = "<b>⚠️ Vui lòng chọn tỉnh!</b>";
      return;
    }
    resultDiv.innerHTML = "⏳ Đang tải dữ liệu...";
    try {
      const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://utils3.cnnd.vn/ajax/weatherinfo/${id}.htm`)}`;
      const response = await fetch(apiUrl);
      const wrapped = await response.json();
      const data = JSON.parse(wrapped.contents);
      const info = data.Data.data.datainfo;
      resultDiv.innerHTML = `
        <div style="font-size:48px;font-weight:bold;color:#e63946;">${info.temperature}°${info.degree}</div>
        <div style="font-size:22px;">${info.status}</div>
        <p><b>Cảm giác như:</b> ${info.feels_like}°${info.degree}</p>
        <p><b>Độ ẩm:</b> ${info.humidity}</p>
        <p><b>Chỉ số UV:</b> ${info.UV_index.index} (${info.UV_index.status})</p>
        <p><b>Gió:</b> ${info.wind.index} ${info.wind.unit} (${info.windDirection})</p>
        <p><b>Mặt trời mọc/lặn:</b> ${info.sunrise} / ${info.sunset}</p>
        <p><b>Chất lượng không khí:</b> ${info.air.status} (AQI ${info.air.aqi})</p>
      `;
    } catch (err) {
      console.error(err);
      resultDiv.innerHTML = `<p style="color:red;">❌ Không thể tải dữ liệu thời tiết.</p>`;
    }
  }
  
// ---------- Q7: RSS (VnExpress Education) ----------
function loadRSS(){
    const rssUrl = encodeURIComponent('https://vnexpress.net/rss/giao-duc.rss');
    const api = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;
    fetch(api)
      .then(r=>r.json())
      .then(resp=>{
        if(resp.status !== 'ok'){
          el('rss_area').innerHTML = '<p>Không load được RSS (CORS/Proxy). Bạn cần proxy hoặc dùng server.</p>';
          return;
        }
        let html = `<h3>VnExpress - Education (Tin hôm nay)</h3><ul>`;
        const today = new Date().toDateString(); // lấy ngày hôm nay
        let count = 0;
        resp.items.forEach(it=>{
          const pub = new Date(it.pubDate).toDateString();
          if(pub === today){
            html += `<li><a href="${it.link}" target="_blank">${escapeHtml(it.title)}</a> <small>${new Date(it.pubDate).toLocaleString('vi-VN')}</small></li>`;
            count++;
          }
        });
        if(count === 0) html += `<li>Không có tin mới hôm nay.</li>`;
        html += `</ul>`;
        el('rss_area').innerHTML = html;
        showSection('rss');
      })
      .catch(e=>{
        el('rss_area').innerHTML = `<p>Error loading RSS: ${e}</p>`;
      });
  }
  


// ---------- utility ----------
function escapeHtml(str){ if(!str) return ''; return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

// Initial setup when page loads
window.addEventListener('DOMContentLoaded', ()=>{
  renderAbout();
  loadBooks();
  renderCustomers();
  renderStyle();
  loadWeatherAPI();
  // note: RSS loads on demand when user clicks menu
});

// --- Right Sidebar greeting + clock ---
function updateSidebar(){
    const now = new Date();
    const hour = now.getHours();
    let greeting = "Chào buổi sáng ☀️";
    if(hour >= 12 && hour < 18) greeting = "Chào buổi chiều 🌤️";
    else if(hour >= 18) greeting = "Chào buổi tối 🌙";
  
    const clock = now.toLocaleTimeString('vi-VN');
    document.getElementById("greeting").textContent = greeting;
    document.getElementById("clock").textContent = clock;
  }
  // Cập nhật mỗi giây
  setInterval(updateSidebar, 1000);
  updateSidebar();
  
// --- Toggle submenu when clicked ---
document.querySelectorAll('.submenu > button').forEach(btn=>{
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      // Ẩn hết các menu khác
      document.querySelectorAll('.submenu-list').forEach(list=>{
        if(list !== this.nextElementSibling) list.style.display = 'none';
      });
      // Hiện / ẩn menu con được click
      const sub = this.nextElementSibling;
      sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
    });
  });
  
  // Ẩn menu con khi click ra ngoài
  document.addEventListener('click', ()=> {
    document.querySelectorAll('.submenu-list').forEach(list=> list.style.display='none');
  });
  



  function updateDateTime() {
    const studentName = "Huỳnh Thảo Nhi";
    const now = new Date().toLocaleString("vi-VN");
    document.getElementById("my_p").innerText =
      "Designed by student " + studentName + " — Today is " + now;
  }

  function startClock() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
  }

  // Tự động chạy khi trang được tải
  startClock();


  
  async function loadStockInfo() {
    const tbody = document.getElementById("stock_tbody");
    if(!tbody) return;
  
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:#777;">⏳ Đang tải dữ liệu...</td></tr>`;
  
    try {
      const proxyUrl = "https://api.allorigins.win/get?url=" + 
                       encodeURIComponent("https://gadgets.dantri.com.vn/api/finance/stocks");
      const res = await fetch(proxyUrl);
      const wrapped = await res.json();
      const stockList = JSON.parse(wrapped.contents);
  
      tbody.innerHTML = "";
      stockList.slice(0, 8).forEach(stock => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${stock.code}</td>
          <td style="color:#0077b6;font-weight:600;">${stock.price}</td>
          <td style="font-size:12px;color:#555;">${stock.sourceUpdatedAt}</td>
        `;
        tbody.appendChild(tr);
      });
    } catch(e) {
      console.error(e);
      tbody.innerHTML = `<tr><td colspan="3" style="color:red;text-align:center;">❌ Không thể tải dữ liệu</td></tr>`;
    }
  }
  
  document.addEventListener("DOMContentLoaded", loadStockInfo);
