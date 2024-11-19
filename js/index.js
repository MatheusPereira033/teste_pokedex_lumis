const listagemPokemon = document.querySelector("#listagemPokemon");
const pokemonCount = 150;
const pokemonsPerPage = 18;
let currentPage = 1;

const fetchPokemons = async () => {
    try {
        listagemPokemon.innerHTML = '';

        const offset = (currentPage - 1) * pokemonsPerPage;
        const end = offset + pokemonsPerPage;

        for (let i = offset + 1; i <= end && i <= pokemonCount; i++) {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            const pokemon = await response.json();
           
                createPokemonCard(pokemon);
        }

        updatePagination();

    } catch (error) {
        console.error("Erro ao buscar os Pokémons:", error);
    }
};

const createPokemonCard = (pokemon) => {
    const card = document.createElement("div");
    card.classList.add("pokemonCard");

    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const id = pokemon.id.toString().padStart(3, "0");
    const type = pokemon.types[0].type.name;

    const pokemonInnerHTML = `
        <div class="info">
            <small class="type"><span>${type}</span></small>
            <span class="number">#${id}</span>
        </div>
        <div class="imgContainer">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${name}">
            <p class="name">${name}</p>
        </div>
    `;

    card.innerHTML = pokemonInnerHTML;
    listagemPokemon.appendChild(card);
};

const updatePagination = () => {
    const totalPages = Math.ceil(pokemonCount / pokemonsPerPage);
    const pageNumbersDiv = document.querySelector("#pageNumbers");

    pageNumbersDiv.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.classList.add("pageButton");
        
        if (i === currentPage) {
            pageButton.disabled = true;
            pageButton.classList.add("active");
        }

        pageButton.addEventListener("click", () => {
            currentPage = i;
            fetchPokemons();
        });

        pageNumbersDiv.appendChild(pageButton);
    }

    document.querySelector("#prevPage").disabled = currentPage === 1;
    document.querySelector("#nextPage").disabled = currentPage === totalPages;
};

const changePage = (direction) => {
    if (direction === "next" && currentPage * pokemonsPerPage < pokemonCount) {
        currentPage++;
    } else if (direction === "prev" && currentPage > 1) {
        currentPage--;
    }
    fetchPokemons();
};

window.addEventListener("load", fetchPokemons);

document.querySelector("#prevPage").addEventListener("click", () => changePage("prev"));
document.querySelector("#nextPage").addEventListener("click", () => changePage("next"));

const performSearch = () => {
    const searchQuery = document.querySelector("#search").value.toLowerCase();
    currentPage = 1; 
    listagemPokemon.innerHTML = '';

    if (searchQuery) {
        fetchPokemonsByName(searchQuery);
    } else {
        fetchPokemons();
    }
};


document.querySelector("#input-icon").addEventListener("click", performSearch);

document.querySelector("#search").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        performSearch();
    }
});

const fetchPokemonsByName = async (query) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        if (response.ok) {
            const pokemon = await response.json();
            createPokemonCard(pokemon);
        } else {
            listagemPokemon.innerHTML = `<p>Pokémon não encontrado.</p>`;
        }
    } catch (error) {
        console.error("Erro ao buscar Pokémon:", error);
    }
};