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
      content: `👋 Hello! I am your AI tutor for ${mod?.title}. I will help you learn step by step. What would you like to learn first?`
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

  if (!mod) return <div style={{padding:'32px',background:'#0a0f1e',minHeight:'100vh',color:'white'}}>Module not found.</div>;

  const progress = Math.round((completedTopics.length / mod.topics.length) * 100);

  return (
    <div style={{minHeight:'100vh',background:'#0a0f1e',fontFamily:'sans-serif',color:'white'}}>
      
      {/* Header */}
      <nav style={{borderBottom:'1px solid #1e2a45',padding:'14px 24px',display:'flex',alignItems:'center',gap:'16px',background:'rgba(10,15,30,0.95)',position:'sticky',top:0,zIndex:100,backdropFilter:'blur(10px)'}}>
        <a href="/" style={{color:'#64748b',textDecoration:'none',fontSize:'20px',lineHeight:1}}>←</a>
        <div style={{width:'1px',height:'24px',background:'#1e2a45'}}/>
        <div style={{flex:1}}>
          <h1 style={{margin:0,fontSize:'16px',fontWeight:'700',color:'white'}}>{mod.title}</h1>
          <div style={{fontSize:'12px',color:'#64748b',marginTop:'2px'}}>{progress}% complete</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <div style={{height:'6px',width:'120px',background:'#1e2a45',borderRadius:'99px',overflow:'hidden'}}>
            <div style={{height:'100%',background:'linear-gradient(90deg,#06b6d4,#8b5cf6)',width:`${progress}%`,borderRadius:'99px',transition:'width 0.5s'}}/>
          </div>
          <span style={{fontSize:'12px',color:'#06b6d4',fontWeight:'600'}}>{progress}%</span>
        </div>
      </nav>

      <div style={{maxWidth:'1100px',margin:'24px auto',padding:'0 20px',display:'grid',gridTemplateColumns:'260px 1fr',gap:'20px'}}>

        {/* Sidebar */}
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          
          {/* Topics */}
          <div style={{background:'#0d1526',border:'1px solid #1e2a45',borderRadius:'16px',padding:'20px'}}>
            <h3 style={{margin:'0 0 16px',fontSize:'14px',fontWeight:'700',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em'}}>📋 Topics</h3>
            {mod.topics.map(topic => {
              const done = completedTopics.includes(topic);
              return (
                <div key={topic} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #1e2a45'}}>
                  <span style={{fontSize:'13px',color: done ? '#10b981' : '#94a3b8',display:'flex',alignItems:'center',gap:'8px'}}>
                    <span style={{fontSize:'16px'}}>{done ? '✅' : '⬜'}</span>
                    {topic}
                  </span>
                  {!done && (
                    <button onClick={() => markDone(topic)} style={{fontSize:'11px',background:'rgba(6,182,212,0.1)',color:'#06b6d4',border:'1px solid rgba(6,182,212,0.3)',padding:'3px 10px',borderRadius:'99px',cursor:'pointer'}}>
                      Done
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Questions */}
          <div style={{background:'#0d1526',border:'1px solid #1e2a45',borderRadius:'16px',padding:'20px'}}>
            <h3 style={{margin:'0 0 12px',fontSize:'14px',fontWeight:'700',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em'}}>💡 Quick Ask</h3>
            {['Explain simply', 'Give an example', 'I am confused', 'Practice exercise', 'Quiz me'].map(q => (
              <button key={q} onClick={() => setInput(q)} style={{display:'block',width:'100%',textAlign:'left',padding:'9px 12px',margin:'6px 0',background:'#0a0f1e',border:'1px solid #1e2a45',borderRadius:'8px',fontSize:'13px',color:'#64748b',cursor:'pointer',transition:'all 0.2s'}}
                onMouseEnter={e => {e.currentTarget.style.borderColor='#06b6d4'; e.currentTarget.style.color='#06b6d4';}}
                onMouseLeave={e => {e.currentTarget.style.borderColor='#1e2a45'; e.currentTarget.style.color='#64748b';}}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div style={{display:'flex',flexDirection:'column',height:'82vh'}}>
          
          {/* Messages */}
          <div style={{flex:1,overflowY:'auto',background:'#0d1526',border:'1px solid #1e2a45',borderRadius:'16px',padding:'20px',marginBottom:'12px',display:'flex',flexDirection:'column',gap:'16px'}}>
            {messages.map((msg, i) => (
              <div key={i} style={{display:'flex',justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',gap:'10px',alignItems:'flex-start'}}>
                {msg.role === 'assistant' && (
                  <div style={{width:'34px',height:'34px',background:'linear-gradient(135deg,#06b6d4,#8b5cf6)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:'800',flexShrink:0}}>
                    AI
                  </div>
                )}
                <div style={{maxWidth:'75%',padding:'12px 16px',borderRadius:'14px',fontSize:'14px',lineHeight:'1.7',
                  background: msg.role === 'user' ? 'linear-gradient(135deg,#06b6d4,#8b5cf6)' : '#1e2a45',
                  color: 'white',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '14px',
                  borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '14px',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <div style={{width:'34px',height:'34px',background:'linear-gradient(135deg,#06b6d4,#8b5cf6)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:'800'}}>
                  AI
                </div>
                <div style={{background:'#1e2a45',padding:'12px 16px',borderRadius:'14px',borderBottomLeftRadius:'4px'}}>
                  <div style={{display:'flex',gap:'4px',alignItems:'center'}}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{width:'6px',height:'6px',background:'#06b6d4',borderRadius:'50%',animation:'bounce 1s infinite',animationDelay:`${i*0.2}s`}}/>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{display:'flex',gap:'10px',background:'#0d1526',border:'1px solid #1e2a45',borderRadius:'14px',padding:'10px'}}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask anything about this topic..."
              style={{flex:1,padding:'10px 12px',background:'transparent',border:'none',fontSize:'14px',outline:'none',color:'white'}}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{background:'linear-gradient(135deg,#06b6d4,#8b5cf6)',color:'white',border:'none',padding:'10px 22px',borderRadius:'10px',fontSize:'14px',fontWeight:'600',cursor:'pointer',opacity:(!input.trim()||loading)?0.5:1,transition:'opacity 0.2s'}}
            >
              Send →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}