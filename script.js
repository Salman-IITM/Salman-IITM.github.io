document.addEventListener('DOMContentLoaded', function () {
  const images = document.querySelectorAll('.image');
  const galleryContainer = document.querySelector('.gallery-container');
  let currentIndex = 0;

  // Function to update the active image
  function updateActiveImage(clickedImage) {
    images.forEach(image => {
      image.classList.remove('active');
      image.style.opacity = '1'; // Reset opacity for all images
    });

    clickedImage.classList.add('active');
    galleryContainer.classList.add('active');
  }

  // Event listener for each image
  images.forEach(image => {
    image.addEventListener('click', function () {
      updateActiveImage(image);
    });
  });

  // Initialize the gallery
  if (images.length > 0) {
    updateActiveImage(images[0]); // Set the first image as active by default
  }

  // Function to move to the next image
  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateActiveImage(images[currentIndex]);
  }

  // Set interval to change images every 3 seconds
  setInterval(nextImage, 3000);
});
