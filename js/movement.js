document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('scroll', function() {
    var nav = document.querySelector('nav');
    var brand = document.querySelector('.navbar-brand');
    if (window.pageYOffset > 0) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
});


document.getElementById('participationForm').addEventListener('submit', function(event) {
// This will block form submission if any field is invalid
if (!event.target.checkValidity()) {
    event.preventDefault();
    alert('Please fill out all required fields.');
}
});