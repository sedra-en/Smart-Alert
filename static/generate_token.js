document.addEventListener('DOMContentLoaded', () => {
    // Fade in effect for body content
    document.body.style.opacity = 0;
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.7s ease-in-out';
        document.body.style.opacity = 1;
    }, 100);

    // Highlight row on hover
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = '#f0f8ff';
        });
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = '';
        });
    });

    // Check if there's a token created recently (flash message using query param)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('new_token') === '1') {
        showToast("🔑 Token Generated Successfully!");
    }
});

// Function to show a toast
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.padding = '15px 25px';
    toast.style.backgroundColor = '#28a745';
    toast.style.color = '#fff';
    toast.style.fontSize = '16px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
    toast.style.zIndex = '9999';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s ease';

    document.body.appendChild(toast);
    setTimeout(() => toast.style.opacity = '1', 100);

    // Auto remove
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}