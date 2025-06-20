
document.addEventListener("DOMContentLoaded", function () {
  // زر تسجيل الخروج
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    const loginUrl = logoutBtn.dataset.loginUrl;

    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();

      Swal.fire({
        title: 'Are you sure you want to log out?',
        text: "You will be redirected to the login page.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#8e44ad',
        cancelButtonColor: '#aaa',
        confirmButtonText: 'Yes, log out',
        cancelButtonText: 'Cancel',
        background: '#f6f0fb',
        color: '#4a235a',
        iconColor: '#8e44ad'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = loginUrl;
        }
      });
    });
  }

  // زر Generate Token
  const genBtn = document.getElementById("openPasswordModal");

  if (genBtn) {
    genBtn.addEventListener("click", function (e) {
      e.preventDefault();

      Swal.fire({
        title: '🔐 Admin Access',
        html:`
          <div style="position: relative; width: 100%;">
            <input type="password" id="adminPassword" class="swal2-input"
              placeholder="Enter admin password"
              style="
                padding-right: 45px;
                border-radius: 8px;
                box-shadow: 0 0 4px rgba(0,0,0,0.1);
                border: 1px solid #ccc;
              " />
            <button id="togglePassword"
              style="
                position: absolute;
                top: 50%;
                right: 12px;
                transform: translateY(-50%);
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 0;
              " title="Show/Hide Password">
              <svg id="eyeIcon" xmlns="http://www.w3.org/2000/svg"
                width="22" height="22" fill="none"
                stroke="#555" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"
                viewBox="0 0 24 24">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>`
        ,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        background: '#fdf7ff',
        color: '#4a235a',
        icon: 'question',
        preConfirm: () => {
          const password = document.getElementById('adminPassword').value;
          if (!password) {
            Swal.showValidationMessage('Please enter the password');
            return false;
          }

          return fetch("/token_password_modal", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "password=" + encodeURIComponent(password)
          })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                window.location.href = data.redirect_url;
              } else {
                Swal.showValidationMessage("❌ " + data.message);
                return false;
              }
            })
            .catch(() => {
              Swal.showValidationMessage("❌ Error occurred, please try again");
              return false;
            });
        }
      });

      // تبديل شكل العين
      setTimeout(() => {
        const toggleBtn = document.getElementById("togglePassword");
        const passwordInput = document.getElementById("adminPassword");
        const eyeIcon = document.getElementById("eyeIcon");

        toggleBtn.addEventListener("click", () => {
          const isPassword = passwordInput.type === "password";
          passwordInput.type = isPassword ? "text" : "password";


eyeIcon.innerHTML = isPassword
            ? `<path d="M17.94 17.94A10.94 10.94 0 0 1 12 19
              c-7.633 0-11-7-11-7a21.46 21.46 0 0 1 5.15-5.94M3 3l18 18"/>
               <path d="M9.88 9.88A3 3 0 0 1 14.12 14.12" />`
            : `<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
               <circle cx="12" cy="12" r="3"/>`;
        });
      }, 100);
    });
  }
});