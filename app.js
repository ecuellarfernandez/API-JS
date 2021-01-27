// fetch('https://icanhazdadjoke.com/',{ headers:{'Accept':'application/json',}})
// .then(response => response.json())
// .then(data => console.log(data.joke))
//     .catch(()=> console.error('Error'))

    // JOKES
    const $joke = document.getElementById('joke');
    const $button = document.getElementById('showJoke');

    // async function fetchJoke(){
    //     try{
    //         $button.textContent='';
    //         $button.classList.add('loading-spin');

    //         const RESPONSE = await fetch('https://icanhazdadjoke.com/', {headers:{'Accept':'application/json'}});
    //         const DATA = await RESPONSE.json();
    //         $joke.textContent = DATA.joke;

    //         $joke.classList.remove('loading-spin');
    //         $button.classList.remove('loading-spin');
    //         $button.textContent='Next Joke';
    //     }catch(err){
    //         console.log(err.message);
    //     }
    // }

    async function fetchJokesArr(arr){
        try{
            // loading animations
            $button.textContent='';
            $button.classList.add('loading-spin');

            const PROMISES = arr.map(async url=>{
                const RESPONSE = await fetch(url, {headers:{'Accept':'application/json'}});
                return RESPONSE.json();
            });
            let ObjResponses=[];
            for(promise of PROMISES){ ObjResponses.unshift(await promise) }
            let values = [ObjResponses[0].joke, ObjResponses[1].value];

            $joke.classList.remove('loading-spin');
            $button.classList.remove('loading-spin');
            $button.textContent='Next joke';

            // Print the value on html
            let randomNum = Math.round(Math.random());
            $joke.textContent = values[randomNum];
        }catch(error){
            console.log(error.message);
        }
    }

    fetchJokesArr(['https://api.chucknorris.io/jokes/random', 'https://icanhazdadjoke.com/']);
    
    document.addEventListener('click',e=> {
        if(e.target.matches('#showJoke')) fetchJokesArr(['https://api.chucknorris.io/jokes/random', 'https://icanhazdadjoke.com/']);
    });


    // Weather app

    class Store{
        constructor(lat, lng){
            this.lat = lat;
            this.lng = lng;
        }

        checkStorage(){
            const CHK_LAT = localStorage.getItem('lat');
            const CHK_LNG = localStorage.getItem('lng');

            if(CHK_LAT === null || CHK_LNG === null) return false;

            this.lat = CHK_LAT;
            this.lng = CHK_LNG;

            return{
                lat: this.lat,
                lng: this.lng
            }
        }

        setStorage(lat,lng){
            localStorage.setItem('lat', lat);
            localStorage.setItem('lng', lng);
        }

    }

    const STORE = new Store();

    function getUserLocation(){
        let defaultLat = '41.3888';
        let defaultLng = '2.159';

        if(navigator.geolocation){
            
            navigator.geolocation.getCurrentPosition(position=>{
                getWeather(position.coords.latitude, position.coords.longitude);
                STORE.setStorage(position.coords.latitude, position.coords.longitude);
            },
            ()=>{
                getWeather(defaultLat, defaultLng);
                STORE.setStorage(defaultLat, defaultLng);
                console.log('User declined the geolocation');
            });

        }else{
            getWeather(defaultLat, defaultLng);
            STORE.setStorage(defaultLat, defaultLng);
            alert('Your browser not support the geolocation api');
        }
    }

    class UI{
        constructor(){
            this.country = document.getElementById('weather__country');
            this.temp = document.getElementById('weather__temp');
            this.icon = document.getElementById('weather__icon');
        }

        renderWeather({name, sys, main, weather}){
            this.country.textContent = `${name}, ${sys.country}`;
            this.temp.textContent = `${main.temp}º`;
            this.icon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        }
    }

    const UI_OBJ = new UI();

    async function getWeather(lat, lng){
        const KEY = 'eeb84fbe0c8b7fc83ead5466ad7b526e';
        const URI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${KEY}&units=metric`;
        try{
            const RESPONSE = await fetch(URI);
            const DATA = await RESPONSE.json();
            UI_OBJ.renderWeather(DATA);
        }catch(error){
            console.log(error.message);
        }
    }

    document.addEventListener('DOMContentLoaded',()=>{
        if(STORE.checkStorage()){
            const {lat, lng} = STORE.checkStorage();
            getWeather(lat, lng);
            STORE.setStorage(lat, lng);
        }else{
            getUserLocation();
        }
    });


