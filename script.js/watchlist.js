
const movieDetails = {
    "Naruto Shippuden": {
        image: "images/naruto.jpg",
        genre: "Anime",
        rating: "9.8/10",
        link: "https://en.wikipedia.org/wiki/Naruto:_Shippuden"
    },
    "Solo Leveling": {
        image: "images/solo-leveling.jpg",
        genre: "Anime / Fantasy",
        rating: "9.5/10",
        link: "https://en.wikipedia.org/wiki/Solo_Leveling"
    },
    "The Avengers": {
        image: "images/avengers.jpg",
        genre: "Superhero",
        rating: "9.0/10",
        link: "https://en.wikipedia.org/wiki/The_Avengers_(2012_film)"
    },
    "Spider-Man": {
        image: "images/spider-man.jpg",
        genre: "Superhero",
        rating: "8.8/10",
        link: "https://en.wikipedia.org/wiki/Spider-Man"
    },
    "Tom and Jerry": {
        image: "images/tom-and-jerry.jpg",
        genre: "Animation / Comedy",
        rating: "9.2/10",
        link: "https://en.wikipedia.org/wiki/Tom_and_Jerry"
    },
    "Attack on Titan": {
        image: "images/attack-on-titan.jpg",
        genre: "Anime / Action",
        rating: "9.7/10",
        link: "https://en.wikipedia.org/wiki/Attack_on_Titan"
    },
    "Jujutsu Kaisen": {
        image: "images/jujutsu-kaisen.jpg",
        genre: "Anime / Action",
        rating: "9.4/10",
        link: "https://en.wikipedia.org/wiki/Jujutsu_Kaisen"
    },
    "One-Punch Man": {
        image: "images/one-punch-man.jpg",
        genre: "Anime / Comedy",
        rating: "9.2/10",
        link: "https://en.wikipedia.org/wiki/One-Punch_Man"
    },
    "Demon Slayer": {
        image: "images/demon-slayer.jpg",
        genre: "Anime / Action",
        rating: "9.5/10",
        link: "https://en.wikipedia.org/wiki/Demon_Slayer:_Kimetsu_no_Yaiba"
    },
    "Boruto: Naruto Next Generations": {
        image: "images/boruto.jpg",
        genre: "Anime / Action",
        rating: "8.5/10",
        link: "https://en.wikipedia.org/wiki/Boruto:_Naruto_Next_Generations"
    },
    "Avengers: Endgame": {
        image: "images/avengers-endgame.jpg",
        genre: "Marvel / Superhero",
        rating: "9.8/10",
        link: "https://en.wikipedia.org/wiki/Avengers:_Endgame"
    },
    "Spider-Man: No Way Home": {
        image: "images/spider-man-no-way-home.jpg",
        genre: "Marvel / Superhero",
        rating: "9.3/10",
        link: "https://en.wikipedia.org/wiki/Spider-Man:_No_Way_Home"
    },
    "Black Panther": {
        image: "images/black-panther.jpg",
        genre: "Marvel / Superhero",
        rating: "8.9/10",
        link: "https://en.wikipedia.org/wiki/Black_Panther_(film)"
    },
    "Avengers: Infinity War": {
        image: "images/avengers-infinity-war.jpg",
        genre: "Marvel / Superhero",
        rating: "9.4/10",
        link: "https://en.wikipedia.org/wiki/Avengers:_Infinity_War"
    },
    "Doctor Strange in the Multiverse of Madness": {
        image: "images/doctor-strange-multiverse.jpg",
        genre: "Marvel / Fantasy",
        rating: "8.6/10",
        link: "https://en.wikipedia.org/wiki/Doctor_Strange_in_the_Multiverse_of_Madness"
    },
    "The SpongeBob SquarePants Movie": {
        image: "images/spongebob-movie.jpg",
        genre: "Animation / Comedy",
        rating: "8.7/10",
        link: "https://en.wikipedia.org/wiki/The_SpongeBob_SquarePants_Movie"
    },
    "Avatar: The Last Airbender": {
        image: "images/avatar-last-airbender.jpg",
        genre: "Animation / Fantasy",
        rating: "9.5/10",
        link: "https://en.wikipedia.org/wiki/Avatar:_The_Last_Airbender"
    },
    "Teenage Mutant Ninja Turtles: Mutant Mayhem": {
        image: "images/tmnt-mutant-mayhem.jpg",
        genre: "Animation / Action",
        rating: "8.8/10",
        link: "https://en.wikipedia.org/wiki/Teenage_Mutant_Ninja_Turtles:_Mutant_Mayhem"
    },
    "Ben 10": {
        image: "images/ben-ten.jpg",
        genre: "Animation / Sci-Fi",
        rating: "9.0/10",
        link: "https://en.wikipedia.org/wiki/Ben_10"
    },
    "Jimmy Neutron: Boy Genius": {
        image: "images/jimmy-neutron.jpg",
        genre: "Animation / Sci-Fi",
        rating: "8.4/10",
        link: "https://en.wikipedia.org/wiki/Jimmy_Neutron:_Boy_Genius"
    }
};

const container = document.getElementById("watchlist-movies");
const count = document.getElementById("watchlist-count");

function getSavedMovies() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("movieWatchlist")
        );
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
}

function renderWatchlist() {
    if (!container || !count) return;

    const savedMovies = getSavedMovies();

    container.innerHTML = "";

    count.textContent =
        savedMovies.length +
        (savedMovies.length === 1
            ? " saved title"
            : " saved titles");

    if (savedMovies.length === 0) {
        container.innerHTML = `
            <div class="empty-watchlist">
                <h3>Your watchlist is empty 🎬</h3>
                <p>Visit the rankings and save the titles you want to keep.</p>
                <a href="index.html" class="hero-button">
                    EXPLORE RANKINGS
                </a>
            </div>
        `;
        return;
    }

    savedMovies.forEach(function (title) {
        const movie = movieDetails[title];

        if (!movie) return;

        const card = document.createElement("article");
        card.className = "watchlist-card";

        const posterLink = document.createElement("a");
        posterLink.href = movie.link;
        posterLink.target = "_blank";
        posterLink.rel = "noopener noreferrer";

        const poster = document.createElement("img");
        poster.src = movie.image;
        poster.alt = title + " poster";
        poster.loading = "lazy";

        poster.onerror = function () {
            poster.alt = title + " poster image unavailable";
        };

        posterLink.appendChild(poster);

        const heading = document.createElement("h3");
        heading.textContent = title;

        const genre = document.createElement("p");
        genre.textContent = movie.genre;

        const rating = document.createElement("p");
        rating.className = "watchlist-rating";
        rating.textContent = "★ " + movie.rating;

        const removeButton = document.createElement("button");
        removeButton.className = "watchlist-btn saved";
        removeButton.textContent = "♥ Remove from Watchlist";

        removeButton.addEventListener("click", function () {
            const updatedMovies = getSavedMovies().filter(
                function (savedTitle) {
                    return savedTitle !== title;
                }
            );

            localStorage.setItem(
                "movieWatchlist",
                JSON.stringify(updatedMovies)
            );

            renderWatchlist();
        });

        card.append(
            posterLink,
            heading,
            genre,
            rating,
            removeButton
        );

        container.appendChild(card);
    });
}

renderWatchlist();
