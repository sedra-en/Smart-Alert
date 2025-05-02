document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); // منع إرسال النموذج

    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const resultMessage = document.getElementById('resultMessage');

    // التحقق من وجود ملف
    if (imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            // عرض الصورة في المعاينة
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            resultMessage.textContent = 'تم تحميل الصورة بنجاح!';

            // هنا يمكنك إضافة الكود الخاص بتحليل تعابير الوجه
        };

        reader.readAsDataURL(file);
    } else {
        resultMessage.textContent = 'يرجى اختيار صورة.';
        resultMessage.style.color = '#dc3545'; // لون الخطأ
    }
});

