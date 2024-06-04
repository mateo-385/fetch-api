function cargarDatos() {
    const url = 'https://rickandmortyapi.com/api/character';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red - La respuesta no fue ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data);
        })
        .catch(error => {
            console.error('Error capturado en .catch():', error);
        });
}

cargarDatos()

async function cargarDatosAsync() {
    const url = 'https://jsonplaceholder.typicode.com/posts';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error en la red - La respuesta no fue ok');
        }
        const data = await response.json();
        console.log('Datos recibidos:', data);
    } catch (error) {
        console.error('Error capturado en try-catch:', error);
    }
}

cargarDatosAsync()


let currentPage = 1;

async function fetchCharacters() {
    const url = `https://rickandmortyapi.com/api/character?page=${currentPage}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayCharacters(data.results);
        currentPage++;
        adjustCardEffects(); // Asegura que los nuevos personajes tengan efectos
    } catch (error) {
        console.error("Error fetching characters:", error);
    }
}

function displayCharacters(characters) {
    const container = document.getElementById("characters");
    characters.forEach((character) => {
        const characterElement = document.createElement("div");
        characterElement.className = "character";
        characterElement.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <h3>${character.name}</h3>
            <p>Species: ${character.species}</p>
            <p>Status: ${character.status}</p>
        `;
        container.appendChild(characterElement);
    });
}

function adjustCardEffects() {
    document.querySelectorAll(".character").forEach((item) => {
        item.addEventListener("mousemove", function (e) {
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            let dx = (x / rect.width - 0.5) * 10; // Ángulo reducido para movimiento sutil
            let dy = (y / rect.height - 0.5) * 10; // Ángulo reducido para movimiento sutil
            item.style.transform = `rotateY(${dx}deg) rotateX(${-dy}deg)`;
        });
        item.addEventListener("mouseout", function () {
            item.style.transform = "rotateY(0deg) rotateX(0deg)"; // Resetear la rotación
        });
    });
}

document.getElementById("loadMore").addEventListener("click", fetchCharacters);

fetchCharacters();