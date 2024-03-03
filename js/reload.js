window.onbeforeunload = function() {
    localStorage.removeItem('formData');
};