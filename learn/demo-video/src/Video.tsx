import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/PressStart2P';

const {fontFamily: PIXEL} = loadFont();
const MONO = 'Consolas, "Courier New", monospace';
const C = {sky: '#5c94fc', night: '#0b1033', card: '#fff8e1', ink: '#1b1b2f', brick: '#c84c0c', green: '#3aa63a', gold: '#ffcd3c', white: '#fff'};
const S = (sec: number) => Math.round(sec * 30);

// scene lengths in seconds
const L = {title: 5, learn: 10, lab: 12, tutor: 12, device: 10, cta: 6};
export const TOTAL = S(L.title + L.learn + L.lab + L.tutor + L.device + L.cta); // 55 s

/* ---------- helpers ---------- */
const useIn = (delay = 0) => {
  const f = useCurrentFrame(), {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping: 14, stiffness: 120}});
};
const Fade: React.FC<{children: React.ReactNode; dur: number}> = ({children, dur}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 12, dur - 12, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};
const Bg: React.FC<{dark?: boolean}> = ({dark}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: dark ? `linear-gradient(#0b1033,#2b2f70)` : `linear-gradient(${C.sky},#b8dcff)`}}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{position: 'absolute', top: 120 + i * 260, left: ((f * (1 + i * 0.6) + i * 700) % 2600) - 400, width: 260, height: 70, background: dark ? '#6b6fa8' : '#fff', opacity: 0.8, borderRadius: 40, boxShadow: '4px 4px 0 rgba(0,0,0,.15)'}} />
      ))}
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: `repeating-linear-gradient(90deg,${C.brick} 0 118px,#000 118px 122px)`, borderTop: '8px solid #000'}} />
      <div style={{position: 'absolute', bottom: 120, left: 0, right: 0, height: 30, background: C.green, borderTop: '6px solid #000'}} />
    </AbsoluteFill>
  );
};
const Pixel: React.FC<{size: number; color?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({size, color = C.white, children, style}) => (
  <div style={{fontFamily: PIXEL, fontSize: size, color, textShadow: '6px 6px 0 #000', lineHeight: 1.5, ...style}}>{children}</div>
);
const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{background: C.card, border: '8px solid #000', borderRadius: 16, boxShadow: '12px 12px 0 rgba(0,0,0,.35)', padding: 36, color: C.ink, ...style}}>{children}</div>
);
const Caption: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', bottom: 190, width: '100%', textAlign: 'center'}}>
    <Pixel size={30} color={C.gold}>{children}</Pixel>
  </div>
);

/* ---------- scenes ---------- */
const Title = () => {
  const a = useIn(0), b = useIn(20), c = useIn(40);
  return (
    <AbsoluteFill>
      <Bg />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 40}}>
        <div style={{fontSize: 200, transform: `scale(${a})`}}>🛡️</div>
        <Pixel size={86} style={{transform: `scale(${b})`}}>CYBERSENTINEL</Pixel>
        <Pixel size={30} color={C.gold} style={{opacity: c, transform: `translateY(${(1 - c) * 30}px)`}}>LEARN CYBERSECURITY THE FUN WAY</Pixel>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const MODS = [['🔑', 'PASSWORDS', 'Make strong ones'], ['🎣', 'PHISHING', 'Spot fake messages'], ['🌐', 'NETWORKS', 'Know what is open'], ['💉', 'SQL INJECTION', 'Stop data theft'], ['🦠', 'MALWARE', 'Stay infected-free'], ['🔐', 'ENCRYPTION', 'Lock your data']];
const ModCard: React.FC<{m: string[]; i: number}> = ({m: [e, t, d], i}) => {
  const f = useCurrentFrame();
  const s = useIn(10 + i * 10);
  const xp = Math.min(100, Math.max(0, (f - 120 - i * 14) * 2.2));
  return (
    <Card style={{transform: `translateY(${(1 - s) * 80}px) scale(${0.7 + 0.3 * s})`, opacity: s}}>
      <div style={{fontSize: 70}}>{e}</div>
      <div style={{fontFamily: PIXEL, fontSize: 22, margin: '14px 0 8px'}}>{t}</div>
      <div style={{fontFamily: 'system-ui', fontSize: 26, opacity: 0.75}}>{d}</div>
      <div style={{marginTop: 18, height: 22, border: '4px solid #000', background: '#fff'}}><div style={{width: `${xp}%`, height: '100%', background: C.green}} /></div>
    </Card>
  );
};
const Learn = () => (
  <AbsoluteFill>
    <Bg />
    <div style={{position: 'absolute', top: 70, width: '100%', textAlign: 'center'}}><Pixel size={46}>LESSONS · QUIZZES · FLASHCARDS</Pixel></div>
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingTop: 60}}>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 440px)', gap: 36}}>
        {MODS.map((m, i) => <ModCard key={m[1]} m={m} i={i} />)}
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

const CMD = 'nmap -sV 127.0.0.1';
const OUT = ['Starting Nmap scan on 127.0.0.1...', 'PORT     STATE  SERVICE  VERSION', '22/tcp   open   ssh      OpenSSH 8.9', '80/tcp   open   http     nginx 1.18', '', '⚠ Old version found. Look it up for known bugs.'];
const Lab = () => {
  const f = useCurrentFrame();
  const typed = CMD.slice(0, Math.max(0, Math.floor((f - 40) / 3)));
  const lines = Math.max(0, Math.floor((f - 40 - CMD.length * 3 - 20) / 20));
  return (
    <AbsoluteFill>
      <Bg dark />
      <div style={{position: 'absolute', top: 70, width: '100%', textAlign: 'center'}}><Pixel size={46}>HANDS-ON TERMINAL LAB</Pixel></div>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingTop: 40}}>
        <div style={{width: 1400, background: '#07090f', border: '8px solid #000', borderRadius: 16, boxShadow: '14px 14px 0 rgba(0,0,0,.45)', padding: 40, fontFamily: MONO, fontSize: 38, color: '#7CFC7C', minHeight: 560}}>
          <div>analyst@sentinel:~$ {typed}<span style={{opacity: Math.floor(f / 15) % 2}}>█</span></div>
          {OUT.slice(0, lines).map((l, i) => <div key={i} style={{color: l.startsWith('⚠') ? C.gold : '#cfe9cf', whiteSpace: 'pre', marginTop: 8}}>{l}</div>)}
        </div>
      </AbsoluteFill>
      <Caption>Safe practice on localhost and lab machines only</Caption>
    </AbsoluteFill>
  );
};

const Tutor = () => {
  const f = useCurrentFrame();
  const q = useIn(15), a = useIn(80);
  const ans = 'Phishing = a fake message that tricks you into giving your password. Check the sender, never click strange links, turn on 2FA.';
  const shown = ans.slice(0, Math.max(0, Math.floor((f - 100) * 1.6)));
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{position: 'absolute', top: 70, width: '100%', textAlign: 'center'}}><Pixel size={46}>YOUR OWN LOCAL AI TUTOR</Pixel></div>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
        <div style={{width: 1300, display: 'flex', flexDirection: 'column', gap: 30}}>
          <Card style={{alignSelf: 'flex-end', background: '#d8ecff', opacity: q, transform: `translateX(${(1 - q) * 100}px)`}}>
            <div style={{fontFamily: 'system-ui', fontSize: 36}}>Ano ang phishing? 🎣</div>
          </Card>
          <Card style={{opacity: a, transform: `translateX(${(a - 1) * 100}px)`, minHeight: 230}}>
            <div style={{fontFamily: PIXEL, fontSize: 16, color: C.brick, marginBottom: 16}}>LOCAL AI · llama3.2 · 100% OFFLINE</div>
            <div style={{fontFamily: 'system-ui', fontSize: 36, lineHeight: 1.4}}>{shown}</div>
          </Card>
        </div>
      </AbsoluteFill>
      <Caption>Runs on your computer. Your questions never leave it.</Caption>
    </AbsoluteFill>
  );
};

const Device: React.FC<{w: number; h: number; r: number; x: number; y: number; label: string; delay: number}> = ({w, h, r, x, y, label, delay}) => {
  const s = useIn(delay);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, border: '10px solid #000', background: `linear-gradient(${C.sky},#b8dcff)`, boxShadow: '12px 12px 0 rgba(0,0,0,.4)', transform: `scale(${s})`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16}}>
      <div style={{fontSize: w / 5}}>🛡️</div>
      <Pixel size={Math.max(14, w / 14)}>{label}</Pixel>
    </div>
  );
};
const DeviceScene = () => {
  const u = useIn(70);
  return (
    <AbsoluteFill>
      <Bg dark />
      <div style={{position: 'absolute', top: 70, width: '100%', textAlign: 'center'}}><Pixel size={46}>ANY DEVICE. INSTALL AS AN APP.</Pixel></div>
      <Device w={780} h={470} r={18} x={160} y={260} label="LAPTOP" delay={10} />
      <Device w={380} h={560} r={26} x={1000} y={230} label="TABLET" delay={25} />
      <Device w={230} h={470} r={34} x={1470} y={290} label="PHONE" delay={40} />
      <div style={{position: 'absolute', bottom: 180, width: '100%', textAlign: 'center', opacity: u}}>
        <Pixel size={26} color={C.gold}>node server.js  →  open the Network address</Pixel>
      </div>
    </AbsoluteFill>
  );
};

const Cta = () => {
  const a = useIn(0), b = useIn(25), c = useIn(50);
  return (
    <AbsoluteFill>
      <Bg />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 44}}>
        <Pixel size={70} style={{transform: `scale(${a})`}}>START LEARNING!</Pixel>
        <Pixel size={30} color={C.gold} style={{opacity: b}}>FREE · OPEN SOURCE · WORKS OFFLINE</Pixel>
        <Card style={{opacity: c, transform: `scale(${0.8 + 0.2 * c})`, padding: '24px 48px'}}>
          <div style={{fontFamily: MONO, fontSize: 40}}>github.com/<b>YOUR-NAME</b>/cybersentinel</div>
        </Card>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- timeline ---------- */
export const Demo: React.FC = () => {
  const scenes: [React.FC, number][] = [[Title, L.title], [Learn, L.learn], [Lab, L.lab], [Tutor, L.tutor], [DeviceScene, L.device], [Cta, L.cta]];
  let at = 0;
  return (
    <AbsoluteFill style={{background: C.night}}>
      {scenes.map(([Sc, sec], i) => {
        const from = at, dur = S(sec);
        at += dur;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <Fade dur={dur}><Sc /></Fade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
