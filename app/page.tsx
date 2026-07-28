'use client';

import { useState, useEffect } from 'react';
import { LEARNING_MODULES } from './modules';

export default function HomePage() {
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const map: Record<string, number> = {};
    LEARNING_MODULES.forEach((mod) => {
      const data = localStorage.getItem(`progress_${mod.id}`);
      if (data) {
        const p = JSON.parse(data);
        map[mod.id] = Math.min(100, Math.round((p.completedSteps.length / 5) * 100));
      }
    });
    setProgressMap(map);
  }, []);

  return (
    <div style={{minHeight:'100vh',background:'#0a0f1e',fontFamily:'sans-serif',color:'white'}}>
      {/* Navbar */}
      <nav style={{borderBottom:'1px solid #1e2a45',padding:'16px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(10,15,30,0.95)',position:'sticky',top:0,zIndex:100,backdropFilter:'blur(10px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'32px',height:'32px',background:'linear-gradient(135deg,#06b6d4,#8b5cf6)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold',fontSize:'16px'}}>I</div>
          <span style={{fontWeight:'700',fontSize:'18px',color:'white'}}>internee.pk</span>
        </div>
        <div style={{display:'flex',gap:'32px',fontSize:'14px',color:'#94a3b8'}}>
  <a href="/" style={{color:'#06b6d4',cursor:'pointer',textDecoration:'none'}}>Home</a>
  <a href="#modules" style={{cursor:'pointer',textDecoration:'none',color:'#94a3b8'}}>Modules</a>
</div>
        <a href="#modules" style={{background:'linear-gradient(135deg,#06b6d4,#8b5cf6)',padding:'14px 32px',borderRadius:'10px',fontWeight:'700',fontSize:'15px',cursor:'pointer',textDecoration:'none',color:'white'}}>
  Start Learning →
</a>
      </nav>

      {/* Hero */}
      <div style={{textAlign:'center',padding:'80px 24px 60px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'600px',height:'600px',background:'radial-gradient(circle,rgba(6,182,212,0.08) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{display:'inline-block',background:'rgba(6,182,212,0.1)',border:'1px solid rgba(6,182,212,0.3)',borderRadius:'99px',padding:'6px 16px',fontSize:'13px',color:'#06b6d4',marginBottom:'24px'}}>
          🎓 Pakistan's No.1 AI Learning Platform
        </div>
        <h1 style={{fontSize:'56px',fontWeight:'800',margin:'0 0 16px',lineHeight:1.1}}>
          Build Skills.<br/>
          <span style={{background:'linear-gradient(135deg,#06b6d4,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Get Experience.</span>
        </h1>
        <p style={{color:'#94a3b8',fontSize:'18px',maxWidth:'500px',margin:'0 auto 40px',lineHeight:1.6}}>
          Your personal AI tutor guides you through tech modules step by step — at your own pace.
        </p>
        <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
          <div style={{background:'linear-gradient(135deg,#06b6d4,#8b5cf6)',padding:'14px 32px',borderRadius:'10px',fontWeight:'700',fontSize:'15px',cursor:'pointer'}}>
            Start Learning →
          </div>
          <a href="#modules" style={{border:'1px solid #1e2a45',padding:'14px 32px',borderRadius:'10px',fontWeight:'600',fontSize:'15px',cursor:'pointer',color:'#94a3b8',textDecoration:'none',display:'inline-block'}}>
  Explore Modules
</a>
        </div>

        {/* Stats */}
        <div style={{display:'flex',justifyContent:'center',gap:'48px',marginTop:'60px'}}>
          {[
            {num: LEARNING_MODULES.length, label: 'Modules'},
            {num: Object.values(progressMap).filter(p=>p>0).length, label: 'Started'},
            {num: Object.values(progressMap).filter(p=>p===100).length, label: 'Completed'},
          ].map(stat => (
            <div key={stat.label} style={{textAlign:'center'}}>
              <div style={{fontSize:'36px',fontWeight:'800',background:'linear-gradient(135deg,#06b6d4,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{stat.num}</div>
              <div style={{color:'#64748b',fontSize:'13px',marginTop:'4px'}}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modules */}
      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'0 24px 80px'}}>
        <h2 id="modules" style={{fontSize:'28px',fontWeight:'700',marginBottom:'8px'}}>📚 Learning Modules</h2>
        <p style={{color:'#64748b',marginBottom:'32px',fontSize:'15px'}}>Choose a module and start learning with your AI tutor</p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:'20px'}}>
          {LEARNING_MODULES.map((mod) => {
            const progress = progressMap[mod.id] || 0;
            const diffColor = mod.difficulty === 'beginner' ? '#10b981' : mod.difficulty === 'intermediate' ? '#06b6d4' : '#8b5cf6';
            return (
              <a key={mod.id} href={`/tutor/${mod.id}`} style={{textDecoration:'none',color:'white'}}>
                <div style={{background:'#0d1526',border:'1px solid #1e2a45',borderRadius:'16px',padding:'24px',cursor:'pointer',transition:'all 0.2s',position:'relative',overflow:'hidden'}}
                  onMouseEnter={e => (e.currentTarget.style.border='1px solid #06b6d4')}
                  onMouseLeave={e => (e.currentTarget.style.border='1px solid #1e2a45')}
                >
                  <div style={{position:'absolute',top:0,right:0,width:'100px',height:'100px',background:`radial-gradient(circle,${diffColor}15 0%,transparent 70%)`,pointerEvents:'none'}}/>
                  
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
                    <h3 style={{margin:0,fontSize:'17px',fontWeight:'700'}}>{mod.title}</h3>
                    <span style={{fontSize:'11px',padding:'3px 10px',borderRadius:'99px',background:`${diffColor}20`,color:diffColor,border:`1px solid ${diffColor}40`,whiteSpace:'nowrap',marginLeft:'8px'}}>
                      {mod.difficulty}
                    </span>
                  </div>

                  <p style={{margin:'0 0 16px',fontSize:'13px',color:'#64748b',lineHeight:1.6}}>{mod.description}</p>

                  <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'16px'}}>
                    {mod.topics.slice(0,3).map(t => (
                      <span key={t} style={{fontSize:'11px',background:'#1e2a45',color:'#94a3b8',padding:'3px 10px',borderRadius:'99px'}}>{t}</span>
                    ))}
                    {mod.topics.length > 3 && <span style={{fontSize:'11px',color:'#475569'}}>+{mod.topics.length - 3}</span>}
                  </div>

                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'12px',color:'#475569',marginBottom:'8px'}}>
                    <span>⏱ {mod.estimatedTime} min</span>
                    <span style={{color: progress > 0 ? '#06b6d4' : '#475569'}}>{progress}% done</span>
                  </div>
                  <div style={{height:'4px',background:'#1e2a45',borderRadius:'99px',overflow:'hidden'}}>
                    <div style={{height:'100%',background:'linear-gradient(90deg,#06b6d4,#8b5cf6)',width:`${progress}%`,borderRadius:'99px',transition:'width 0.5s'}}/>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{borderTop:'1px solid #1e2a45',padding:'24px',textAlign:'center',color:'#475569',fontSize:'13px'}}>
        © 2026 Internee.pk AI Tutor. All rights reserved.
      </div>
    </div>
  );
}