import { weatherData, windForecast, safetyLimits } from '../data/weather'

export default function Weather({ showToast }) {
  const maxWind = 55

  function statusLabel(status) {
    if (status === 'safe')   return { cls: 'ws-safe',   text: '✓ Dispatch Safe' }
    if (status === 'hold')   return { cls: 'ws-hold',   text: '⚠ Weather Hold' }
    if (status === 'danger') return { cls: 'ws-danger', text: '🔴 Unsafe — Recall' }
  }

  function barColor(wind) {
    if (wind >= safetyLimits.wind) return 'var(--danger)'
    if (wind >= 35)                return 'var(--warn)'
    return 'var(--acc)'
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">🌤️ Weather &amp; Safety</div>
          <div className="page-subtitle">WFS integration · real-time dispatch validation · safety thresholds</div>
        </div>
        <button className="btn" onClick={() => showToast('Weather data refreshed from WFS')}>
          🔄 Refresh WFS
        </button>
      </div>

      {/* WEATHER CARDS */}
      <div className="three-col" style={{ marginBottom: 14 }}>
        {weatherData.map(w => {
          const s = statusLabel(w.status)
          return (
            <div className="weather-card" key={w.name}>
              <span className="weather-icon">{w.icon}</span>
              <div className="weather-name">{w.name}</div>
              <div className="weather-details">
                Wind: {w.wind} km/h · Temp: {w.temp}°C<br />
                Visibility: {w.visibility} km · {w.condition}
              </div>
              <div className={`weather-status ${s.cls}`}>{s.text}</div>
            </div>
          )
        })}
      </div>

      <div className="two-col">
        {/* WIND FORECAST CHART */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📊 12-Hour Wind Forecast — Farm Beta</div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 10 }}>
            Operational limit: <strong>{safetyLimits.wind} km/h</strong> · Current: <strong style={{ color: 'var(--warn)' }}>38 km/h</strong>
          </div>
          <div style={{ position: 'relative' }}>
            {/* threshold line */}
            <div style={{
              position: 'absolute',
              bottom: 22 + (safetyLimits.wind / maxWind) * 100,
              left: 0, right: 0,
              height: 1,
              background: 'var(--danger)',
              opacity: .5,
              zIndex: 1
            }} />
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 100 }}>
              {windForecast.map((w, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '100%',
                    height: (w / maxWind) * 100,
                    background: barColor(w),
                    borderRadius: '3px 3px 0 0',
                    opacity: .85,
                    transition: '.2s'
                  }} title={`${w} km/h`} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--text3)', marginTop: 4 }}>
              {['Now','+2h','+4h','+6h','+8h','+10h','+12h'].map(l => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 8, display: 'flex', gap: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 10, background: 'var(--acc)', borderRadius: 2, display: 'inline-block' }} /> Safe
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 10, background: 'var(--warn)', borderRadius: 2, display: 'inline-block' }} /> Caution
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 10, background: 'var(--danger)', borderRadius: 2, display: 'inline-block' }} /> Unsafe
            </span>
          </div>
        </div>

        {/* SAFETY THRESHOLDS */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🛡️ Safety Thresholds</div>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Parameter</th><th>Limit</th><th>Farm Alpha</th><th>Farm Beta</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Wind speed</td><td>{safetyLimits.wind} km/h</td>
                <td style={{ color: 'var(--acc)' }}>22 ✓</td>
                <td style={{ color: 'var(--warn)' }}>38 ⚠</td>
              </tr>
              <tr>
                <td>Visibility</td><td>&gt;{safetyLimits.visibility} km</td>
                <td style={{ color: 'var(--acc)' }}>18km ✓</td>
                <td style={{ color: 'var(--acc)' }}>14km ✓</td>
              </tr>
              <tr>
                <td>Temperature</td><td>&gt;{safetyLimits.minTemp}°C</td>
                <td style={{ color: 'var(--acc)' }}>12°C ✓</td>
                <td style={{ color: 'var(--acc)' }}>9°C ✓</td>
              </tr>
              <tr>
                <td>Precipitation</td><td>None</td>
                <td style={{ color: 'var(--acc)' }}>Clear ✓</td>
                <td style={{ color: 'var(--acc)' }}>Clear ✓</td>
              </tr>
              <tr>
                <td>Lightning</td><td>None</td>
                <td style={{ color: 'var(--acc)' }}>None ✓</td>
                <td style={{ color: 'var(--acc)' }}>None ✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}