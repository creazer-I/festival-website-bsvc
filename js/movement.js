document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('scroll', function() {
    var nav = document.querySelector('nav');
    if (window.pageYOffset > 0) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
});

document.getElementById('participationForm').addEventListener('submit', function(event) {
  if (!event.target.checkValidity()) {
    event.preventDefault();
    alert('Please fill out all required fields.');
  }
});

jQuery(document).ready(function($) {
  $(window).resize(function() {
    var width = $(window).width();
    var img = $('#dynamic-image');

    if (width <= 480) {
      img.attr('src', '/assests/store-assests/mobile_bottom_img.png');
    } else if (width <= 768) {
      img.attr('src', '/assests/store-assests/tablet_bottom_img.png');
    } else {
      img.attr('src', '/assests/store-assests/desktop_bottom_img.png');
    }
  }).resize(); 
});
