// Function to fetch artworks by artist ID
function fetchArtworksByArtist(artist_id) {
    const artworks_base_url = "https://api.artic.edu/api/v1/artworks";
    const artworks_query_params = `?artist_ids=${artist_id}&limit=100`;

    fetch(artworks_base_url + artworks_query_params)
        .then(response => response.json())
        .then(data => {
            const api_links = data.data.map(artwork => artwork.api_link);

            return Promise.all(api_links.map(link => fetch(link).then(res => res.json())));
        })
        .then(details => {
            const paintings_info = details.map(detail_data => {
                const data = detail_data.data;
                const title = data.title;
                const year = data.date_display;
                const image_id = data.image_id;
                const image_link = `https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg`;

                return { title, year, image_link };
            });

            displayPaintings(paintings_info);
        })
        .catch(error => console.error('Error fetching artworks:', error));

}

// Function to display paintings in the gallery
function displayPaintings(paintings) {
    const gallery = document.getElementById('gallery');

    paintings.forEach(painting => {
        const paintingElement = document.createElement('div');
        paintingElement.classList.add('painting');

        const img = document.createElement('img');
        img.src = painting.image_link;
        img.alt = painting.title;

        const title = document.createElement('h2');
        title.textContent = painting.title;

        const year = document.createElement('p');
        year.textContent = painting.year;

        paintingElement.appendChild(img);
        paintingElement.appendChild(title);
        paintingElement.appendChild(year);

        gallery.appendChild(paintingElement);
    });
}

// Fetch and display artworks for Salvador Dali (artist ID: 34123)
fetchArtworksByArtist(34123);
