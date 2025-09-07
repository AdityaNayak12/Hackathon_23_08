const API_URL = "https://free-to-play-games-database.p.rapidapi.com/api/games";
const API_HEADERS = {
  "X-RapidAPI-Key": "333ef3a80ac1mshef4bf66401206bcp1f96cajsnca13acd37cf5", 
  "X-RapidAPI-Host": "free-to-play-games-database.p.rapidapi.com"
};

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const gameList = document.getElementById("game-list");
const gameDetails = document.getElementById("game-details");

let lastState = null; 


window.onload = () => {
  loadTrendingGames(); 
};


searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim().toLowerCase();
  if (query) {
    searchGames(query);
  }
});


async function loadTrendingGames() {
  gameList.innerHTML = '<div class="spinner"></div>';
  try {
    const res = await fetch(`${API_URL}?sort-by=popularity`, { headers: API_HEADERS });
    const data = await res.json();
    const trending = data.slice(0, 5); 
    lastState = { games: trending, title: "Trending Games", trending: true }; 
    displayGames(trending, "Trending Games", true);
  } catch (error) {
    gameList.innerHTML = "<p>Error loading trending games.</p>";
  }
}


async function searchGames(query) { 
  gameList.innerHTML = '<div class="spinner"></div>';
  try {
    const res = await fetch(API_URL, { headers: API_HEADERS });
    const data = await res.json();
    const results = data.filter((game) =>
      game.title.toLowerCase().includes(query)
    );
    lastState = { games: results, title: `Results for "${query}"`, trending: false }; // save state
    displayGames(results, `Results for "${query}"`);
  } catch (error) {
    gameList.innerHTML = "<p>Error loading search results.</p>";
  }
}


function displayGames(games, title = "", trending = false) {
  gameDetails.classList.add("hidden");
  gameList.innerHTML = ""; 

  if (title) {
    const heading = document.createElement("h2");
    heading.textContent = title;
    heading.style.textAlign = "center";
    heading.style.marginBottom = "10px";
    gameList.appendChild(heading);
  }

  if (games.length === 0) {
    gameList.innerHTML += "<p>No games found.</p>";
    return;
  }

  games.forEach((game) => {
    const card = document.createElement("div");
    card.classList.add("game-card");
    if (trending) card.classList.add("trending");

    const thumbnail = game.thumbnail ? game.thumbnail : "https://via.placeholder.com/200x150?text=No+Image";

    card.innerHTML = `
      <img src="${thumbnail}" alt="${game.title}">
      <h3>${game.title}</h3>
      <p>Genre: ${game.genre}</p>
      <p>Platform: ${game.platform}</p>
    `;
    card.addEventListener("click", () => loadGameDetails(game));
    gameList.appendChild(card);
  });
}


function loadGameDetails(game) {
  gameList.innerHTML = "";
  gameDetails.classList.remove("hidden");

  gameDetails.innerHTML = `
    <button id="back-btn">Back</button>
    <h2>${game.title}</h2>
    <img src="${game.thumbnail}" alt="${game.title}">
    <p><strong>Genre:</strong> ${game.genre}</p>
    <p><strong>Platform:</strong> ${game.platform}</p>
    <p><strong>Publisher:</strong> ${game.publisher}</p>
    <p><strong>Release Date:</strong> ${game.release_date}</p>
    <a href="${game.game_url}" target="_blank">More Info</a>
  `;
  document.getElementById("back-btn").addEventListener("click", () => {
    if (lastState) {
      displayGames(lastState.games, lastState.title, lastState.trending);
    }
  });
}


