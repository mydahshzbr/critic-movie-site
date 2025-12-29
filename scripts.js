/* 1. MOVIE DATA */
const movies = [
  { id: 1, title: "The Holdovers", year: 2023, genre: "Drama", poster: "assets/images/th1.png", backdrop: "assets/images/th2.webp", description: "During a quiet Christmas break at a New England boarding school, a gruff teacher forms an unlikely bond with a troubled student and a grieving cook." },
  { id: 2, title: "Lady Bird", year: 2017, genre: "Drama", poster: "assets/images/lb1.jpg", backdrop: "assets/images/lb2.webp", description: "A fiercely independent teenager navigates friendships, first love, and her complicated relationship with her mother." },
  { id: 3, title: "The Worst Person in the World", year: 2021, genre: "Comedy", poster: "assets/images/twp1.jpg", backdrop: "assets/images/twp2.webp", description: "A modern portrait of adulthood, love, and identity." },
  { id: 4, title: "The Florida Project", year: 2017, genre: "Drama", poster: "assets/images/tfp1.jpg", backdrop: "assets/images/tfp3.jpg", description: "A summer of freedom and hardship seen through a child’s eyes." },
  { id: 5, title: "Bones and All", year: 2022, genre: "Drama", poster: "assets/images/baa1.jpg", backdrop: "assets/images/baa2.webp", description: "A young woman embarks on a journey of love and survival in 1980s America." },
  { id: 6, title: "Monster", year: 2023, genre: "Drama", poster: "assets/images/m1.webp", backdrop: "assets/images/m2.webp", description: "Multiple perspectives reveal the truth behind a troubling incident." },
  { id: 7, title: "Before Sunset", year: 2004, genre: "Drama", poster: "assets/images/bs1.webp", backdrop: "assets/images/bs2.webp", description: "Nine years after meeting in Vienna, two former lovers reunite in Paris." }
];

/* 2. POPULATE MOVIE DETAILS ON movie.html */
let movieId = null;

if (window.location.pathname.includes("movie.html")) {
  const params = new URLSearchParams(window.location.search);
  movieId = Number(params.get("id"));
}


if (movieId) {
  const movie = movies.find(m => m.id === movieId);
  if (movie) {
    // Set movie title and year
    document.getElementById("movieTitle").textContent = `${movie.title} (${movie.year})`;

    // Set description
    document.getElementById("movieDescription").textContent = movie.description;

    // Set poster
    document.getElementById("moviePoster").src = movie.poster;

    // Set backdrop
    const backdrop = document.getElementById("movieBackdrop");
    if (backdrop) backdrop.style.backgroundImage = `url(${movie.backdrop || movie.poster})`;
  }
}

/* 3. STAR RATING */
const stars = document.querySelectorAll(".star");

stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    stars.forEach((s, i) => s.classList.toggle("selected", i <= index));
    console.log(`Rated: ${index + 1} stars`);
  });

  star.addEventListener("mouseover", () => {
    stars.forEach((s, i) => s.classList.toggle("hover", i <= index));
  });

  star.addEventListener("mouseout", () => {
    stars.forEach(s => s.classList.remove("hover"));
  });
});

/* 4. SAVE REVIEW BUTTON */
const saveBtn = document.getElementById("saveReview");
if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    const reviewText = document.getElementById("reviewInput").value;
    console.log(`Review for movie ${movieId}: ${reviewText}`);
    alert("Your review has been saved!");
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const exploreGrid = document.getElementById("exploreGrid");
  const exploreSearch = document.getElementById("exploreSearch");
  const exploreResults = document.getElementById("exploreResults");

if (exploreGrid && exploreSearch && exploreResults) {
  function renderMovies(movieList) {
    exploreGrid.innerHTML = "";

    movieList.forEach(movie => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <a href="movie.html?id=${movie.id}">
          <img src="${movie.poster}" alt="${movie.title}">
        </a>
        <div class="title">${movie.title}</div>
      `;

      exploreGrid.appendChild(card);
    });
  }

  // Initial load – show all movies
  renderMovies(movies);

  // Search logic
  exploreSearch.addEventListener("input", () => {
    const query = exploreSearch.value.toLowerCase();

    if (query === "") {
      exploreResults.innerHTML = "";
      renderMovies(movies);
      return;
    }

    const filtered = movies.filter(m =>
      m.title.toLowerCase().includes(query)
    );

    // Optional: inline result list (like Log page)
    exploreResults.innerHTML = "";
    filtered.forEach(m => {
      const div = document.createElement("div");
      div.className = "search-item";
      div.textContent = m.title;

      div.addEventListener("click", () => {
        window.location.href = `movie.html?id=${m.id}`;
      });

      exploreResults.appendChild(div);
    });

    // Also update grid
    renderMovies(filtered);
  });
}});
const diaryRows = document.getElementById("diaryRows");

let logs = JSON.parse(localStorage.getItem("logs")) || [];

// Sort newest first
logs.sort((a, b) => new Date(b.watchedOn) - new Date(a.watchedOn));
// Update the renderDiary section in scripts.js
function renderDiary() {
  const diaryRows = document.getElementById("diaryRows");
  if (!diaryRows) return;

  // Retrieve logs from Local Storage
  const logs = JSON.parse(localStorage.getItem("critic_logs")) || [];

  diaryRows.innerHTML = "";
  
  if (logs.length === 0) {
    diaryRows.innerHTML = "<p style='padding:20px; color:#A2AE9D;'>Your diary is empty. Log a film to see it here!</p>";
    return;
  }

  logs.forEach((log) => {
    const movie = movies.find(m => m.id == log.movie_id); 
    if (!movie) return;

    const row = document.createElement("div");
    row.className = "diary-row";
    row.innerHTML = `
      <div class="diary-date">${log.watched_on || "—"}</div>
      <div class="diary-film">
        <img src="${movie.poster}" style="width:40px; border-radius:4px;">
        <span>${movie.title}</span>
      </div>
      <div class="diary-rating" style="color: #C75F71;">${"★".repeat(log.rating || 0)}</div>
      <div class="diary-like">${log.liked ? "❤️" : ""}</div>
      <div class="diary-actions">
        <button onclick="deleteDiaryEntry(${log.log_id})" style="background:none; color:#A2AE9D; box-shadow:none;">Remove</button>
      </div>
    `;
    diaryRows.appendChild(row);
  });
}

// Update the Delete function
window.deleteDiaryEntry = (id) => {
  if (!confirm("Remove this entry?")) return;
  let logs = JSON.parse(localStorage.getItem("critic_logs")) || [];
  logs = logs.filter(log => log.log_id !== id);
  localStorage.setItem("critic_logs", JSON.stringify(logs));
  renderDiary();
};

// Initialize the Diary if we are on the page
if (document.getElementById("diaryRows")) {
    renderDiary();
}