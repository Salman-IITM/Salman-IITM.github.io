document.addEventListener('DOMContentLoaded', function () {
  const images = document.querySelectorAll('.image');
  let currentIndex = 0;

  // Function to update the active image
  function updateActiveImage() {
    images.forEach((image, index) => {
      image.classList.remove('active');
      if (index === currentIndex) {
        image.classList.add('active');
      }
    });
  }

  // Function to move to the next image
  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateActiveImage();
  }

  // Initialize the gallery
  updateActiveImage();

  // Set interval to change images every 3 seconds
  setInterval(nextImage, 3000);
});
