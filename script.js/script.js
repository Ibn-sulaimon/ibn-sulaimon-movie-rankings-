function hideLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");

    if (loadingScreen) {
        loadingScreen.classList.add("loader-hidden");
    }
}

const loadingScreen = document.getElementById("loading-screen");
const hasLoadedBefore = sessionStorage.getItem("websiteVisited");

if (loadingScreen) {
    if (hasLoadedBefore) {
        // Hide the loading screen immediately on return visits
        loadingScreen.classList.add("loader-hidden");
    } else {
        // Show it only on the first visit in this tab session
        sessionStorage.setItem("websiteVisited", "true");

        window.addEventListener("load", function () {
            setTimeout(hideLoadingScreen, 1300);
        });

        // Safety fallback in case loading takes too long
        setTimeout(hideLoadingScreen, 3000);
    }
}

const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");
document.body.classList.toggle("light-mode", savedTheme === "light");

if (themeToggle) {
    const isLight = savedTheme === "light";

    themeToggle.textContent = isLight
        ? "🌙 Dark Mode"
        : "☀️ Light Mode";
    themeToggle.setAttribute("aria-pressed", String(isLight));

    themeToggle.addEventListener("click", function () {
        const isLight = document.body.classList.toggle("light-mode");

        themeToggle.textContent = isLight
            ? "🌙 Dark Mode"
            : "☀️ Light Mode";
        themeToggle.setAttribute("aria-pressed", String(isLight));
        localStorage.setItem("theme", isLight ? "light" : "dark");
    });
}

const searchInput = document.getElementById("movieSearch");
const searchMessage = document.getElementById("searchMessage");
const genreFilter = document.getElementById("genreFilter");
const genreMessage = document.getElementById("genreMessage");

function filterMovies() {
    const searchText = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const selectedGenre = genreFilter
        ? genreFilter.value
        : "all";

    const movieCards = document.querySelectorAll(
        "#rankings .movie-card"
    );

    let visibleCount = 0;

    movieCards.forEach(function (card) {
        const heading = card.querySelector("h3");
        const title = heading
            ? heading.textContent.toLowerCase()
            : "";

        const genres = (card.dataset.genre || "")
            .toLowerCase()
            .split(/\s+/);

        const matchesSearch = title.includes(searchText);

        const matchesGenre =
            selectedGenre === "all" ||
            genres.includes(selectedGenre);

        const shouldShow = matchesSearch && matchesGenre;

        card.style.display = shouldShow ? "" : "none";

        if (shouldShow) {
            visibleCount++;
        }
    });

    if (searchMessage) {
        if (searchText && visibleCount === 0) {
            searchMessage.textContent =
                "No movies found. Try another title or genre.";
        } else if (searchText) {
            searchMessage.textContent =
                visibleCount + " title(s) found.";
        } else {
            searchMessage.textContent =
                "Explore your favourite movies.";
        }
    }

    if (genreMessage) {
        genreMessage.textContent =
            visibleCount + " title(s) shown.";
    }
}

if (searchInput) {
    searchInput.addEventListener("input", filterMovies);
}

if (genreFilter) {
    genreFilter.addEventListener("change", filterMovies);
}

filterMovies();

const watchlistButtons = document.querySelectorAll(".watchlist-btn");

function getWatchlist() {
    try {
        const watchlist = JSON.parse(
            localStorage.getItem("movieWatchlist") || "[]"
        );

        return Array.isArray(watchlist)
            ? watchlist.filter(function (title) {
                return typeof title === "string";
            })
            : [];
    } catch (error) {
        console.error("Unable to read the saved movie watchlist.", error);
        return [];
    }
}

function updateWatchlistButton(button) {
    const saved = getWatchlist().includes(button.dataset.title);

    button.classList.toggle("saved", saved);
    button.textContent = saved
        ? "♥ Added to Watchlist"
        : "♡ Add to Watchlist";

    button.setAttribute("aria-pressed", String(saved));
}

watchlistButtons.forEach(function (button) {
    updateWatchlistButton(button);

    button.addEventListener("click", function () {
        let watchlist = getWatchlist();
        const title = button.dataset.title;

        if (watchlist.includes(title)) {
            watchlist = watchlist.filter(function (movie) {
                return movie !== title;
            });
        } else {
            watchlist.push(title);
        }

        localStorage.setItem("movieWatchlist", JSON.stringify(watchlist));
        updateWatchlistButton(button);
    });
});

const container = document.getElementById("watchlist-movies");
const count = document.getElementById("watchlist-count");
const catalogStorageKey = "movieWebsiteCatalog";

function getMovieCatalog() {
    const cards = document.querySelectorAll("#rankings .movie-card");
    const catalog = {};

    cards.forEach(function (card) {
        const title = card.querySelector("h3")?.textContent.trim();

        if (!title) {
            return;
        }

        const poster = card.querySelector(".movie-poster img");
        const rating = card.querySelector(".rating-score");

        catalog[title] = {
            image: poster ? poster.getAttribute("src") : "",
            genre: (card.dataset.genre || "")
                .split(/\s+/)
                .filter(Boolean)
                .join(", "),
            rating: rating ? rating.textContent.trim() : ""
        };
    });

    if (cards.length > 0) {
        localStorage.setItem(catalogStorageKey, JSON.stringify(catalog));
        return catalog;
    }

    try {
        const savedCatalog = JSON.parse(
            localStorage.getItem(catalogStorageKey) || "{}"
        );

        return savedCatalog && typeof savedCatalog === "object" &&
            !Array.isArray(savedCatalog)
            ? savedCatalog
            : {};
    } catch (error) {
        console.error("Unable to read the saved movie catalog.", error);
        return {};
    }
}

const movieCatalog = getMovieCatalog();

function renderWatchlist() {
    const savedMovies = getWatchlist();

    container.innerHTML = "";

    count.textContent = savedMovies.length +
        (savedMovies.length === 1 ? " saved movie" : " saved movies");

    if (savedMovies.length === 0) {
        container.innerHTML = `
            <div class="empty-watchlist">
                <h3>Your watchlist is empty 🎬</h3>
                <p>Return to the rankings and save movies you want to watch.</p>
                <a href="index.html" class="hero-button">EXPLORE MOVIES</a>
            </div>`;
        return;
    }

    savedMovies.forEach(function (title) {
        const movie = movieCatalog[title] || {};

        const card = document.createElement("article");
        card.className = "watchlist-card";

        if (movie.image) {
            const poster = document.createElement("img");
            poster.src = movie.image;
            poster.alt = title + " poster";
            card.appendChild(poster);
        }

        const heading = document.createElement("h3");
        heading.textContent = title;

        const genre = movie.genre
            ? document.createElement("p")
            : null;
        if (genre) {
            genre.textContent = movie.genre;
        }

        const rating = movie.rating
            ? document.createElement("p")
            : null;
        if (rating) {
            rating.className = "watchlist-rating";
            rating.textContent = "★ " + movie.rating;
        }

        const removeButton = document.createElement("button");
        removeButton.className = "watchlist-btn saved";
        removeButton.textContent = "♥ Remove";
        removeButton.addEventListener("click", function () {
            const updated = getWatchlist().filter(function (name) {
                return name !== title;
            });

            localStorage.setItem("movieWatchlist", JSON.stringify(updated));
            renderWatchlist();
        });

        card.appendChild(heading);
        if (genre) {
            card.appendChild(genre);
        }
        if (rating) {
            card.appendChild(rating);
        }
        card.appendChild(removeButton);
        container.appendChild(card);
    });
}

if (container && count) {
    renderWatchlist();
}
