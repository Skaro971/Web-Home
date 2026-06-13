const WMO_CODES = {
  0: 'Ciel dégagé', 1: 'Principalement dégagé', 2: 'Partiellement nuageux', 3: 'Couvert',
  45: 'Brouillard', 48: 'Brouillard givrant',
  51: 'Bruine légère', 53: 'Bruine modérée', 55: 'Bruine dense',
  61: 'Pluie légère', 63: 'Pluie modérée', 65: 'Pluie forte',
  71: 'Neige légère', 73: 'Neige modérée', 75: 'Neige forte',
  80: 'Averses légères', 81: 'Averses modérées', 82: 'Averses violentes',
  95: 'Orage', 96: 'Orage avec grêle', 99: 'Orage violent',
}

export function initWeather(container) {
  container.innerHTML = `<div class="weather weather--loading">Localisation...</div>`

  if (!navigator.geolocation) {
    container.innerHTML = `<div class="weather weather--error">Géolocalisation non disponible</div>`
    return
  }

  navigator.geolocation.getCurrentPosition(
    pos => fetchWeather(container, pos.coords.latitude, pos.coords.longitude),
    ()  => { container.innerHTML = `<div class="weather weather--error">Localisation refusée</div>` }
  )
}

async function fetchWeather(container, lat, lon) {
  try {
    const [weatherRes, geoRes] = await Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&wind_speed_unit=kmh`),
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`),
    ])

    const weather = await weatherRes.json()
    const geo     = await geoRes.json()

    const temp      = Math.round(weather.current.temperature_2m)
    const wind      = Math.round(weather.current.wind_speed_10m)
    const condition = WMO_CODES[weather.current.weather_code] ?? 'Inconnu'
    const city      = geo.address?.city ?? geo.address?.town ?? geo.address?.village ?? 'Lieu inconnu'

    container.innerHTML = `
      <div class="weather">
        <div class="weather__location">${city}</div>
        <div class="weather__temp">${temp}°C</div>
        <div class="weather__condition">${condition}</div>
        <div class="weather__wind">Vent ${wind} km/h</div>
      </div>
    `
  } catch {
    container.innerHTML = `<div class="weather weather--error">Météo indisponible</div>`
  }
}