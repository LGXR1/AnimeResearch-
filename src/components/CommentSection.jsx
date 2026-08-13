import { useState, useEffect } from 'react'
import { getComments, addComment } from '../lib/api'

const timeAgo = (t) => {
  const diff = Date.now() - new Date(t).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return '刚刚'
  if (m < 60) return m + ' 分钟前'
  const h = Math.floor(m / 60)
  if (h < 24) return h + ' 小时前'
  const d = Math.floor(h / 24)
  if (d < 30) return d + ' 天前'
  return new Date(t).toLocaleDateString('zh-CN')
}

export default function CommentSection({ characterId }) {
  const [list, setList] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const load = async () => {
    try {
      const data = await getComments(characterId)
      setList(data)
    } catch {
      setList([])
    }
  }

  useEffect(() => { load() }, [characterId])

  const submit = async () => {
    // 蜜罐：bot 会自动填这个隐藏字段，人类看不到；填了就直接丢弃
    if (honeypot) return
    const content = text.trim()
    if (!content) return
    if (content.length > 500) { setMsg('评论最多 500 字'); return }
    setSending(true)
    try {
      await addComment(characterId, content)
      setText('')
      setMsg('')
      load()
    } catch {
      setMsg('发送失败，请稍后再试')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3">评论</h2>

      <div className="flex gap-2 mb-4">
        {/* 蜜罐字段：人类不可见，bot 会自动填写 */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] w-px h-px opacity-0"
        />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="说点什么…（匿名）"
          className="flex-1 px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#ff6b8a] transition-colors"
        />
        <button
          onClick={submit}
          disabled={sending || !text.trim()}
          className="px-5 py-2 bg-[#ff6b8a] text-white text-sm rounded-lg hover:bg-[#ff5a7a] transition-colors disabled:opacity-50"
        >
          {sending ? '发送中' : '发送'}
        </button>
      </div>

      {msg && <p className="text-xs mb-3 text-red-400">{msg}</p>}

      <div className="space-y-3">
        {list.map((c) => (
          <div key={c.id} className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3">
            <p className="text-sm text-gray-300 whitespace-pre-wrap break-words">{c.content}</p>
            <p className="text-xs text-gray-600 mt-1.5">{timeAgo(c.created_at)}</p>
          </div>
        ))}
        {list.length === 0 && <p className="text-gray-600 text-sm">暂无评论，来抢沙发～</p>}
      </div>
    </section>
  )
}
