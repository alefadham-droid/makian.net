// داده‌های سالن‌ها
let halls = [
    { id: 1, name: 'سالن ۱', count: 5240, breed: 'راس 308', age: 35 },
    { id: 2, name: 'سالن ۲', count: 3938, breed: 'کاب 500', age: 28 },
    { id: 3, name: 'سالن ۳', count: 2850, breed: 'راس 308', age: 21 },
    { id: 4, name: 'سالن ۴', count: 1920, breed: 'پلاس', age: 14 }
];

// داده‌های نمودار
let weightData = [2450, 2500, 2600, 2680, 2750, 2820, 2900];
let mortalityData = [12, 8, 15, 10, 7, 9, 11];

// نمایش اولیه
document.addEventListener('DOMContentLoaded', function() {
    updateHallsDisplay();
    renderCharts();
});

// توابع تنظیمات
function openSettings() {
    renderHallsEdit();
    document.getElementById('settingsModal').classList.add('active');
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.remove('active');
}

// نمایش فرم ویرایش سالن‌ها
function renderHallsEdit() {
    const container = document.getElementById('hallsEditContainer');
    if (!container) return;
    
    container.innerHTML = '';

    halls.forEach((hall) => {
        const hallDiv = document.createElement('div');
        hallDiv.className = 'hall-edit-item';
        hallDiv.innerHTML = `
            <div class="hall-edit-header">
                <h3>${hall.name}</h3>
                <span class="hall-id">شناسه: ${hall.id}</span>
            </div>
            <div class="hall-edit-row">
                <label>نام سالن:</label>
                <input type="text" class="hall-name-input" data-id="${hall.id}" value="${hall.name}">
            </div>
            <div class="hall-edit-row">
                <label>تعداد جوجه:</label>
                <input type="number" class="hall-count-input" data-id="${hall.id}" value="${hall.count}">
            </div>
            <div class="hall-edit-row">
                <label>نژاد:</label>
                <select class="hall-breed-input" data-id="${hall.id}">
                    <option value="راس 308" ${hall.breed === 'راس 308' ? 'selected' : ''}>راس 308</option>
                    <option value="کاب 500" ${hall.breed === 'کاب 500' ? 'selected' : ''}>کاب 500</option>
                    <option value="پلاس" ${hall.breed === 'پلاس' ? 'selected' : ''}>پلاس</option>
                    <option value="آرین" ${hall.breed === 'آرین' ? 'selected' : ''}>آرین</option>
                </select>
            </div>
            <div class="hall-edit-row">
                <label>سن (روز):</label>
                <input type="number" class="hall-age-input" data-id="${hall.id}" value="${hall.age}">
            </div>
            <button class="delete-btn" onclick="deleteHall(${hall.id})">حذف سالن</button>
        `;
        container.appendChild(hallDiv);
    });
}

// افزودن سالن جدید
function addNewHall() {
    const newId = halls.length > 0 ? Math.max(...halls.map(h => h.id)) + 1 : 1;
    halls.push({
        id: newId,
        name: `سالن ${newId}`,
        count: 1000,
        breed: 'راس 308',
        age: 1
    });
    renderHallsEdit();
}

// حذف سالن
function deleteHall(id) {
    if (halls.length <= 1) {
        alert('حداقل باید یک سالن وجود داشته باشد');
        return;
    }
    
    if (confirm('آیا از حذف این سالن اطمینان دارید؟')) {
        halls = halls.filter(h => h.id !== id);
        renderHallsEdit();
        updateHallsDisplay();
    }
}

// ذخیره تغییرات
function saveHallChanges() {
    const nameInputs = document.querySelectorAll('.hall-name-input');
    const countInputs = document.querySelectorAll('.hall-count-input');
    const breedInputs = document.querySelectorAll('.hall-breed-input');
    const ageInputs = document.querySelectorAll('.hall-age-input');

    nameInputs.forEach(input => {
        const id = parseInt(input.dataset.id);
        const hall = halls.find(h => h.id === id);
        if (hall) hall.name = input.value;
    });

    countInputs.forEach(input => {
        const id = parseInt(input.dataset.id);
        const hall = halls.find(h => h.id === id);
        if (hall) hall.count = parseInt(input.value) || 0;
    });

    breedInputs.forEach(input => {
        const id = parseInt(input.dataset.id);
        const hall = halls.find(h => h.id === id);
        if (hall) hall.breed = input.value;
    });

    ageInputs.forEach(input => {
        const id = parseInt(input.dataset.id);
        const hall = halls.find(h => h.id === id);
        if (hall) hall.age = parseInt(input.value) || 0;
    });

    updateHallsDisplay();
    closeSettingsModal();
    alert('✅ تغییرات با موفقیت ذخیره شد');
}

// به‌روزرسانی نمایش سالن‌ها
function updateHallsDisplay() {
    const row = document.getElementById('hallsRow');
    if (!row) return;
    
    row.innerHTML = '';

    halls.forEach((hall) => {
        const hallCard = document.createElement('div');
        hallCard.className = 'card hall-card';
        hallCard.innerHTML = `
            <div class="hall-badge">${hall.name}</div>
            <div class="card-title">🏭 موجودی</div>
            <div class="card-value">${hall.count.toLocaleString()}</div>
            <div class="card-sub">قطعه</div>
        `;
        row.appendChild(hallCard);
    });
}

// توابع گزارش‌گیری
function openDailyReport() {
    alert('📋 فرم گزارش روزانه باز می‌شود');
}

function openWaterVaccine() {
    const totalBirds = halls.reduce((sum, hall) => sum + hall.count, 0);
    const waterNeeded = Math.ceil(totalBirds / 1000) * 1.2; // 1.2 لیتر به ازای هر 1000 پرنده
    alert(`💉 برای ${totalBirds.toLocaleString()} پرنده، حدود ${waterNeeded} لیتر آب برای واکسیناسیون نیاز است`);
}

function openWaterCalc() {
    const totalBirds = halls.reduce((sum, hall) => sum + hall.count, 0);
    const dailyWater = totalBirds * 0.27; // 270 میلی‌لیتر به ازای هر پرنده
    alert(`💧 مصرف آب روزانه: ${Math.round(dailyWater / 1000)} لیتر`);
}

function openConsumptionCalc() {
    const totalBirds = halls.reduce((sum, hall) => sum + hall.count, 0);
    const feedPerBird = 0.12; // کیلوگرم
    const totalFeed = totalBirds * feedPerBird;
    alert(`🧮 مصرف دان روزانه: ${Math.round(totalFeed)} کیلوگرم`);
}

function openMortalityChart() {
    renderCharts();
}

function openMoreCalculations() {
    alert('📊 محاسبات تکمیلی در حال توسعه');
}

// نمودارها
function renderCharts() {
    const weightChart = document.getElementById('weightChart');
    const mortalityChart = document.getElementById('mortalityChart');
    
    if (weightChart) {
        weightChart.innerHTML = renderWeightChart();
    }
    
    if (mortalityChart) {
        mortalityChart.innerHTML = renderMortalityChart();
    }
}

function renderWeightChart() {
    const maxWeight = Math.max(...weightData);
    
    let chartHTML = '<div style="display: flex; align-items: flex-end; gap: 10px; height: 180px;">';
    
    weightData.forEach(weight => {
        const height = (weight / maxWeight) * 150;
        chartHTML += `<div style="flex: 1; background: #2d5a9b; height: ${height}px; border-radius: 10px 10px 0 0;"></div>`;
    });
    
    chartHTML += '</div><div style="display: flex; gap: 10px; margin-top: 10px;">';
    
    const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
    days.forEach(day => {
        chartHTML += `<span style="flex: 1; text-align: center; color: #999; font-size: 12px;">${day}</span>`;
    });
    
    chartHTML += '</div>';
    return chartHTML;
}

function renderMortalityChart() {
    const maxMortality = Math.max(...mortalityData);
    
    let chartHTML = '<div style="display: flex; align-items: flex-end; gap: 10px; height: 180px;">';
    
    mortalityData.forEach(mortality => {
        const height = (mortality / maxMortality) * 150;
        chartHTML += `<div style="flex: 1; background: #dc3545; height: ${height}px; border-radius: 10px 10px 0 0;"></div>`;
    });
    
    chartHTML += '</div><div style="display: flex; gap: 10px; margin-top: 10px;">';
    
    const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
    days.forEach(day => {
        chartHTML += `<span style="flex: 1; text-align: center; color: #999; font-size: 12px;">${day}</span>`;
    });
    
    chartHTML += '</div>';
    return chartHTML;
}

// بستن مودال با کلیک خارج
window.onclick = function(event) {
    const modal = document.getElementById('settingsModal');
    if (event.target == modal) {
        modal.classList.remove('active');
    }
}
