import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'

const SUGGESTIONS = [
  'Which drones have low battery?',
  'What is the status of Farm Beta?',
  'Who is assigned to critical tasks?',
  'Are there any active alerts?',
  'Which drones are in flight?',
  'What maintenance tasks are unassigned?',
]

export default function AIAgent({ user }) {
  const { drones, alerts, queue, logs } = useApp()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${user.name}! I'm your DFMS Operations Assistant. I have live access to your fleet data, alerts, and maintenance queue. How can I help you?`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function buildSystemPrompt() {
    const droneStatus = drones.map(d =>
      `${d.id}: ${d.status}, battery ${d.battery}%, location: ${d.location}`
    ).join('\n')

    const alertStatus = alerts.length === 0
      ? 'No active alerts'
      : alerts.map(a => `${a.title} — ${a.body}`).join('\n')

    const queueStatus = queue.map(q =>
      `${q.id} (${q.severity}): ${q.turbine} — ${q.issue}, assigned to: ${q.assignedTo || 'Unassigned'}, completed: ${q.completed ? 'Yes' : 'No'}`
    ).join('\n')

    const recentLogs = logs.slice(0, 10).map(l =>
      `[${l.time}] ${l.level}: ${l.message}`
    ).join('\n')

    return `You are an AI operations assistant for WindTech DFMS (Drone Fleet Management System).
You have access to live fleet data. Be concise and helpful. Use bullet points for lists.
Always refer to specific drone IDs, turbine numbers, and technician names when relevant.

CURRENT FLEET STATUS:
${droneStatus}

ACTIVE ALERTS:
${alertStatus}

MAINTENANCE QUEUE:
${queueStatus}

RECENT SYSTEM LOGS:
${recentLogs}

The current user is ${user.name} (${user.role}).`
  }

  async function sendMessage() {
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          max_tokens: 1000,
          messages: [
            { role: 'system', content: buildSystemPrompt() },
            ...[...messages, userMsg].map(m => ({
              role: m.role,
              content: m.content,
            })),
          ],
        }),
      })

      const data = await response.json()
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not get a response.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }])
    }

    setLoading(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">🤖 AI Operations Assistant</div>
          <div className="page-subtitle">
            Live fleet data · ask anything about drones, alerts, or maintenance
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 14 }}>
        <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: 520 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {m.role === 'assistant' && (
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', background: 'var(--acc)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, flexShrink: 0, marginRight: 8, marginTop: 2
                  }}>🤖</div>
                )}
                <div style={{
                  maxWidth: '72%', padding: '9px 12px',
                  borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: m.role === 'user' ? 'var(--acc)' : 'var(--bg3)',
                  color: m.role === 'user' ? '#fff' : 'var(--text)',
                  fontSize: 12, lineHeight: 1.6,
                  border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', background: 'var(--info)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 10, fontWeight: 600, flexShrink: 0, marginLeft: 8, marginTop: 2
                  }}>
                    {user.initials}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', background: 'var(--acc)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13
                }}>🤖</div>
                <div style={{
                  padding: '9px 12px', borderRadius: '12px 12px 12px 2px',
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  fontSize: 12, color: 'var(--text2)', display: 'flex', gap: 4, alignItems: 'center'
                }}>
                  <span style={{ animation: 'blink 1s infinite' }}>●</span>
                  <span style={{ animation: 'blink 1s infinite .3s' }}>●</span>
                  <span style={{ animation: 'blink 1s infinite .6s' }}>●</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{
            padding: '10px 14px', borderTop: '1px solid var(--border)',
            display: 'flex', gap: 8, alignItems: 'flex-end'
          }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about fleet status, alerts, maintenance..."
              rows={2}
              style={{
                flex: 1, padding: '8px 10px',
                border: '1px solid var(--border)', borderRadius: 8,
                background: 'var(--bg2)', color: 'var(--text)',
                fontSize: 12, resize: 'none', outline: 'none', fontFamily: 'inherit',
              }}
            />
            <button
              className="btn btn-primary"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{ padding: '8px 14px', alignSelf: 'flex-end' }}
            >
              Send
            </button>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Quick questions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                className="btn"
                style={{ textAlign: 'left', fontSize: 11, padding: '7px 10px', lineHeight: 1.4 }}
                onClick={() => setInput(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>
              Live context
            </div>
            <div style={{ fontSize: 10, color: 'var(--text2)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div>🚁 {drones.filter(d => d.status === 'inflight').length} drones in flight</div>
              <div>🔔 {alerts.length} active alerts</div>
              <div>📋 {queue.filter(q => !q.assignedTo).length} unassigned tasks</div>
              <div>✅ {queue.filter(q => q.completed).length} tasks completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}