"Enter your logic here"

const gallery = document.getElementById('gallery');
const photoCount = document.getElementById('photoCount');
const message = document.getElementById('message');

const loadMoreButton = document.getElementById('loadMore');
const clearButton = document.getElementById('clearGallery');
const removeButton = document.getElementById('removeLast');
const reverseButton = document.getElementById('reverseGallery');

let photos = [];
let currentPage = 1;
let isLoading = false;

// Відображення фотографій на сторінці
function showPhotos() {
  gallery.innerHTML = '';

  photos.forEach(function(photo) {
    const img = document.createElement('img');

    img.src = `https://picsum.photos/id/${photo.id}/400/300`;
    img.alt = `Фото автора ${photo.author}`;
    img.loading = 'lazy';

    gallery.appendChild(img);
  });

  photoCount.textContent = photos.length;
}

// Завантаження нових фотографій із сервера
function loadPhotos() {
  if (isLoading) {
    return;
  }

  isLoading = true;
  loadMoreButton.disabled = true;
  message.textContent = 'Завантаження фотографій...';

  fetch(`https://picsum.photos/v2/list?page=${currentPage}&limit=4`)
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Помилка сервера');
      }

      return response.json();
    })
    .then(function(data) {
      // Додаємо тільки ті фото, яких ще немає
      const newPhotos = data.filter(function(photo) {
        return !photos.some(function(existingPhoto) {
          return existingPhoto.id === photo.id;
        });
      });

      photos = photos.concat(newPhotos);
      currentPage++;

      showPhotos();
      message.textContent = '';
    })
    .catch(function(error) {
      message.textContent = 'Не вдалося завантажити фотографії.';
      console.error(error);
    })
    .finally(function() {
      isLoading = false;
      loadMoreButton.disabled = false;
    });
}

// Очищення всієї галереї
function clearGallery() {
  photos = [];
  showPhotos();
  message.textContent = 'Галерею очищено.';
}

// Видалення останньої фотографії
function removeLastPhoto() {
  if (photos.length === 0) {
    message.textContent = 'Галерея вже порожня.';
    return;
  }

  photos.pop();
  showPhotos();
  message.textContent = '';
}

// Зміна порядку фотографій на зворотний
function reverseGallery() {
  photos.reverse();
  showPhotos();
  message.textContent = '';
}

// Обробники натискання кнопок
loadMoreButton.addEventListener('click', loadPhotos);
clearButton.addEventListener('click', clearGallery);
removeButton.addEventListener('click', removeLastPhoto);
reverseButton.addEventListener('click', reverseGallery);

// Завантажуємо перші 4 фотографії при відкритті
loadPhotos();
