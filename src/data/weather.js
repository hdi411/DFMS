export const weatherData = [
  {
    name: 'Farm Alpha',
    icon: '🌤️',
    wind: 22,
    temp: 12,
    visibility: 18,
    precipitation: 'None',
    lightning: 'None',
    condition: 'Clear',
    status: 'safe',
  },
  {
    name: 'Farm Beta',
    icon: '🌬️',
    wind: 38,
    temp: 9,
    visibility: 14,
    precipitation: 'None',
    lightning: 'None',
    condition: 'Overcast',
    status: 'hold',
  },
  {
    name: 'Farm Gamma',
    icon: '⛈️',
    wind: 52,
    temp: 6,
    visibility: 4,
    precipitation: 'Heavy',
    lightning: 'Active',
    condition: 'Storm',
    status: 'danger',
  },
]

export const windForecast = [38, 40, 44, 47, 51, 49, 43, 38, 33, 28, 25, 22]

export const safetyLimits = {
  wind: 45,
  visibility: 5,
  minTemp: -5,
  precipitation: 'None',
  lightning: 'None',
}