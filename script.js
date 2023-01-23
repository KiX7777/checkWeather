'use strict';

let iconBtn = document.querySelector('.icon');
let input = document.querySelector('.input');
let searchbox = document.querySelector('.search');

const getPosition = function () {
  //funkcija koja vraća promise, a resolved value je position iz navigatora (ako se dobije)
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const findMe = async function () {
  try {
    //getPosition je promise i on se sad awaita i rezultat (position) se pohranjuje u varijablu
    const position = await getPosition();

    //uzimanje koordinata i pohranjivanje u varijable
    let { latitude, longitude } = position.coords;
    //ova funkcija će kao rezultat vratiti koordinate
    return [latitude, longitude];
  } catch (err) {
    console.log(err);
  }
};

const getWeather = async function () {
  //IIFE (automatski se izvodi)
  try {
    //uzima se rezultat findMe = koordinate
    // const pozicija = await findMe();
    // let lat = pozicija[0];
    // let long = pozicija[1];
    // const getWeather = await getGeoWeatherData(lat, long);
    // console.log(getWeather);
    let name = input.value;
    if (!name) {
      throw new Error('Polje ne može biti prazno');
      return;
    }
    const coords = await getCityCoords(name);
    let [lat, long] = coords;
    console.log(lat, long);
    const weather = await getGeoWeatherData(lat, long);
    console.log(weather);
    let iconId = weather.weather[0].icon;
    let icon = document.createElement('img');
    icon.src = `http://openweathermap.org/img/wn/${iconId}@2x.png`;
    icon.classList = 'icon';
    document.querySelector('.container').append(icon);
    document.querySelector('.error').remove();
  } catch (err) {
    handleError(err.message);

    console.log(err);
  }
};

// const lokacija = findMe();

async function getGeoWeatherData(lat, long) {
  try {
    const georeverse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&lang=hr&appid=689e735828dc8c51f8922560330f00dc&units=metric`
    );
    let data = await georeverse.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}
async function getCityCoords(city) {
  try {
    const weather = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=689e735828dc8c51f8922560330f00dc`
    );
    let data = await weather.json();
    if (data.length <= 0) {
      throw new Error('Lokacija ne postoji');
    }
    console.log(data);
    console.log(data[0]);
    let { lat, lon } = data[0];
    return [lat, lon];
  } catch (err) {
    handleError(err.message);
    console.log(err);
  }
}

// fetch(
//   'http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid={689e735828dc8c51f8922560330f00dc}'
// );

function handleError(err) {
  let error = document.createElement('p');
  error.textContent = `${err}!`;
  error.classList = 'error';

  document.querySelector('.weatherbox').appendChild(error);
}

iconBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (searchbox.classList.contains('active')) {
    getWeather();
    input.value = '';
    searchbox.classList.remove('active');
  } else {
    searchbox.classList.add('active');
    input.focus();
  }
});

document.querySelector('.container').addEventListener('click', (e) => {
  if (e.target.classList.contains('container')) {
    searchbox.classList.remove('active');
  }
});

searchbox.addEventListener('keydown', (e) => {
  console.log(e.key);
  if (e.key === 'Enter') {
    e.preventDefault();
    getWeather();
  }
});
