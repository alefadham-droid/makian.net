// داده‌های سالن‌ها با یک سالن پیش‌فرض (در صورت نبود داده)
let halls = [];

// بارگذاری اولیه از localStorage
function loadHallsFromStorage() {
    const saved = localStorage.getItem('poultry_halls');
    if (saved) {
        try {
            halls = JSON.parse(saved);
        } catch (e) {
            halls = [];
        }
    } else {
        // مقدار پیش‌فرض
        halls = [
            { 
                id: 1, 
                name: 'سالن ۱', 
                initialCount: 10000, 
                count: 10000, 
                breed: 'راس 308', 
                entryDate: '1404/4/12',
                dailyReports: [] 
            }
        ];
    }
}

// ذخیره halls در localStorage
function saveHallsToStorage() {
    localStorage.setItem('poultry_halls', JSON.stringify(halls));
}

// تابع تبدیل تاریخ میلادی به شمسی با ساعت و دقیقه
function toJalaliWithTime(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    let jalaliYear = year - 621;
    let jalaliMonth = month;
    let jalaliDay = day;
    return `${jalaliYear}/${jalaliMonth.toString().padStart(2, '0')}/${jalaliDay.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// ==================== مدیریت احراز هویت ====================

// --- تابع جدید برای نمایش پیام و هدایت کاربر ---
function showCentralRegistrationNotification(user) {
  const notificationDiv = document.createElement('div');
  notificationDiv.id = 'central-register-notification';
  notificationDiv.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background-color: #e0ffe0;
    border: 1px solid #4CAF50;
    padding: 15px;
    border-radius: 5px;
    z-index: 10000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    font-family: Vazir, Tahoma, sans-serif;
    max-width: 350px;
    text-align: center;
  `;
  notificationDiv.innerHTML = `
    <p>ثبت نام شما با موفقیت انجام شد!</p>
    <p>نام کاربری: <strong>${user.firstName} ${user.lastName}</strong></p>
    <p>شماره تماس: <strong>${user.phone}</strong></p>
    <p>شهر: <strong>${user.city}</strong></p>
    <a href="../makian-dashboard/register-log.html?fname=${encodeURIComponent(user.firstName)}&lname=${encodeURIComponent(user.lastName)}&phone=${encodeURIComponent(user.phone)}&city=${encodeURIComponent(user.city)}&province=${encodeURIComponent(user.province)}" target="_blank" style="
      display: inline-block;
      margin-top: 10px;
      padding: 5px 10px;
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      border-radius: 3px;
    ">ثبت نام در سیستم مرکزی</a>
    <button onclick="this.parentElement.remove()" style="
      margin-top: 10px;
      background-color: #f44336;
      color: white;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
      border-radius: 3px;
    ">بستن</button>
  `;
  document.body.appendChild(notificationDiv);

  // حذف پس از 20 ثانیه
  setTimeout(() => {
    if (notificationDiv.parentNode) {
      notificationDiv.remove();
    }
  }, 20000);
}


function checkAuth() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        document.getElementById('authContainer').classList.add('hidden');
        document.getElementById('dashboardContainer').classList.remove('hidden');
        const user = JSON.parse(loggedInUser);
        document.getElementById('profileName').innerText = user.firstName + ' ' + user.lastName;
        loadHallsFromStorage();  // بارگذاری اطلاعات سالن‌ها
        updateHallsDisplay();
        updateMainMetrics();
    } else {
        document.getElementById('authContainer').classList.remove('hidden');
        document.getElementById('dashboardContainer').classList.add('hidden');
    }
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    if (tab === 'login') {
        document.querySelector('.auth-tab').classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.querySelectorAll('.auth-tab')[1].classList.add('active');
        document.getElementById('signupForm').classList.add('active');
    }
}

function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    if (!username || !password) {
        alert('لطفاً نام کاربری و رمز عبور را وارد کنید');
        return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.phone === username && u.password === password);
    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        checkAuth();
    } else {
        alert('کاربری با این مشخصات یافت نشد. لطفاً ثبت‌نام کنید.');
    }
}

function handleSignup() {
    const firstName = document.getElementById('signupFirstName').value.trim();
    const lastName = document.getElementById('signupLastName').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const province = document.getElementById('signupProvince').value;
    const city = document.getElementById('signupCity').value.trim();

    if (!firstName || !lastName || !phone || !province || !city) {
        alert('لطفاً تمام فیلدها را پر کنید');
        return;
    }
    const password = phone;

    const newUser = {
        firstName,
        lastName,
        phone,
        province,
        city,
        password
    };

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.phone === phone)) {
        alert('این شماره تماس قبلاً ثبت‌نام شده است');
        return;
    }
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', JSON.stringify(newUser));
    checkAuth();

    // --- کد جدید: نمایش پیام بعد از ثبت نام ---
    showCentralRegistrationNotification(newUser);
}

function logout() {
    localStorage.removeItem('loggedInUser');
    checkAuth();
}

// ==================== توابع اصلی داشبورد ====================
function updateMainMetrics() {
    let totalFeed = 0;
    halls.forEach(hall => {
        totalFeed += hall.dailyReports.reduce((sum, r) => sum + r.feed, 0);
    });
    document.getElementById('totalFeed').innerText = totalFeed.toLocaleString();

    let totalWeight = 0;
    let birdCount = 0;
    halls.forEach(hall => {
        const lastWeightReport = [...hall.dailyReports].reverse().find(r => r.weight);
        if (lastWeightReport && hall.count > 0) {
            totalWeight += lastWeightReport.weight * hall.count;
            birdCount += hall.count;
        }
    });
    let conversion = 0;
    if (totalWeight > 0) {
        conversion = totalFeed / (totalWeight / 1000);
    }
    document.getElementById('conversionRate').innerText = conversion.toFixed(2);

    updateHallsDisplay();
}

function updateHallsDisplay() {
    const row = document.getElementById('hallsRow');
    row.innerHTML = '';
    halls.forEach(hall => {
        row.innerHTML += `
            <div class="card hall-card" data-hall-id="${hall.id}">
                <div class="hall-badge">${hall.name}</div>
                <div class="card-title">🏭 موجودی</div>
                <div class="card-value">${hall.count.toLocaleString()}</div>
                <div class="card-sub">قطعه</div>
                <div class="card-sub" style="margin-top:5px; color:#2d5a9b;">ورود: ${hall.entryDate}</div>
            </div>
        `;
    });
}

// مودال ورود جوجه
function openSettings() { renderHallsEdit(); document.getElementById('settingsModal').classList.add('active'); }
function closeSettingsModal() { document.getElementById('settingsModal').classList.remove('active'); }

function renderHallsEdit() {
    const container = document.getElementById('hallsEditContainer');
    container.innerHTML = '';
    halls.forEach((hall) => {
        const hallDiv = document.createElement('div');
        hallDiv.className = 'hall-edit-item';
        hallDiv.innerHTML = `
            <div class="hall-edit-header"><h3>${hall.name}</h3><span>شناسه: ${hall.id}</span></div>
            <div class="hall-edit-row"><label>نام سالن:</label><input type="text" class="hall-name-input" data-id="${hall.id}" value="${hall.name}"></div>
            <div class="hall-edit-row"><label>تعداد جوجه (اولیه):</label><input type="number" class="hall-initial-count-input" data-id="${hall.id}" value="${hall.initialCount}"></div>
            <div class="hall-edit-row"><label>نژاد:</label>
                <select class="hall-breed-input" data-id="${hall.id}">
                    <option value="انتخاب نژاد" ${hall.breed === 'انتخاب نژاد' ? 'selected' : ''}>انتخاب نژاد</option>
                    <option value="راس 308" ${hall.breed === 'راس 308' ? 'selected' : ''}>راس 308</option>
                    <option value="کاب 500" ${hall.breed === 'کاب 500' ? 'selected' : ''}>کاب 500</option>
                    <option value="پلاس" ${hall.breed === 'پلاس' ? 'selected' : ''}>پلاس</option>
                    <option value="آرین" ${hall.breed === 'آرین' ? 'selected' : ''}>آرین</option>
                </select>
            </div>
            <div class="hall-edit-row"><label style="color:#dc3545;">تاریخ ورود جوجه:</label><input type="text" class="hall-entrydate-input" data-id="${hall.id}" value="${hall.entryDate}" placeholder="مثال: 1404/4/12" style="border-color:#dc3545;"></div>
            <button class="delete-btn" onclick="deleteHall(${hall.id})">حذف سالن</button>
        `;
        container.appendChild(hallDiv);
    });
}

function addNewHall() {
    const newId = halls.length > 0 ? Math.max(...halls.map(h => h.id)) + 1 : 1;
    halls.push({ 
        id: newId, 
        name: `سالن ${newId}`, 
        initialCount: 0, 
        count: 0, 
        breed: 'انتخاب نژاد', 
        entryDate: 'ثبت نشده',
        dailyReports: []
    });
    renderHallsEdit();
}

function deleteHall(id) {
    if (halls.length <= 1) { alert('حداقل باید یک سالن وجود داشته باشد'); return; }
    if (confirm('آیا از حذف این سالن اطمینان دارید؟')) {
        halls = halls.filter(h => h.id !== id);
        renderHallsEdit();
        updateHallsDisplay();
        updateMainMetrics();
        saveHallsToStorage();
    }
}

function saveHallChanges() {
    document.querySelectorAll('.hall-name-input').forEach(inp => {
        const id = parseInt(inp.dataset.id); const hall = halls.find(h => h.id === id); if(hall) hall.name = inp.value;
    });
    document.querySelectorAll('.hall-initial-count-input').forEach(inp => {
        const id = parseInt(inp.dataset.id); const hall = halls.find(h => h.id === id); if(hall) hall.initialCount = parseInt(inp.value) || 0;
    });
    document.querySelectorAll('.hall-breed-input').forEach(inp => {
        const id = parseInt(inp.dataset.id); const hall = halls.find(h => h.id === id); if(hall) hall.breed = inp.value;
    });
    document.querySelectorAll('.hall-entrydate-input').forEach(inp => {
        const id = parseInt(inp.dataset.id); const hall = halls.find(h => h.id === id); if(hall) hall.entryDate = inp.value;
    });

    halls.forEach(hall => {
        const totalMortality = hall.dailyReports.reduce((sum, r) => sum + r.mortality, 0);
        hall.count = hall.initialCount - totalMortality;
        if (hall.count < 0) hall.count = 0;
    });

    updateHallsDisplay();
    updateMainMetrics();
    saveHallsToStorage();
    closeSettingsModal();
    alert('✅ تغییرات ذخیره شد');
}

// مودال تنظیم دور فن
function openFanCalculator() { 
    document.getElementById('fanModal').classList.add('active');
    calculateFanSpeed();
}
function closeFanModal() { document.getElementById('fanModal').classList.remove('active'); }

function calculateFanSpeed() {
    const age = parseFloat(document.getElementById('calcAge').value) || 0;
    const temp = parseFloat(document.getElementById('calcTemp').value) || 25;
    const humidity = parseFloat(document.getElementById('calcHumidity').value) || 60;
    const weight = parseFloat(document.getElementById('calcWeight').value) || 800;
    const fanType = document.getElementById('calcFanType').value;
    const maxRPM = parseFloat(document.getElementById('calcMaxRPM').value) || 3000;
    const freq = parseFloat(document.getElementById('calcFreq').value) || 50;

    let speed = 1000;
    speed += age * 10;
    if (temp > 25) speed += (temp - 25) * 20;
    else if (temp < 20) speed -= (20 - temp) * 10;
    if (humidity > 70) speed += Math.floor((humidity - 70) / 10) * 50;
    if (weight > 1000) speed += Math.floor((weight - 1000) / 100) * 30;
    if (fanType === 'centrifugal') speed *= 1.2;
    speed = Math.min(maxRPM, Math.max(500, Math.round(speed)));

    document.getElementById('suggestedRPM').innerText = speed;
    const equivalentFreq = (speed / maxRPM) * freq;
    document.getElementById('suggestedFrequency').innerText = `(معادل ${equivalentFreq.toFixed(1)} Hz در اینورتر)`;
}

// توابع placeholder
function openWaterVaccine() { alert('محاسبه آب واکسن'); }
function openWaterCalc() { alert('محاسبه مصرف آب'); }
function openConsumptionCalc() { alert('محاسبه مصرف شده'); }
function openMortalityChart() { alert('نمودار تلفات'); }
function openMoreCalculations() { alert('محاسبات تکمیلی'); }

// مودال نمایش گزارشات
function openReportsModal() {
    const modal = document.getElementById('reportsModal');
    const select = document.getElementById('modalReportHallSelect');
    select.innerHTML = '';
    halls.forEach(hall => {
        const option = document.createElement('option');
        option.value = hall.id;
        option.textContent = hall.name;
        select.appendChild(option);
    });
    loadReportsIntoModal(halls[0]?.id);
    modal.classList.add('active');
}
function closeReportsModal() { document.getElementById('reportsModal').classList.remove('active'); }

function loadReportsIntoModal(hallId) {
    const hall = halls.find(h => h.id == hallId);
    if (!hall) return;

    const totalMortality = hall.dailyReports.reduce((sum, r) => sum + r.mortality, 0);
    const totalFeed = hall.dailyReports.reduce((sum, r) => sum + r.feed, 0);
    const summaryDiv = document.getElementById('modalSummary');
    summaryDiv.innerHTML = `
        <div class="summary-item"><span class="label">🐔 موجودی فعلی</span><span class="value">${hall.count.toLocaleString()}</span></div>
        <div class="summary-item"><span class="label">💀 مجموع تلفات</span><span class="value">${totalMortality}</span></div>
        <div class="summary-item"><span class="label">🌾 مجموع مصرف دان</span><span class="value">${totalFeed} kg</span></div>
    `;

    const listDiv = document.getElementById('modalReportsList');
    let html = '<h4>📋 گزارش‌های ثبت‌شده</h4>';
    if (hall.dailyReports.length === 0) {
        html += '<div class="no-reports">هیچ گزارشی ثبت نشده است</div>';
    } else {
        const sorted = [...hall.dailyReports].sort((a, b) => (a.date > b.date ? -1 : 1));
        sorted.forEach(report => {
            html += `<div class="report-item">
                <span class="report-date">${report.date}</span>
                <span class="report-details">📉 تلفات: ${report.mortality} | 🌾 دان: ${report.feed} کیلوگرم ${report.weight ? '| ⚖️ وزن: ' + report.weight + ' گرم' : ''}</span>
            </div>`;
        });
    }
    listDiv.innerHTML = html;
}

// مودال گزارش روزانه
function openDailyReportModal() {
    const modal = document.getElementById('dailyReportModal');
    const select = document.getElementById('modalDailyHallSelect');
    select.innerHTML = '';
    halls.forEach(hall => {
        const option = document.createElement('option');
        option.value = hall.id;
        option.textContent = hall.name;
        select.appendChild(option);
    });
    updateModalAgeDisplay();
    renderModalReportsList();
    modal.classList.add('active');
}
function closeDailyReportModal() { document.getElementById('dailyReportModal').classList.remove('active'); }

function getSelectedModalHallId() {
    const select = document.getElementById('modalDailyHallSelect');
    return select ? parseInt(select.value) : null;
}

function updateModalAgeDisplay() {
    const hallId = getSelectedModalHallId();
    if (!hallId) return;
    const hall = halls.find(h => h.id === hallId);
    const age = hall.dailyReports.length + 1;
    const ageDisplay = document.getElementById('modalCalculatedAgeDisplay');
    if (ageDisplay) ageDisplay.innerText = age;

    const weightGroup = document.getElementById('modalWeightGroup');
    if (weightGroup) {
        if (age > 0 && age % 7 === 0) {
            weightGroup.style.display = 'block';
        } else {
            weightGroup.style.display = 'none';
        }
    }
}

function renderModalReportsList() {
    const hallId = getSelectedModalHallId();
    if (!hallId) return;
    const hall = halls.find(h => h.id === hallId);
    const container = document.getElementById('modalReportsListContainer');
    if (!container) return;

    let html = '<div class="reports-list"><h4>📋 گزارش‌های ثبت‌شده</h4>';
    if (hall.dailyReports.length === 0) {
        html += '<div class="no-reports">هیچ گزارشی ثبت نشده است</div>';
    } else {
        const sorted = [...hall.dailyReports].sort((a, b) => (a.date > b.date ? -1 : 1));
        sorted.forEach(report => {
            html += `<div class="report-item">
                <span class="report-date">${report.date}</span>
                <span class="report-details">📉 تلفات: ${report.mortality} | 🌾 دان: ${report.feed} کیلوگرام ${report.weight ? '| ⚖️ وزن: ' + report.weight + ' گرم' : ''}</span>
            </div>`;
        });
    }
    html += '</div>';
    container.innerHTML = html;
}

function submitModalDailyReport() {
    const hallId = getSelectedModalHallId();
    if (!hallId) return;
    const hall = halls.find(h => h.id === hallId);
    const mortality = parseInt(document.getElementById('modalMortalityInput').value) || 0;
    const feed = parseInt(document.getElementById('modalFeedInput').value) || 0;
    const weightInput = document.getElementById('modalWeightInput');
    const weight = weightInput && weightInput.style.display !== 'none' ? parseInt(weightInput.value) : null;

    const todayJalali = toJalaliWithTime(new Date());

    hall.dailyReports.push({
        date: todayJalali,
        mortality: mortality,
        feed: feed,
        weight: weight
    });

    const totalMortality = hall.dailyReports.reduce((sum, r) => sum + r.mortality, 0);
    hall.count = hall.initialCount - totalMortality;
    if (hall.count < 0) hall.count = 0;

    updateMainMetrics();
    saveHallsToStorage(); // ذخیره پس از ثبت گزارش

    alert('✅ گزارش روزانه ثبت شد');
    document.getElementById('modalMortalityInput').value = 0;
    document.getElementById('modalFeedInput').value = 0;
    if (weightInput) weightInput.value = '';
    updateModalAgeDisplay();
    renderModalReportsList();

    const reportsModal = document.getElementById('reportsModal');
    if (reportsModal.classList.contains('active')) {
        const select = document.getElementById('modalReportHallSelect');
        if (select) loadReportsIntoModal(select.value);
    }
}

// ==================== توابع مدیریت اطلاعات (Export/Import) ====================
function exportData() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const data = {
        users: users,
        halls: halls
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poultry_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            // اعتبارسنجی ساده
            if (data.users !== undefined && data.halls !== undefined) {
                // ذخیره کاربران
                localStorage.setItem('users', JSON.stringify(data.users));
                // جایگزینی halls
                halls = data.halls;
                saveHallsToStorage();
                // به‌روزرسانی رابط کاربری
                updateHallsDisplay();
                updateMainMetrics();
                alert('✅ اطلاعات با موفقیت بارگذاری شد.');
            } else {
                alert('❌ ساختار فایل نامعتبر است.');
            }
        } catch (error) {
            alert('❌ خطا در خواندن فایل: ' + error.message);
        }
        // پاک کردن مقدار input تا بتوان دوباره فایل یکسان انتخاب کرد
        document.getElementById('importFile').value = '';
    };
    reader.readAsText(file);
}

// بستن مودال با کلیک بیرون
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// اجرای اولیه
checkAuth();
