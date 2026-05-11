import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { tools } from './data/tools'
import type { Tool, Category } from './data/tools'
import './index.css'

const FILTER_TABS = [
  'All',
  'Recon',
  'Fuzzing',
  'Enumeration',
  'Exploitation',
  'Post-Exploit',
  'Network',
  'Password',
]

const TAG_MAP: Record<string, string> = {
  Recon: 'recon',
  Fuzzing: 'fuzzing',
  Enumeration: 'enumeration',
  Exploitation: 'exploitation',
  'Post-Exploit': 'post-exploitation',
  Network: 'network',
  Password: 'password',
}

const TAG_COLORS: Record<string, string> = {
  fuzzing: '#00ff41',
  recon: '#00e5ff',
  enumeration: '#ffaa00',
  exploitation: '#ff4444',
  'post-exploitation': '#cc44ff',
  network: '#44aaff',
  password: '#ff6644',
  web: '#555',
  smb: '#555',
  windows: '#555',
  linux: '#555',
  osint: '#555',
  'active directory': '#777',
  kerberos: '#777',
  dns: '#777',
  database: '#777',
  gpu: '#777',
  cloud: '#44ddaa',
}

const TOTAL_COMMANDS = tools.reduce(
  (acc, t) => acc + t.categories.reduce((a, c) => a + c.commands.length, 0),
  0
)

const HINTS = ['fuzzing', 'nmap', 'smb', 'privesc', 'ldap', 'xss', 'sqlmap', 'kerberos']

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])

  return (
    <button
      onClick={handleCopy}
      style={{
        background: copied ? 'rgba(0,255,65,0.15)' : 'rgba(255,255,255,0.04)',
        border: copied ? '1px solid rgba(0,255,65,0.4)' : '1px solid #2a2a2a',
        color: copied ? '#00ff41' : '#555',
        padding: '3px 12px',
        fontSize: '11px',
        fontFamily: 'inherit',
        cursor: 'pointer',
        borderRadius: '2px',
        whiteSpace: 'nowrap',
        transition: 'all 0.15s ease',
        flexShrink: 0,
      }}
    >
      {copied ? '✓ copied' : 'copy'}
    </button>
  )
}

function CommandRow({ label, cmd }: { label: string; cmd: string }) {
  return (
    <div
      style={{
        borderBottom: '1px solid #141414',
        padding: '10px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <span style={{ color: '#777', fontSize: '11px', lineHeight: '1.4', paddingTop: '3px' }}>{label}</span>
        <CopyButton text={cmd} />
      </div>
      <code
        style={{
          background: '#0a0a0a',
          border: '1px solid #1a2a1a',
          color: '#00e5ff',
          fontSize: '13px',
          padding: '8px 14px',
          borderRadius: '2px',
          overflowX: 'auto',
          display: 'block',
          whiteSpace: 'pre',
          fontFamily: 'JetBrains Mono, Fira Code, Courier New, monospace',
          lineHeight: '1.6',
        }}
      >
        {cmd}
      </code>
    </div>
  )
}

function ToolCard({
  tool,
  isSelected,
  onSelect,
}: {
  tool: Tool
  isSelected: boolean
  onSelect: () => void
}) {
  const primaryTags = tool.tags.slice(0, 3)
  return (
    <div
      onClick={onSelect}
      style={{
        background: isSelected ? '#0d1a0d' : '#111111',
        border: isSelected ? '1px solid #00ff41' : '1px solid #1a1a1a',
        borderRadius: '2px',
        cursor: 'pointer',
        padding: '14px 16px',
        transition: 'border-color 0.1s ease, background 0.1s ease',
        userSelect: 'none',
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          ;(e.currentTarget as HTMLElement).style.borderColor = '#2a3a2a'
          ;(e.currentTarget as HTMLElement).style.background = '#131313'
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          ;(e.currentTarget as HTMLElement).style.borderColor = '#1a1a1a'
          ;(e.currentTarget as HTMLElement).style.background = '#111111'
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ color: isSelected ? '#00ff41' : '#d0d0d0', fontSize: '14px', fontWeight: 700 }}>
              {tool.name}
            </span>
            <span style={{ color: '#2a2a2a', fontSize: '10px' }}>{tool.categories.length}m</span>
          </div>
          <p style={{ color: '#555', fontSize: '11px', margin: '0 0 8px', lineHeight: '1.4' }}>
            {tool.description}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
            {primaryTags.map(tag => (
              <span
                key={tag}
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  border: `1px solid ${TAG_COLORS[tag] ? TAG_COLORS[tag] + '33' : '#1f1f1f'}`,
                  color: TAG_COLORS[tag] || '#444',
                  fontSize: '9px',
                  padding: '1px 5px',
                  borderRadius: '2px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <span style={{ color: isSelected ? '#00ff41' : '#333', fontSize: '14px', flexShrink: 0 }}>
          {isSelected ? '▼' : '›'}
        </span>
      </div>
    </div>
  )
}

function getMatchingCategory(tool: Tool, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return tool.categories[0]
  return (
    tool.categories.find(
      cat =>
        cat.name.toLowerCase().includes(q) ||
        cat.commands.some(cmd => cmd.label.toLowerCase().includes(q) || cmd.cmd.toLowerCase().includes(q))
    ) ?? tool.categories[0]
  )
}

function getSearchScore(tool: Tool, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return 0
  if (tool.id.toLowerCase() === q || tool.name.toLowerCase() === q) return 100
  if (tool.id.toLowerCase().includes(q) || tool.name.toLowerCase().includes(q)) return 80
  if (tool.tags.some(tag => tag.toLowerCase() === q)) return 70
  if (tool.categories.some(cat => cat.name.toLowerCase() === q)) return 60
  if (tool.description.toLowerCase().includes(q)) return 40
  if (tool.categories.some(cat => cat.commands.some(cmd => cmd.label.toLowerCase().includes(q)))) return 30
  return 10
}

function ExpandedPanel({ tool, query, onClose }: { tool: Tool; query: string; onClose: () => void }) {
  const [activeCategory, setActiveCategory] = useState<Category>(() => getMatchingCategory(tool, query))

  useEffect(() => {
    setActiveCategory(getMatchingCategory(tool, query))
  }, [tool, query])

  return (
    <div
      style={{
        background: '#0c150c',
        border: '1px solid #00ff41',
        borderRadius: '2px',
        overflow: 'hidden',
        marginTop: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: '1px solid #1a3a1a',
          background: '#0a120a',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#00ff41', fontSize: '18px', fontWeight: 900, letterSpacing: '1px' }}>
            {tool.name}
          </span>
          <span style={{ color: '#555', fontSize: '12px' }}>{tool.description}</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: '1px solid #2a2a2a',
            color: '#555',
            padding: '4px 12px',
            fontSize: '11px',
            fontFamily: 'inherit',
            cursor: 'pointer',
            borderRadius: '2px',
            transition: 'all 0.1s ease',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLElement).style.borderColor = '#ff4444'
            ;(e.currentTarget as HTMLElement).style.color = '#ff4444'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'
            ;(e.currentTarget as HTMLElement).style.color = '#555'
          }}
        >
          ✕ close
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          borderBottom: '1px solid #1a2a1a',
          background: '#080f08',
          padding: '0 4px',
        }}
      >
        {tool.categories.map(cat => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat)}
            style={{
              background: activeCategory.name === cat.name ? 'rgba(0,255,65,0.06)' : 'none',
              border: 'none',
              borderBottom: activeCategory.name === cat.name ? '2px solid #00ff41' : '2px solid transparent',
              color: activeCategory.name === cat.name ? '#00ff41' : '#444',
              padding: '10px 18px',
              fontSize: '11px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.1s ease',
              letterSpacing: '0.3px',
            }}
            onMouseEnter={e => {
              if (activeCategory.name !== cat.name)
                (e.currentTarget as HTMLElement).style.color = '#888'
            }}
            onMouseLeave={e => {
              if (activeCategory.name !== cat.name)
                (e.currentTarget as HTMLElement).style.color = '#444'
            }}
          >
            {cat.name}
            <span style={{ color: '#333', marginLeft: '6px', fontSize: '10px' }}>{cat.commands.length}</span>
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
        }}
      >
        {activeCategory.commands.map((cmd, i) => (
          <CommandRow key={i} label={cmd.label} cmd={cmd.cmd} />
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const showResults = query.trim() !== '' || activeFilter !== 'All'

  const filteredTools = useMemo(() => {
    if (!showResults) return []
    let result = tools
    const hasQuery = query.trim() !== ''
    if (!hasQuery && activeFilter !== 'All') {
      const tagKey = TAG_MAP[activeFilter]
      result = result.filter(t => t.tags.includes(tagKey))
    }
    if (hasQuery) {
      const q = query.toLowerCase()
      result = result.filter(
        t =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some(tag => tag.toLowerCase().includes(q)) ||
          t.categories.some(
            cat =>
              cat.name.toLowerCase().includes(q) ||
              cat.commands.some(cmd => cmd.label.toLowerCase().includes(q) || cmd.cmd.toLowerCase().includes(q))
          )
      )
      result = [...result].sort((a, b) => getSearchScore(b, query) - getSearchScore(a, query))
    }
    return result
  }, [query, activeFilter, showResults])

  const selectedTool = useMemo(
    () => (selectedToolId ? tools.find(t => t.id === selectedToolId) ?? null : null),
    [selectedToolId]
  )

  useEffect(() => {
    if (!showResults || filteredTools.length === 0) {
      setSelectedToolId(null)
      return
    }

    if (!selectedToolId || !filteredTools.some(tool => tool.id === selectedToolId)) {
      setSelectedToolId(filteredTools[0].id)
    }
  }, [filteredTools, selectedToolId, showResults])

  const handleSelectTool = (id: string) =>
    setSelectedToolId(prev => (prev === id ? null : id))

  const handleReset = () => {
    setQuery('')
    setActiveFilter('All')
    setSelectedToolId(null)
    // focus restored to hero input position automatically since same element
  }

  const handleHint = (hint: string) => {
    setQuery(hint)
    inputRef.current?.focus()
  }

  const handleFilterTab = (tab: string) => {
    setActiveFilter(tab)
    setSelectedToolId(null)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        fontFamily: 'JetBrains Mono, Fira Code, Courier New, monospace',
      }}
    >
      {/* ── HERO decorations (above input) — only visible in hero state */}
      {!showResults && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '18vh',
            paddingBottom: '20px',
          }}
        >
          <h1
            style={{
              color: '#00ff41',
              fontSize: '48px',
              fontWeight: 900,
              letterSpacing: '12px',
              margin: '0 0 8px',
              textShadow: '0 0 30px rgba(0,255,65,0.35)',
              fontFamily: 'inherit',
            }}
          >
            OCRA
          </h1>
          <p style={{ color: '#2a3a2a', fontSize: '11px', margin: 0, letterSpacing: '3px' }}>
            OFFENSIVE COMMAND REFERENCE ARCHIVE
          </p>
        </div>
      )}

      {/* ── COMPACT HEADER — only visible in results state */}
      {showResults && (
        <div
          style={{
            borderBottom: '1px solid #1a2a1a',
            padding: '10px 20px',
            background: '#0a0a0a',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <button
            onClick={handleReset}
            style={{
              background: 'none',
              border: 'none',
              color: '#00ff41',
              fontSize: '13px',
              fontWeight: 900,
              letterSpacing: '4px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              flexShrink: 0,
              textShadow: '0 0 10px rgba(0,255,65,0.25)',
              padding: 0,
            }}
          >
            OCRA
          </button>
          {/* spacer — input will be placed here via absolute positioning trick */}
          <div style={{ flex: 1, maxWidth: '480px' }} />
          <span style={{ color: '#222', fontSize: '10px', flexShrink: 0 }}>
            <span style={{ color: '#333' }}>{filteredTools.length}</span>/{tools.length} ·{' '}
            {TOTAL_COMMANDS} cmds
          </span>
        </div>
      )}

      {/* ── SINGLE INPUT — always mounted, repositioned via wrapper */}
      <div
        style={
          showResults
            ? {
                // results: pinned inside sticky header
                position: 'fixed',
                top: '8px',
                left: '50%',
                transform: 'translateX(-50%) translateX(30px)', // offset to not overlap logo
                width: '420px',
                maxWidth: 'calc(100vw - 240px)',
                zIndex: 200,
              }
            : {
                // hero: centered below title
                display: 'flex',
                justifyContent: 'center',
                padding: '0 20px 8px',
              }
        }
      >
        <div style={{ position: 'relative', width: '100%', maxWidth: showResults ? '100%' : '580px' }}>
          <span
            style={{
              position: 'absolute',
              left: showResults ? '10px' : '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#00ff41',
              fontSize: showResults ? '12px' : '16px',
              pointerEvents: 'none',
              opacity: 0.4,
            }}
          >
            $
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setActiveFilter('All')
              setSelectedToolId(null)
            }}
            placeholder={showResults ? 'search...' : 'fuzzing, nmap, smb, privesc, xss...'}
            autoFocus
            style={{
              width: '100%',
              background: '#0d0d0d',
              border: `1px solid ${showResults ? '#1a2a1a' : '#1a3a1a'}`,
              color: '#e0e0e0',
              padding: showResults ? '7px 12px 7px 24px' : '14px 16px 14px 36px',
              fontSize: showResults ? '12px' : '15px',
              fontFamily: 'inherit',
              borderRadius: '2px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'padding 0.15s ease, font-size 0.15s ease',
            }}
            onFocus={e => (e.target.style.borderColor = 'rgba(0,255,65,0.45)')}
            onBlur={e => (e.target.style.borderColor = showResults ? '#1a2a1a' : '#1a3a1a')}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>

      {/* ── HERO extras (hints + stats) — only in hero state */}
      {!showResults && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 20px 0',
            gap: '0',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {HINTS.map(hint => (
              <button
                key={hint}
                onClick={() => handleHint(hint)}
                style={{
                  background: 'rgba(0,255,65,0.04)',
                  border: '1px solid #1a2a1a',
                  color: '#3a4a3a',
                  padding: '4px 12px',
                  fontSize: '11px',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  borderRadius: '2px',
                  transition: 'all 0.1s ease',
                }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = '#00ff41'
                  ;(e.currentTarget as HTMLElement).style.color = '#00ff41'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = '#1a2a1a'
                  ;(e.currentTarget as HTMLElement).style.color = '#3a4a3a'
                }}
              >
                {hint}
              </button>
            ))}
          </div>
          <p style={{ color: '#1a2a1a', fontSize: '10px', marginTop: '28px', letterSpacing: '1px' }}>
            {TOTAL_COMMANDS} COMMANDS · {tools.length} TOOLS
          </p>
        </div>
      )}

      {/* ── RESULTS section */}
      {showResults && (
        <>
          {/* Filter tabs */}
          <div
            style={{
              display: 'flex',
              overflowX: 'auto',
              borderBottom: '1px solid #141414',
              padding: '0 20px',
              marginTop: '48px', // space for fixed input
            }}
          >
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => handleFilterTab(tab)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeFilter === tab ? '2px solid #00ff41' : '2px solid transparent',
                  color: activeFilter === tab ? '#00ff41' : '#383838',
                  padding: '9px 14px',
                  fontSize: '10px',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.5px',
                  transition: 'color 0.1s ease',
                }}
                onMouseEnter={e => {
                  if (activeFilter !== tab) (e.currentTarget as HTMLElement).style.color = '#666'
                }}
                onMouseLeave={e => {
                  if (activeFilter !== tab) (e.currentTarget as HTMLElement).style.color = '#383838'
                }}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <main style={{ padding: '16px 20px', maxWidth: '1400px', margin: '0 auto' }}>
            {filteredTools.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#2a2a2a', fontSize: '13px' }}>
                <div style={{ fontSize: '20px', marginBottom: '10px', color: '#1a1a1a' }}>[ ]</div>
                no tools found
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '6px',
                  }}
                >
                  {filteredTools.map(tool => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      isSelected={selectedToolId === tool.id}
                      onSelect={() => handleSelectTool(tool.id)}
                    />
                  ))}
                </div>

                {selectedTool && (
                  <ExpandedPanel
                    key={selectedTool.id}
                    tool={selectedTool}
                    query={query}
                    onClose={() => setSelectedToolId(null)}
                  />
                )}
              </>
            )}
          </main>

          <footer
            style={{
              borderTop: '1px solid #111',
              padding: '12px 20px',
              textAlign: 'center',
              color: '#1a1a1a',
              fontSize: '9px',
              letterSpacing: '1px',
              marginTop: '40px',
            }}
          >
            FOR AUTHORIZED TESTING ONLY
          </footer>
        </>
      )}
    </div>
  )
}
