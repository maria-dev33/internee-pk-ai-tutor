'use client';

import { useState, useEffect } from 'react';
import { LEARNING_MODULES } from './modules';

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'background:#dcfce7;color:#166534',
  intermediate: 'background:#dbeafe;color:#1e40af',
  advanced: 'background:#f3e8ff;color:#6b21a8',
};

export default function HomePage() {
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const map: Record<string, number> = {};
    LEARNING_MODULES.forEach((mod) => {
      const data = localStorage.getItem(`progress_${mod.id}`);
      if (data) {
        const p = JSON.parse(data);
        map[mod.id] = Math.min(100, Math.round((p.completedSteps.length / 6) * 100));
      }
    });
    setProgressMap(map);
  }, []);

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'sans-serif'}}>
      <div style={{background:'#4f46e5',padding:'24px 32px',color:'white'}}>
        <h1 style={{margin:0,fontSize:'24px',fontWeight:'bold'}}>🎓 Internee.pk AI Tutor</h1>
        <p style={{margin:'4px 0 0',opacity:0.8,fontSize:'14px'}}>Your personalized AI learning assistant</p>
      </div>

      <div style={{maxWidth:'900px',margin:'32px auto',padding:'0 16px'}}>
        <div style={{background:'linear-gradient(135deg,#4f46e5,#7c3aed)',borderRadius:'16px',padding:'32px',color:'white',marginBottom:'32px'}}>
          <h2 style={{margin:'0 0 8px',fontSize:'28px'}}>Welcome back! 👋</h2>
          <p style={{margin:0,opacity:0.9}}>Pick a module below and start learning with your AI tutor.</p>
          <div style={{display:'flex',gap:'32px',marginTop:'20px'}}>
            <div><div style={{fontSize:'28px',fontWeight:'bold'}}>{LEARNING_MODULES.length}</div><div style={{opacity:0.8,fontSize:'13px'}}>Modules</div></div>
            <div><div style={{fontSize:'28px',fontWeight:'bold'}}>{Object.values(progressMap).filter(p=>p>0).length}</div><div style={{opacity:0.8,fontSize:'13px'}}>Started</div></div>
            <div><div style={{fontSize:'28px',fontWeight:'bold'}}>{Object.values(progressMap).filter(p=>p===100).length}</div><div style={{opacity:0.8,fontSize:'13px'}}>Completed</div></div>
          </div>
        </div>

        <h3 style={{fontSize:'18px',fontWeight:'600',color:'#1e293b',marginBottom:'16px'}}>📚 Learning Modules</h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'16px'}}>
          {LEARNING_MODULES.map((mod) => {
            const progress = progressMap[mod.id] || 0;
            const [bg, clr] = DIFFICULTY_COLORS[mod.difficulty].split(';').map(s=>s.split(':')[1]);
            return (
              <a key={mod.id} href={`/tutor/${mod.id}`} style={{textDecoration:'none'}}>
                <div style={{background:'white',borderRadius:'12px',border:'1px solid #e2e8f0',padding:'20px',cursor:'pointer',transition:'box-shadow 0.2s'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'}}>
                    <h4 style={{margin:0,fontSize:'15px',color:'#1e293b',fontWeight:'600'}}>{mod.title}</h4>
                    <span style={{fontSize:'11px',padding:'2px 8px',borderRadius:'99px',background:bg,color:clr,whiteSpace:'nowrap',marginLeft:'8px'}}>{mod.difficulty}</span>
                  </div>
                  <p style={{margin:'0 0 12px',fontSize:'13px',color:'#64748b'}}>{mod.description}</p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'4px',marginBottom:'12px'}}>
                    {mod.topics.slice(0,3).map(t=>(
                      <span key={t} style={{fontSize:'11px',background:'#f1f5f9',color:'#475569',padding:'2px 8px',borderRadius:'99px'}}>{t}</span>
                    ))}
                  </div>
                  <div style={{fontSize:'12px',color:'#94a3b8',marginBottom:'4px',display:'flex',justifyContent:'space-between'}}>
                    <span>⏱ {mod.estimatedTime} min</span>
                    <span>{progress}% done</span>
                  </div>
                  <div style={{height:'6px',background:'#f1f5f9',borderRadius:'99px',overflow:'hidden'}}>
                    <div style={{height:'100%',background:'#4f46e5',width:`${progress}%`,borderRadius:'99px'}}/>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
