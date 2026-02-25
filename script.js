// --- بخش کد اضافه شده در script.js ---

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

// --- تغییر در تابع handleSignup ---
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

// --- بقیه کد قبلی بدون تغییر ---
// ... (بقیه توابع مانند handleLogin، logout، updateMainMetrics، exportData و غیره همان‌طور که بوده است بماند)
