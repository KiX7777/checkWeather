'use strict'

let iconBtn = document.querySelector('.searchicon')
let input = document.querySelector('.input')
let searchbox = document.querySelector('.search')
let cityname = document.querySelector('.cityname')
let date = document.querySelector('.date')
let icon = document.querySelector('.icon')
let description = document.querySelector('.current-description')
let currenttemp = document.querySelector('.current-temp')
let mintemp = document.querySelector('.mintemp')
let weatherbox = document.querySelector('.weatherbox ')
let spinner = document.querySelector('.spinner ')
let initialRender = true
let maxtemp = document.querySelector('.maxtemp')
let newdate = new Date()
let options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}
let today = new Intl.DateTimeFormat('hr-HR', options).format(newdate)
let snowpic =
  'url(https://images.unsplash.com/photo-1516431883659-655d41c09bf9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80)'
let rainpic =
  'url(https://images.unsplash.com/photo-1512511708753-3150cd2ec8ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80)'
let sunnypic =
  'url(https://images.unsplash.com/photo-1599117573949-63e225331c7b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80)'
let cloudypic =
  'url(https://images.unsplash.com/photo-1491237596458-ccbf4462e884?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80)'
let fogpic =
  'url(https://images.unsplash.com/photo-1510596713412-56030de252c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80)'
let thunderstormpic =
  'url(https://images.unsplash.com/photo-1537036017783-64573b29adb9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=725&q=80)'

//----------------------------------------------------------------------------------------------------------------------

async function getPos() {
  let koordinate = []
  function successGeo(pos) {
    const { latitude: lat, longitude: long } = pos.coords
    koordinate.push(lat, long)
  }
  function errorGeo(err) {
    console.log(err)
  }
  await navigator.geolocation.getCurrentPosition(successGeo, errorGeo)
  return koordinate
}

const getWeather = async function (city) {
  //IIFE (automatski se izvodi)
  try {
    let name = input.value.trimStart()
    if (!name) {
      throw new Error('Polje ne može biti prazno')
      return
    }
    const coords = await getCityCoords(name)
    if (coords === undefined) {
      return
    }
    let [lat, long, cityName] = coords
    let errorMsg = document.querySelector('.error')
    let wIcon = document.querySelector('.weathericon')
    const weather = await getWeatherData(lat, long)
    cityname.textContent = cityName + `, ${getFlagEmoji(weather.country)}`
    console.log(weather)
    renderData(weather)
    showIcon(weather.icon)

    backgroundPic(weather.weatherID)

    if (errorMsg) {
      errorMsg.remove()
    }
    if (wIcon) {
      wIcon.remove()
    }
  } catch (err) {
    handleError(err.message)

    console.log(err)
  }
}

function showIcon(id) {
  let icon = document.createElement('img')
  icon.src = `https://openweathermap.org/img/wn/${id}@2x.png`
  icon.classList = 'weathericon textAnim'
  document.querySelector('.visual-info').append(icon)
  if (id === '13n') {
    icon.style.filter =
      'invert(100%) sepia(53%) saturate(5896%) hue-rotate(-138deg) brightness(165%) contrast(355%)'
  }
}

// const lokacija = findMe();

async function getWeatherData(lat, long) {
  try {
    const georeverse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&lang=hr&appid=689e735828dc8c51f8922560330f00dc&units=metric`
    )

    //get city name by coords
    let data = await georeverse.json()

    let dataObj = {
      currentTemp: data.main.temp,
      minTemp: data.main.temp_min,
      maxTemp: data.main.temp_max,
      description: data.weather[0].description,
      weatherID: data.weather[0].id.toString(),
      icon: data.weather[0].icon,
      country: data.sys.country,
      cityName: data.name,
    }
    return dataObj
  } catch (err) {
    console.log(err)
  }
}
async function getCityCoords(city) {
  try {
    const weather = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=689e735828dc8c51f8922560330f00dc`
    )
    let data = await weather.json()
    if (data.length <= 0) {
      throw new Error('Lokacija ne postoji')
      return
    }
    console.log(data)
    let cityname = data[0].name
    let { lat, lon } = data[0]
    return [lat, lon, cityname]
  } catch (err) {
    handleError(err.message)
    console.log(err)
  }
}

function handleError(err) {
  let error = document.createElement('p')
  error.textContent = `${err}!`
  error.classList = 'error'

  if (document.querySelector('.error')) {
    return
  } else document.querySelector('.inputbox').appendChild(error)
}

iconBtn.addEventListener('click', (e) => {
  e.preventDefault()
  if (searchbox.classList.contains('active')) {
    if (input.value === '') {
      searchbox.classList.remove('active')
      return
    } else {
      getWeather()
      input.value = ''
      searchbox.classList.remove('active')
    }
  } else {
    searchbox.classList.add('active')
    input.focus()
  }
})

document.querySelector('.opacity').addEventListener('click', (e) => {
  if (e.target.classList.contains('opacity')) {
    searchbox.classList.remove('active')
  }
})

searchbox.addEventListener('submit', (e) => {
  e.preventDefault()
  getWeather()
  // if (errorMsg) {
  //   errorMsg.remove();
  // }
})

function backgroundPic(weatherID) {
  if (weatherID.startsWith('2')) {
    document.querySelector('.blur').style.backgroundImage = thunderstormpic
  } else if (weatherID.startsWith('3')) {
    document.querySelector('.blur').style.backgroundImage = rainpic
  } else if (weatherID.startsWith('5')) {
    document.querySelector('.blur').style.backgroundImage = rainpic
  } else if (weatherID.startsWith('6')) {
    document.querySelector('.blur').style.backgroundImage = snowpic
  } else if (weatherID.startsWith('7')) {
    document.querySelector('.blur').style.backgroundImage = fogpic
  } else if (weatherID === '800') {
    document.querySelector('.blur').style.backgroundImage = sunnypic
  } else if (
    weatherID === '801' ||
    weatherID === '802' ||
    weatherID === '803' ||
    weatherID === '804'
  ) {
    document.querySelector('.blur').style.backgroundImage = cloudypic
  }
}

function renderData(data) {
  currenttemp.textContent = `${Math.round(data.currentTemp)}`
  mintemp.textContent = Math.round(data.minTemp)
  maxtemp.textContent = Math.round(data.maxTemp)
  let capitalizeDesc =
    data.description.charAt(0).toUpperCase() + data.description.slice(1)
  description.textContent = capitalizeDesc
  date.textContent = today
  input.value = ''
  animate()
  spinner.style.display = 'none'
  weatherbox.addEventListener('animationend', (e) => {
    removeAnimation()
  })
}

async function init() {
  renderSpinner()
  //getting user's coords
  const data = await getPos()
  console.log(data)
  let cityName, weather
  if (data.length === 0) {
    console.log('No access')
    let ZG = await getCityCoords('Zagreb, HR')
    let [lat, long] = ZG
    cityName = ZG[2]
    weather = await getWeatherData(lat, long)
  } else {
    weather = await getWeatherData(data[0], data[1])
    console.log(weather)
    cityName = weather.cityName
  }
  //getting current weather

  cityname.textContent = cityName + `, ${getFlagEmoji(weather.country)}`
  renderData(weather)
  showIcon(weather.icon)
  backgroundPic(weather.weatherID)

  document.querySelectorAll('p').forEach((el) => {
    el.style.visibility = 'visible'
  })
}

function animate() {
  document.querySelector('.blur').classList.add('blurAnim')
  document.querySelectorAll('p').forEach((el) => {
    el.classList.add('textAnim')
  })
}
function removeAnimation() {
  document.querySelector('.blur').classList.remove('blurAnim')
  document.querySelector('.weathericon').classList.remove('textAnim')
  document.querySelectorAll('p').forEach((el) => {
    el.classList.remove('textAnim')
  })
}

function renderSpinner() {
  spinner.style.display = 'block'
}

window.onload = function () {
  let pageTitle = document.title
  let attentionMessage = 'Come Back!'

  document.addEventListener('visibilitychange', function (e) {
    let isPageActive = !document.hidden

    if (!isPageActive) {
      document.title = attentionMessage
    } else {
      document.title = pageTitle
    }
  })
}

init()

function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt())
  return String.fromCodePoint(...codePoints)
}
