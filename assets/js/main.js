let moviesHtml = [];
let page = 1;
let countAllMovies = 0;
let lengthMovies = 0;
let order = 'year';
const banner = document.getElementsByClassName('section__moveBanner')[0];
const gridTitle = document.getElementsByClassName('grid__title')[0];

const loadDatabase = () => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.response) {
            window.movieDatabase = JSON.parse(this.response);
            lengthMovies = Math.floor(window.movieDatabase.length / 12);
            countAllMovies = window.movieDatabase.length;
            gridTitle.innerHTML = `We have ${countAllMovies} movies ordered by ${order}`;
            paintCards(page, order);
        }
    };
    xhttp.open("GET", "https://raw.githubusercontent.com/juansaab/javascript-movie-database/master/movie_list.json", true);
    xhttp.send();
}

const isNumber = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

const nextPage = () => {
    page = page + 1 < lengthMovies ? page + 1 : lengthMovies;
    paintCards(page);
}

const castSortValue = (value) => {
    return value ? isNumber(value) ? Number(value) : value.toString().toUpperCase() : null;
}

const prevPage = () => {
    page = 1 > page - 1 ? 1 : page - 1;
    paintCards(page, order);
}



const createFirstMovie = (movie) => {
    return `<div class="header__move">
    <div class="header__move_image" style="background-image: url(${movie.posterurl})">
    </div>
    <div class="header__move_info">
        <h3 class="header__move_title">${movie.title}</h3>
        <p>Reparto: ${movie.actors.join(' ')}</p>
        <p>Generos: ${movie.genres.join(' ')} </p>
        <h4> Resumen: </h4>
        <p>${movie.storyline} </p>
        <p>Año: ${movie.year} </p>
        <p><i class="fas fa-star"></i> ${movie.imdbRating} </p>
    </div>
</div>`;
}

const createCard = (movie) => {
    return `<div class="grid__item card" id="${movie.title.replace(' ', '')}">
        <div class="card__conten_image">
            <img class="card__image" src="${movie.posterurl ? movie.posterurl : 'https://image.tmdb.org/t/p/original/ep1lbJ2nKobQI8TldJMPV5Wf9Nm.jpg'}" />
        </div>
        <div class="card__conten_title">
            <h3 class="card__title">${movie.title}</h3>
            <div class="card__play"><i class="far fa-play-circle"></i></div>
            <div class="card__info"><span>${movie.year}</span><span>${movie.imdbRating}</span></div>
        </div>
    </div>`;
}

const changeMovie = (event) => {
    const movie = window.movieDatabase.find(m => m.title.replace(' ', '') === event.currentTarget.id)

    if (!movie) {
        return;
    }
    
    banner.innerHTML = createFirstMovie(movie);
}

const paintCards = (page, order = 'year') => {
    const container = document.getElementsByClassName('grid__content')[0];
    let movieBanner = null;
    moviesHtml = window.movieDatabase.sort((a, b) => {

        let valuaA = castSortValue(a[order]),
            valuaB = castSortValue(b[order]);

        if (isNumber(valuaA) && isNumber(valuaB)) {
            return valuaB - valuaA;
        }

        return (valuaA < valuaB) ? -1 : (valuaA > valuaB) ? 1 : 0;

    }).filter((movie, index) => index <= (page * 12) && index > (12 * (page - 1))).map(movie => {
        movieBanner = movieBanner ? movieBanner : movie;
        return createCard(movie)
    });

    container.innerHTML = moviesHtml.join('\n');
    banner.innerHTML = createFirstMovie(movieBanner);
    const textPage = document.getElementsByClassName('pager__header')[0];
    textPage.innerText = `Page ${page} of ${lengthMovies}`;
    setTimeout(() => {
        const cards = document.getElementsByClassName("card");
        for (const card of cards) {
            card.addEventListener("click", changeMovie)
        }
    }, 500);
}



const changeOrder = (event) => {
    order = event.target.value;
    gridTitle.innerHTML = `We have ${countAllMovies} movies ordered by ${order}`;
    paintCards(page, order);
}


document.getElementsByClassName("pager__next")[0].addEventListener("click", nextPage);



document.getElementsByClassName("pager__prev")[0].addEventListener("click", prevPage);



document.getElementById("orderBy").addEventListener("change", changeOrder);

loadDatabase();