// FETCH APIS
async function fetchFunction(url){
    try{
        const response = await fetch(await url, {headers:{'Accept': 'application/json'}});
        const data = await response.json();
        return data;
    }catch(error){
        console.log(error.message);
    }
}
// API class to create obj with method get for fetch url
class API{
    constructor(url, item){
        this.url=url;
        this.itemReturn=item;
    }
    get(){
        return fetchFunction(this.url);
    }
    async getItem(item){
        let data = await this.get();
        data = data[item];
        return data;
    }
}
// Get geolocation return promise because the obj navigator geolocation is async
function getPosition(){
    return new Promise((resolve, reject)=>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(position=>{
                const location ={
                    lat:position.coords.latitude,
                    lng:position.coords.longitude
                }
                resolve(location);
            },
            err=>reject(err.message));
        }
    });
}

class WeatherUI{
    constructor(){
        this.country = document.getElementById('weather__country');
        this.img = document.getElementById('weather__icon');
        this.temp = document.getElementById('weather__temp');
        this.description = document.getElementById('weather__description');
    }

    render({name, weather, main, sys}){
        this.country.textContent = `${name}, ${sys.country}`;
        this.temp.textContent = `${main.temp}º`;
        this.img.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        this.img.alt = weather[0].description;
    }
}

class WeatherAPI{
    constructor(){
        this.key='eeb84fbe0c8b7fc83ead5466ad7b526e';
        this.coords;
        this.defaultCoords={
            lat:'41.3888',
            lng:'2.159'
        };
        this.URI;
    }
    async awaitPos(){
        try{
            this.coords = await getPosition();
        }catch{
            this.coords = this.defaultCoords;
        }
        return await this.coords;
    }

   async makeURL(){
        this.coords = await this.awaitPos();

        const URI = `https://api.openweathermap.org/data/2.5/weather?lat=${this.coords.lat}&lon=${this.coords.lng}&appid=${this.key}&units=metric`;

        return URI;
    }
}

const UIWeather = new WeatherUI();
const weatherMakeURL = new WeatherAPI();

const dadJokes=new API('https://icanhazdadjoke.com/');
const chuckNorrisJokes=new API('https://api.chucknorris.io/jokes/random');
const openWeatherMap = new API(weatherMakeURL.makeURL());

async function randomJoke(){
    const jokes = [await dadJokes.getItem('joke'), await chuckNorrisJokes.getItem('value')];

    return jokes[Math.round(Math.random())];
}

async function initWeather(){
    document.getElementById('weather').classList.add('loading');
    UIWeather.render(await openWeatherMap.get());
    document.getElementById('weather').classList.remove('loading');
}

async function initJokes(){
    document.getElementById('weather').classList.add('loading');
    document.getElementById('jokes__joke').textContent = await randomJoke();
    document.getElementById('weather').classList.remove('loading');
}

document.addEventListener('click', e=>{ if(e.target.matches('#nextJokeBtn')) initJokes();});

async function init(){
    initWeather();
    initJokes();
}

document.addEventListener('DOMContentLoaded', init)