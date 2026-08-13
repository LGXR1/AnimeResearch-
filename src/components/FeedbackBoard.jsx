import { useState, useEffect } from 'react'
import { supabase } from '../lib/api'

export default function FeedbackBoard({ compact = false }) {
  const [list, setList] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState('')

  const load = async () => {
    const { data } = await supabase.from('feedback').select('*').order('created_at', { ascending: false }).limit(50)
    setList(data || [])
  }

  useEffect(() => { load() }, [])

  const submit = async () => {
    const content = text.trim()
    if (!content || content.length < 3) { setMsg('最少3个字'); return }
    setSending(true)
    const { error } = await supabase.from('feedback').insert({ content })
    setSending(false)
    if (error) { setMsg('发送失败'); return }
    setText('')
    setMsg('感谢反馈！')
    load()
    setTimeout(() => setMsg(''), 3000)
  }

  const timeAgo = (t) => {
    const diff = Date.now() - new Date(t).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return '刚刚'
    if (m < 60) return m + '分钟前'
    const h = Math.floor(m / 60)
    if (h < 24) return h + '小时前'
    return Math.floor(h / 24) + '天前'
  }

  const inputClasses = compact
    ? 'w-full px-3 py-1.5 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#ff6b8a] transition-colors'
    : 'flex-1 px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#ff6b8a] transition-colors'

  return (
    <div className={compact ? '' : 'max-w-2xl mx-auto mt-16 px-4'}>
      <h2 className={compact ? 'text-sm font-semibold mb-2 text-gray-300' : 'text-xl font-semibold mb-4 text-gray-300'}>💬 反馈</h2>
      {!compact && <p className="text-sm text-gray-500 mb-4">缺少的动漫/人物、错误的信息、网站建议——都可以写，所有人可见。</p>}

      <div className={compact ? 'flex flex-col gap-1.5 mb-3' : 'flex gap-2 mb-6'}>
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="建议或纠错…" className={inputClasses} />
        <button onClick={submit} disabled={sending}
          className={compact
            ? 'w-full px-3 py-1.5 bg-[#ff6b8a] text-white text-xs rounded-lg hover:bg-[#ff5a7a] transition-colors disabled:opacity-50'
            : 'px-5 py-2 bg-[#ff6b8a] text-white text-sm rounded-lg hover:bg-[#ff5a7a] transition-colors disabled:opacity-50'}>
          {sending ? '发送中' : '发送'}
        </button>
      </div>
      {msg && <p className={`text-xs mb-2 ${msg.includes('感谢') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}

      <div className={compact ? 'space-y-2 max-h-[60vh] overflow-y-auto' : 'space-y-3 max-h-80 overflow-y-auto'}>
        {list.map(f => (
          <div key={f.id} className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-2">
            <p className={compact ? 'text-xs text-gray-300 whitespace-pre-wrap' : 'text-sm text-gray-300 whitespace-pre-wrap'}>{f.content}</p>
            <p className="text-xs text-gray-600 mt-1">{timeAgo(f.created_at)}</p>
          </div>
        ))}
        {list.length === 0 && <p className="text-gray-600 text-xs">暂无反馈</p>}
      </div>
    </div>
  )
}
