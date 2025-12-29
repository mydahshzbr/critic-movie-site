let currentMovie = null;
let currentRating = 0;

function initLogModal() {
    const modal = document.getElementById("logModal");
    const saveLogBtn = document.getElementById("saveLog");
    const backBtn = document.getElementById("closeModal");
    const stars = document.querySelectorAll(".star");
    const likeBtn = document.getElementById("likeBtn");

    stars.forEach((star, i) => {
        star.onclick = () => {
            currentRating = i + 1;
            stars.forEach((s, idx) => s.classList.toggle("selected", idx < currentRating));
        };
    });

    if (backBtn) backBtn.onclick = () => modal.classList.add("hidden");
    if (likeBtn) likeBtn.onclick = function() { this.classList.toggle("active"); };

    // This is the part we are changing!
    if (saveLogBtn) {
        saveLogBtn.onclick = async () => {
            if (!currentMovie) return alert("Please select a movie first.");

            const logEntry = {
                movie_id: currentMovie.id,
                title: currentMovie.title,
                rating: currentRating,
                review: document.getElementById("reviewInput").value,
                watched_on: document.getElementById("watchDate").value,
                liked: likeBtn && likeBtn.classList.contains("active") ? true : false
            };

            try {
                // Sending the data to your server.js
                const response = await fetch('http://localhost:3000/api/logs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(logEntry)
                });

                if (response.ok) {
                    alert("Saved to MongoDB!");
                    window.location.href = 'diary.html';
                } else {
                    alert("The server is awake, but it rejected the review.");
                }
            } catch (error) {
                // This is the error message you saw! 
                // It happens if node server.js isn't running.
                alert("Make sure your server.js is running in the black window!");
            }
        };
    }
}

window.openLogModal = function(movie) {
    currentMovie = movie;
    document.getElementById("modalPoster").src = movie.poster;
    document.getElementById("modalTitle").innerHTML = `${movie.title} <span>(${movie.year})</span>`;
    currentRating = 0;
    document.querySelectorAll(".star").forEach(s => s.classList.remove("selected"));
    document.getElementById("logModal").classList.remove("hidden");
};

const openLogBtn = document.getElementById("openLog");
if (openLogBtn) {
    openLogBtn.onclick = () => {
        const params = new URLSearchParams(window.location.search);
        const mid = params.get("id");
        const movie = typeof movies !== 'undefined' ? movies.find(m => m.id == mid) : null;
        if (movie) window.openLogModal(movie);
    };
}

initLogModal();