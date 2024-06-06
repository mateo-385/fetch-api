// Function to fetch JSON data from a given URL
async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

// Function to search for artworks by a query
async function searchArtworks(query) {
  const searchUrl = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(
    query
  )}&limit=100`;
  return fetchJSON(searchUrl);
}

// Function to get artwork details by ID
async function getArtworkDetails(artworkId) {
  const artworkUrl = `https://api.artic.edu/api/v1/artworks/${artworkId}`;
  return fetchJSON(artworkUrl);
}

// Function to create HTML for a painting and insert it into the gallery
function insertPaintingIntoGallery(painting) {
  const gallery = document.getElementById("gallery");

  if (!gallery) {
    console.error("Gallery element not found!");
    return;
  }

  const paintingElement = document.createElement("div");
  paintingElement.classList.add("painting");

  const imgElement = document.createElement("img");
  imgElement.src = painting.image_url;
  imgElement.alt = painting.title;
  imgElement.onerror = () => {
    imgElement.src = "https://via.placeholder.com/250"; // Placeholder image if the image fails to load
  };

  const titleElement = document.createElement("h2");
  titleElement.textContent = painting.title;

  const descriptionElement = document.createElement("p");
  descriptionElement.textContent = painting.artist_title;

  paintingElement.appendChild(imgElement);
  paintingElement.appendChild(titleElement);
  paintingElement.appendChild(descriptionElement);

  gallery.appendChild(paintingElement);

  console.log("Inserted painting:", painting);
}

// Main function to get all artworks by Salvador Dalí and insert them into the gallery
async function getArtworksBySalvadorDali() {
  try {
    // Step 1: Search for artworks by Salvador Dalí
    const searchResults = await searchArtworks("Salvador Dali");
    console.log("Search results:", searchResults);
    if (searchResults.data.length === 0) {
      console.log("No artworks found for Salvador Dalí");
      return;
    }

    // Step 2: Iterate through each artwork and fetch its details
    for (const artwork of searchResults.data) {
      const artworkDetails = await getArtworkDetails(artwork.id);
      console.log("Artwork details:", artworkDetails);

      // Extract image_id and construct image URL
      const image_id = artworkDetails.data.image_id;
      const image_url = image_id
        ? `https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg`
        : "https://via.placeholder.com/250";

      // Insert the painting into the gallery
      insertPaintingIntoGallery({
        title: artworkDetails.data.title,
        artist_title: artworkDetails.data.artist_title,
        image_url: image_url,
      });
    }
  } catch (error) {
    console.error("Error fetching artworks:", error);
  }
}

// Execute the function after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", getArtworksBySalvadorDali);
