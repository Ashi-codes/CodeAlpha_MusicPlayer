let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;

const songs = [
    {
        title: "295",
        artist: "Sidhu Moose Wala",
        image: "images/sidhu.jpg",
        audio: "songs/295.mpeg"
    },
    {
        title: "Lock",
        artist: "Sidhu Moose Wala",
        image: "images/sidhulook.jpg",
        audio: "songs/lock.mpeg"
    },
    {
        title: "So High",
        artist: "Sidhu Moose Wala",
        image: "images/sidhusolomic.jpg",
        audio: "songs/sohigh.mpeg"
    },
    {
        title: "Amplifier",
        artist: "Imran Khan",
        image: "images/whitecar.jpg",
        audio: "songs/amplifier.mpeg"
    },
    {
        title: "Sadi Sun",
        artist: "Harsh Nussi",
        image: "images/sadisun.jpg",
        audio: "songs/sadi sun.mpeg"
    },
    {
        title: "Tution",
        artist: "Cheema y",
        image: "images/tutor.jpg",
        audio: "songs/tution.mpeg"
    },
    {
        title: "Snake",
        artist: "Cheema y",
        image: "images/snake.jpg",
        audio: "songs/snake.mpeg"
    },
    {
        title: "Jackpot",
        artist: "Cheema y",
        image: "images/chema.jpg",
        audio: "songs/jacport.mpeg"
    },
    ,
    {
        title: "Dior",
        artist: "Shubh ",
        image: "images/Shubh.jpg",
        audio: "songs/subha.mpeg"
    }
];

const audio = new Audio();
audio.volume = 0.2;

let currentSong = 0;
let isPlaying = false;
let showFavoritesOnly = false;

// ================= ELEMENTS =================
const playButton = document.getElementById("play");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");

const songTitle = document.getElementById("songTitle");
const artist = document.getElementById("artist");
const coverImage = document.getElementById("coverImage");

const progress = document.getElementById("progress");
const progressContainer = document.querySelector(".progress-container");

const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const volumeSlider = document.getElementById("volumeSlider");
const playlist = document.getElementById("playlist");


// ================= SEARCH (HTML input required) =================
// <input id="search" placeholder="Search songs...">
const searchInput = document.getElementById("search");


// ================= DARK MODE =================
function applyDarkMode() {
    if (darkMode) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
}

applyDarkMode();


// ================= SAVE FAVORITES =================
function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}


// ================= LOAD SONG =================
function loadSong(index) {
    songTitle.textContent = songs[index].title;
    artist.textContent = songs[index].artist;
    coverImage.src = songs[index].image;
    audio.src = songs[index].audio;

    updateActiveSong();
}


// ================= PLAY / PAUSE =================
playButton.addEventListener("click", function () {
    if (!audio.src) loadSong(currentSong);

    if (audio.paused) {
        audio.play();
        isPlaying = true;
        playButton.textContent = "⏸";
    } else {
        audio.pause();
        isPlaying = false;
        playButton.textContent = "▶";
    }
});


// ================= NEXT =================
nextButton.addEventListener("click", function () {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
    audio.play();
    playButton.textContent = "⏸";
});


// ================= PREV =================
prevButton.addEventListener("click", function () {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
    audio.play();
    playButton.textContent = "⏸";
});


// ================= PLAYLIST =================
function loadPlaylist() {
    playlist.innerHTML = "";

    let list = songs.map((song, index) => ({ ...song, index }));

    // FILTER: favorites only
    if (showFavoritesOnly) {
        list = list.filter(s => favorites.includes(s.index));
    }

    // SEARCH filter
    if (searchInput && searchInput.value.trim() !== "") {
        const q = searchInput.value.toLowerCase();
        list = list.filter(s =>
            s.title.toLowerCase().includes(q) ||
            s.artist.toLowerCase().includes(q)
        );
    }

    list.forEach(song => {

        const songItem = document.createElement("div");
        songItem.classList.add("song-item");

        const title = document.createElement("span");
        title.textContent = song.title;

        const heart = document.createElement("span");
        heart.classList.add("heart");

        if (favorites.includes(song.index)) {
            heart.innerHTML = "♥";
            heart.classList.add("active");
        } else {
            heart.innerHTML = "♡";
        }

        // PLAY SONG
        songItem.addEventListener("click", function () {
            currentSong = song.index;
            loadSong(currentSong);
            audio.play();
            playButton.textContent = "⏸";
        });

        // FAVORITE
        heart.addEventListener("click", function (e) {
            e.stopPropagation();

            if (favorites.includes(song.index)) {
                favorites = favorites.filter(i => i !== song.index);
            } else {
                favorites.push(song.index);
            }

            saveFavorites();
            loadPlaylist();
        });

        songItem.appendChild(title);
        songItem.appendChild(heart);

        playlist.appendChild(songItem);
    });

    updateActiveSong();
}


// ================= ACTIVE SONG =================
function updateActiveSong() {
    const items = document.querySelectorAll(".song-item");

    items.forEach((item, index) => {
        item.classList.toggle("active", index === currentSong);

        if (index === currentSong) {
            item.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });
}


// ================= PROGRESS =================
audio.addEventListener("timeupdate", function () {
    if (audio.duration) {
        progress.style.width =
            (audio.currentTime / audio.duration) * 100 + "%";
    }

    let m = Math.floor(audio.currentTime / 60);
    let s = Math.floor(audio.currentTime % 60);
    if (s < 10) s = "0" + s;

    currentTime.textContent = m + ":" + s;
});


// ================= DURATION =================
audio.addEventListener("loadedmetadata", function () {
    let m = Math.floor(audio.duration / 60);
    let s = Math.floor(audio.duration % 60);
    if (s < 10) s = "0" + s;

    duration.textContent = m + ":" + s;
});


// ================= SEEK =================
progressContainer.addEventListener("click", function (e) {
    const width = this.clientWidth;
    audio.currentTime = (e.offsetX / width) * audio.duration;
});


// ================= VOLUME =================
volumeSlider.addEventListener("input", function () {
    audio.volume = volumeSlider.value / 100;
});


// ================= AUTO NEXT =================
audio.addEventListener("ended", function () {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
    audio.play();
    playButton.textContent = "⏸";
});


// ================= FAVORITES TOGGLE BUTTON (YOU ADD IN HTML) =================
// <button id="favBtn">Favorites</button>
const favBtn = document.getElementById("favBtn");

if (favBtn) {
    favBtn.addEventListener("click", function () {
        showFavoritesOnly = !showFavoritesOnly;
        favBtn.textContent = showFavoritesOnly ? "All Songs" : "Favorites";
        loadPlaylist();
    });
}


// ================= DARK MODE BUTTON =================
// <button id="darkBtn">Dark Mode</button>
const darkBtn = document.getElementById("darkBtn");

if (darkBtn) {
    darkBtn.addEventListener("click", function () {
        darkMode = !darkMode;
        applyDarkMode();
    });
}


// ================= SEARCH =================
if (searchInput) {
    searchInput.addEventListener("input", function () {
        loadPlaylist();
    });
}


// ================= INIT =================
loadSong(currentSong);
loadPlaylist();