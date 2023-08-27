const url = "https://api.jikan.moe/v4";

const searchBox = document.getAnimations('search');

async function searchAnime(e) {

  e.preventDefault();
  const form = new FormData(this);
  const query = form.get("search");

  try {
    var response = await fetch(`${url}/anime?q= ${query}&page=1`);
    var result = await response.json();
  } catch (error) {
    showError();
  }

  updateDom(result)
}

function showError(){
  const searchResults = document.getElementById('search-results');
  searchResults.innerHTML = "<div id='error'> Something went wrong! Please try again. </div>";
}

function updateDom(searchResult) {
  const searchResults = document.getElementById('search-results');

  const animeByCategories = searchResult.data
    .reduce((acc, anime) => {

      const { type } = anime;
      if (acc[type] === undefined) acc[type] = [];
      acc[type].push(anime);
      return acc;
    }, {});


  searchResults.innerHTML = Object.keys(animeByCategories).map(key => {
    const paraLength = 200;

    const animeHtml = animeByCategories[key].sort((a, b) => a.episodes - b.episodes).map((anime) => {
      const animeDate = anime.start_date == null ? "Not available" : anime.start_date;
      const animeRated = anime.rated == null ? "Not available" : anime.rated;

      var cardClass = "card";
      var title = anime.title;
      synopsis = anime.synopsis;
      

      if (anime.title.length <= 19) {
        cardClass = "card";
      } else if (anime.title.length > 19 && anime.title.length < 30) {
        title = `${anime.title.slice(0, 19)}..`;
      } else {
        // cardClass = "card bigger";

        title = `${anime.title.slice(0, 40)}..`;
        cardClass = "card big";
      }

      return `<div class="card" style="width: 18rem;">
      <img src="${anime.images.jpg.image_url}"  class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <div class="card-text">${synopsis}</div>
        <a href="${anime.url}" target="blank" class="btn btn-primary">More</a>
      </div>
    </div>
          
      `
    }).join("");


    return `
    <section>
    <h3 class="category">${key.toUpperCase()}</h3>
    <div class="row">${animeHtml}</div>
    </section>
    `;




  }).join("");




}

function pageLoaded() {
  const form = document.getElementById('search_form');
  form.addEventListener('submit', searchAnime);
}

window.addEventListener('load', pageLoaded);

// <div class="card-body">
//             <h5 class="card-title">${anime.title}</h5>
//             <p class="card-text">${anime.synopsis}</p>
//           </div>
//           <ul class="list-group list-group-flush">
//             <li class="list-group-item">Start Date : ${animeDate}</li>
//             <li class="list-group-item">rated : ${animeRated}</li>

//           </ul>
//           <div class="card-body">
//             <a href="${anime.url}" class="card-link">More</a>

//           </div>