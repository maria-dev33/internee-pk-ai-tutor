'use client';

import { useState, useEffect, use } from 'react';
import { LEARNING_MODULES } from '../../modules';

export default function TutorPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = use(params);
  const mod = LEARNING_MODULES.find(m => m.id === moduleId);
  const [messages, setMessages] = useState<{role:string,content:string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  useEffect(() => {
    if (!mod) return;
    const saved = localStorage.getItem(`progress_${mod.id}`);
    if (saved) {
      const p = JSON.parse(saved);
      setCompletedTopics(p.completedSteps || []);
    }
    setMessages([{
      role: 'assistant',
      content: `👋 Hello! I am your AI tutor for **${mod?.title}**. I will help you learn step by step. What would you like to learn first?`
    }]);
  }, []);

  function saveProgress(topics: string[]) {
    if (!mod) return;
    localStorage.setItem(`progress_${mod.id}`, JSON.stringify({
      completedSteps: topics,
      lastActive: Date.now()
    }));
  }

  function markDone(topic: string) {
    const updated = [...new Set([...completedTopics, topic])];
    setCompletedTopics(updated);
    saveProgress(updated);
  }

  async function sendMessage() {
    if (!input.trim() || loading || !mod) return;
    const userMsg = { role: 'user', content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated,
          moduleTitle: mod.title,
          weakAreas: []
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  if (!mod) return <div style={{padding:'32px'}}>Module not found.</div>;

  const progress = Math.round((completedTopics.length / mod.topics.length) * 100);

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'sans-serif'}}>
      <div style={{background:'#4f46e5',padding:'16px 24px',color:'white',display:'flex',alignItems:'center',gap:'16px'}}>
        <a href="/" style={{color:'white',textDecoration:'none',fontSize:'20px'}}>←</a>
        <div style={{flex:1}}>
          <h1 style={{margin:0,fontSize:'18px',fontWeight:'bold'}}>{mod.title}</h1>
          <div style={{fontSize:'13px',opacity:0.8}}>{progress}% complete</div>
        </div>
      </div>

      <div style={{maxWidth:'900px',margin:'24px auto',padding:'0 16px',display:'grid',gridTemplateColumns:'280px 1fr',gap:'20px'}}>
        
        <div>
          <div style={{background:'white',borderRadius:'12px',border:'1px solid #e2e8f0',padding:'16px'}}>
            <h3 style={{margin:'0 0 12px',fontSize:'15px',color:'#1e293b'}}>📋 Topics</h3>
            <div style={{height:'6px',background:'#f1f5f9',borderRadius:'99px',marginBottom:'16px'}}>
              <div style={{height:'100%',background:'#4f46e5',width:`${progress}%`,borderRadius:'99px'}}/>
            </div>
            {mod.topics.map(topic => {
              const done = completedTopics.includes(topic);
              return (
                <div key={topic} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #f1f5f9'}}>
                  <span style={{fontSize:'13px',color: done ? '#16a34a' : '#475569'}}>
                    {done ? '✅' : '⬜'} {topic}
                  </span>
                  {!done && (
                    <button onClick={() => markDone(topic)} style={{fontSize:'11px',background:'#ede9fe',color:'#6d28d9',border:'none',padding:'2px 8px',borderRadius:'99px',cursor:'pointer'}}>
                      Done
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{background:'white',borderRadius:'12px',border:'1px solid #e2e8f0',padding:'16px',marginTop:'16px'}}>
            <h3 style={{margin:'0 0 8px',fontSize:'15px',color:'#1e293b'}}>💡 Quick Questions</h3>
            {['Explain this simply', 'Give me an example', 'I am confused', 'Practice exercise'].map(q => (
              <button key={q} onClick={() => setInput(q)} style={{display:'block',width:'100%',textAlign:'left',padding:'8px 10px',margin:'4px 0',background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'8px',fontSize:'12px',color:'#475569',cursor:'pointer'}}>
                {q}
              </button>
            ))}
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',height:'75vh'}}>
          <div style={{flex:1,overflowY:'auto',background:'white',borderRadius:'12px',border:'1px solid #e2e8f0',padding:'16px',marginBottom:'12px'}}>
            {messages.map((msg, i) => (
              <div key={i} style={{display:'flex',justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',marginBottom:'12px'}}>
                {msg.role === 'assistant' && (
                  <div style={{width:'32px',height:'32px',background:'#4f46e5',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'12px',fontWeight:'bold',marginRight:'8px',flexShrink:0}}>
                    AI
                  </div>
                )}
                <div style={{maxWidth:'75%',padding:'10px 14px',borderRadius:'12px',fontSize:'14px',lineHeight:'1.6',background: msg.role === 'user' ? '#4f46e5' : '#f1f5f9',color: msg.role === 'user' ? 'white' : '#1e293b'}}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{display:'flex',alignItems:'center',gap:'8px',color:'#94a3b8',fontSize:'13px'}}>
                <div style={{width:'32px',height:'32px',background:'#4f46e5',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'12px',fontWeight:'bold'}}>AI</div>
                Thinking...
              </div>
            )}
          </div>

          <div style={{display:'flex',gap:'8px'}}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask anything about this topic..."
              style={{flex:1,padding:'12px 16px',borderRadius:'10px',border:'1px solid #e2e8f0',fontSize:'14px',outline:'none',color:'#1e293b'}}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{background:'#4f46e5',color:'white',border:'none',padding:'12px 20px',borderRadius:'10px',fontSize:'14px',cursor:'pointer',opacity: (!input.trim() || loading) ? 0.5 : 1}}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}