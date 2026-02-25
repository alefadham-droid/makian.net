// داده‌های سالن‌ها با یک سالن پیش‌فرض (در صورت نبود داده)
let halls = [];

// بارگذاری اولیه از localStorage
function loadHallsFromStorage() {
    const saved = localStorage.getItem('poultry_halls');
    if (saved) {
        try {
            halls = JSON.parse(saved);
        } catch (e) {
…
// بستن مودال با کلیک بیرون
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// اجرای اولیه
checkAuth();
