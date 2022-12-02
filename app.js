const body = document.querySelector('body')
const container = document.querySelector('.container')
const current = document.querySelector('.current')
const forecast = document.querySelector('.forecast')
const info = document.querySelector('.info')
const hourly = document.querySelector('.hourly')
const daily = document.querySelector('.daily')
const btn = document.querySelector('.search')
const hourDay = document.querySelector('.hour-day')
const searchInput = document.querySelector('#searchInput')

btn.addEventListener('click', handleSearch)
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
});


const getWhetherCoord = async (location) => {
    const fetchCoords = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=9278ef0b172bee65d02e4df2b9be9e45`);
    const data = await fetchCoords.json();
    console.log(data)
    const lat = await data.coord.lat;
    const long = await data.coord.lon;
    const city = await data.name;
    const country = await data.sys.country;
    searchImg(city)
    return {lat, long, city, country}
}

const getWhetherInfo = async (long, lat, city, country) => {
    const forecastData = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,alerts&units=metric&appid=20f7632ffc2c022654e4093c6947b4f4`);
    const json = await forecastData.json();
    console.log(json)
    const place = [city, country]
    const data = { json, place }
    return data
}

const searchImg = async (description) =>{
    console.log('esto es', description)
    const getImg = await fetch(`https://api.unsplash.com/search/photos?query=${description}&client_id=7VN9OvxLY75kW8X2ZculdGC9Lu3gJPz6dHPjBNl5qu8`)
    const imgJson = await getImg.json()
    const imgSelected = await imgJson.results[0].urls.regular
    body.style.backgroundImage = `url(${imgSelected})`
}

function getInfo (data){
    console.log(data)
    const current = data.json.current
    const hourly = data.json.hourly
    const daily = data.json.daily
    
    const todayData = {
        'dayTime' : 'Today',
        'city' : data.place[0],
        'country' : data.place[1],
        'time' : new Date().toLocaleDateString(),
        'temp' : Math.round(current.temp * 10) / 10,
        'temp_max' : Math.round(daily[0].temp.max * 10) / 10,
        'temp_min' : Math.round(daily[0].temp.min * 10) / 10,
        'feels' : Math.round(current.feels_like * 10) / 10,
        'humidity' : current.humidity,
        'pressure' : current.pressure,
        'sunrise' : new Date(current.sunrise * 1000).toLocaleTimeString(),
        'sunset' : new Date(current.sunset * 1000).toLocaleTimeString(),
        'uv_index' : current.uvi,
        'description' : current.weather[0].description,
        'icon' : current.weather[0].icon,
        'wind_speed' : current.wind_speed
    }
    
    const hourlyData = hourly.map((el, index) => {
        const item = {
            'id' : index,
            'time' : new Date(el.dt * 1000).toLocaleTimeString().slice(0,2),
            'temp' : Math.round(el.temp * 10) / 10,
            'description' : el.weather[0].description,
            'icon' : el.weather[0].icon
        }
        return item
    })

    const dailyData = daily.map((el, index) => {
        const item = {
            'id' : index,
            'time' : new Date(el.dt * 1000).toGMTString().slice(0,3),
            'temp_max' : Math.round(el.temp.max * 10) / 10,
            'temp_min' : Math.round(el.temp.min * 10) / 10,
            'description' : el.weather[0].description,
            'icon' : el.weather[0].icon
        }
        return item
    })

    const weatherData = { todayData, dailyData, hourlyData }
    
    return weatherData
}

function displayToday (data) {
    current.innerHTML = `
            <div class="forecast">
                <h6>${data.todayData.time}</h4>
                <h3>${data.todayData.city}, ${data.todayData.country}</h3>
                <img src="http://openweathermap.org/img/wn/${data.todayData.icon}.png" alt="weather icon" id="icon">
                <span class="description">${data.todayData.description}</span>
                <h1 class="temp">${data.todayData.temp}°</h1>
                <div>
                <span class="temp-min">L: ${data.todayData.temp_min}°</span>
                <span class="temp-max">H: ${data.todayData.temp_max}°</span>
                </div>
            </div>
            <div class="info">
            <div class="humidity">Humidity: ${data.todayData.humidity}%</div>
            <div class="pressure">Pressure: ${data.todayData.pressure} hPa</div>
                <div class="uv-index">UV Index: ${data.todayData.uv_index}</div>
                <div class="wind-speed">Wind Speed: ${data.todayData.wind_speed} km/h</div>
                <div class="sunrise">Sunrise: ${data.todayData.sunrise} hs</div>
                <div class="sunset">Sunset: ${data.todayData.sunset} hs</div>
            </div>
    `
}

function displayHourly (data) {
    const twelveHours = data.hourlyData.slice(0,12)
    twelveHours.forEach((el, index) => {
        const hourly_container = document.createElement('div')
        hourly.appendChild(hourly_container)
        const hourlyTime = document.createElement('div')
        const hourlyIcon = document.createElement('div')
        const hourlyTemp = document.createElement('div')
        const hourlyDescription = document.createElement('div')
        hourlyTime.textContent = `${el.time} hs`
        hourlyIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${el.icon}.png" alt="">`
        hourlyTemp.textContent = ` ${el.temp}° `
        hourlyDescription.textContent = `${el.description}`
        hourly_container.appendChild(hourlyTime)
        hourly_container.appendChild(hourlyIcon)
        hourly_container.appendChild(hourlyTemp)
        hourly_container.appendChild(hourlyDescription)
        hourly_container.classList.add('hourly_container')
        hourlyDescription.classList.add('hourly-description')    
    })
}


function displayDaily(data) {
    const sevenDays = data.dailyData.slice(1,8)
    sevenDays.forEach(el => {
        const daily_container = document.createElement('div')
        daily_container.classList.add('daily_container')
        daily.appendChild(daily_container)
        const dailyTime = document.createElement('div')
        const dailyIcon = document.createElement('div')
        const dailyTempMin = document.createElement('span')
        const dailyTempMax = document.createElement('span')
        dailyTime.textContent = `${el.time}`
        dailyIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${el.icon}.png" alt="">`
        dailyTempMin.textContent = `L: ${el.temp_min}° `
        dailyTempMax.textContent = `H:${el.temp_max}°`
        daily_container.appendChild(dailyTime)
        daily_container.appendChild(dailyIcon)
        daily_container.appendChild(dailyTempMin)
        daily_container.appendChild(dailyTempMax)
    })
}



function clearDom() {
 current.innerHTML = ''
 daily.innerHTML = ''
 hourly.innerHTML = ''
}


function handleSearch() {
    clearDom()
    const value = searchInput.value
    getWhetherCoord(value)
                            .then(data => 
                                            getWhetherInfo(data.long, data.lat, data.city, data.country))
                            .then(data =>   getInfo(data))
                            .then(data => {
                                            displayDaily(data);
                                            displayHourly(data)
                                            displayToday(data)
    })
}

getWhetherCoord('rosario')
    .then(data =>   getWhetherInfo(data.long, data.lat, data.city, data.country))
    .then(data =>   getInfo(data))
    .then(data => {
                    displayDaily(data);
                    displayHourly(data)
                    displayToday(data);
                })















// function processData (data){
//     mainData = {
//         'feels' : Math.round(data.main.feels_like * 10) / 10,
//         'humidity' : data.main.humidity,
//         'pressure' : data.main.pressure,
//         'temp' : Math.round(data.main.temp * 10) / 10,
//         'max' : Math.round(data.main.temp_max * 10) / 10,
//         'min' : Math.round(data.main.temp_min * 10) / 10,
//         'name' : data.name,
//         'visibility' : data.visibility,
//         'wind-deg' : data.wind.deg,
//         'description' : data.weather[0].description,
//         'icon' : data.weather[0].icon,
//         'id' : data.weather[0].id,
//         'main' : data.weather[0].main,
//         'wind-speed' : Math.round((data.wind.speed * 1.65) * 10) / 10,
//         'country' : data.sys.country,
//         'sunrise' : data.sys.sunrise,
//         'sunset' : data.sys.sunset,
//     }
// return mainData
// }

// function printData (data) {
//     temp.textContent = `${data.temp}°`;
//     description.textContent = `${data.description.charAt(0).toUpperCase()}${data.description.slice(1)}`;
//     tempMin.textContent = `L: ${data.min}°`;
//     tempMax.textContent = `H: ${data.max}°`;
//     feelsLike.textContent = `Feels like: ${data.feels}°`;
//     humidity.textContent = `Humidity: ${data.humidity}%`;
//     pressure.textContent = `Pressure: ${data.pressure} hPa`;
//     city.textContent = `City: ${data.name}, ${data.country}`;
//     visibility.textContent = `Visibility: ${data.visibility / 1000} km`;
//     windDeg.textContent = `${data['wind-deg']}`;
//     windSpeed.textContent = `Wind Speed: ${data['wind-speed']} km/h`;
//     sunrise.textContent = `Sunrise: ${new Date(data.sunrise*1000).toLocaleTimeString()} hs`;
//     sunset.textContent = `Sunset: ${new Date(data.sunset*1000).toLocaleTimeString()} hs`;
// }

