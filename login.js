// وظيفة اظهار/اخفاء كلمة السر
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
}

// حركة على الروابط عند النقر
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // يمنع الانتقال الفوري

        link.classList.add('clicked'); // أضف كلاس النقر

        // إزالة الكلاس بعد انتهاء التأثير
        setTimeout(() => {
            link.classList.remove('clicked');
        }, 400); // المدة 400 ملي ثانية
    });
    // وظيفة اظهار/اخفاء كلمة السر
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
}

// حركة على الروابط عند النقر
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // لا ننتقل فوراً

        // حذف أي كلاس قديم لو موجود
        link.classList.remove('clicked');
        // إعادة إضافته لتحريك الانميشن
        void link.offsetWidth; // خدعة لإعادة تفعيل الأنميشن

        link.classList.add('clicked');

        // يمكنك التحكم إذا أردت بعد الحركة أن ينتقل للرابط الحقيقي
        // setTimeout(() => { window.location.href = link.href; }, 500);
    });
});

});
