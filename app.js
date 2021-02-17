const url = "https://api.jikan.moe/v3";

const searchBox = document.getAnimations('search');

async function searchAnime(e) {

  e.preventDefault();
  const form = new FormData(this);
  const query = form.get("search");
  console.log(query);

  try {
    var response = await fetch(`${url}/search/anime?q= ${query}&page=1`);
    var data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }

  updateDom(data)
}

function updateDom(data) {
  const searchResults = document.getElementById('search-results');

  const animeByCategories = data.results
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

      if (anime.synopsis.length > paraLength) {
        var synopsis = anime.synopsis.slice(0, paraLength);

      } else {
        synopsis = anime.synopsis;
      }

      if (anime.title.length <= 19) {
        cardClass = "card";
        console.log(`small- ${anime.title.length}`)
      } else if (anime.title.length > 19 && anime.title.length < 30) {
        console.log(`bigger shorted- ${anime.title.length}`)
        title = `${anime.title.slice(0, 19)}..`;
      } else {
        // cardClass = "card bigger";

        title = `${anime.title.slice(0, 40)}..`;
        cardClass = "card big";
        console.log(`big- ${anime.title.length}`)
      }

      return `
          <div class="${cardClass}" >
            <div class="img-container">
              <img   src="${anime.image_url}" >
            </div>
            <div class="content"> 
                  <h5 class="title">${title}</h5>
                  <p class="description">${synopsis}..</p>
              <footer class="details"> 
                  
                    <li><i class="fas fa-calendar-week">
                          </i> ${animeDate.slice(0, 4)}
                    </li>

                    <li>
                        <i class="fas fa-tv"></i> ${animeRated}
                    </li>

                    <li>
                        <a href="${anime.url}">
                            <i class="fas fa-arrow-circle-right"></i>
                        </a>
                        <a href="${anime.url}">More</a>
                    </li>
                  
              </footer>
            </div>
      </div>
      `
    }).join("");


    return `
    <section>
    <h3>${key.toUpperCase()}</h3>
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