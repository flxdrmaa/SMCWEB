import React, { useEffect, useRef, useState } from "react";

// Tabbed SMC Standings with Podium Highlight for Drivers & Teams

const standings = {
  gt1: {
    drivers: [
      { pos: 1, name: "A. Harsono", team: "Invincible Racing", pts: 174 },
      { pos: 2, name: "R. Santoso", team: "Blue Falcon", pts: 158 },
      { pos: 3, name: "D. Putra", team: "NightShift", pts: 136 },
      { pos: 4, name: "M. Kurnia", team: "Redline Crew", pts: 120 },
      { pos: 5, name: "S. Wijaya", team: "NeoSpeed", pts: 112 },
      { pos: 6, name: "T. Hadi", team: "Volt Racing", pts: 98 },
      { pos: 7, name: "I. Prasetyo", team: "Aurora Motors", pts: 84 },
      { pos: 8, name: "B. Nugroho", team: "Tidal GT", pts: 76 },
      { pos: 9, name: "C. Rahman", team: "Street Pulse", pts: 64 },
      { pos: 10, name: "F. Alam", team: "Midnight Ops", pts: 52 }
    ],
    teams: [
      { pos: 1, team: "Invincible Racing", pts: 332 },
      { pos: 2, team: "Blue Falcon", pts: 298 },
      { pos: 3, team: "NightShift", pts: 260 },
      { pos: 4, team: "Redline Crew", pts: 212 },
      { pos: 5, team: "NeoSpeed", pts: 198 }
    ]
  },
  gt3: {
    drivers: [
      { pos: 1, name: "L. Gunawan", team: "Tidal GT", pts: 202 },
      { pos: 2, name: "Y. Pratama", team: "Aurora Motors", pts: 167 },
      { pos: 3, name: "C. Hadi", team: "Midnight Ops", pts: 149 },
      { pos: 4, name: "F. Nugraha", team: "Volt Racing", pts: 98 },
      { pos: 5, name: "N. Rizky", team: "Street Pulse", pts: 86 },
      { pos: 6, name: "S. Ardi", team: "NeoSpeed", pts: 74 },
      { pos: 7, name: "P. Utama", team: "Invincible Racing", pts: 68 },
      { pos: 8, name: "R. Wijaya", team: "Blue Falcon", pts: 62 },
      { pos: 9, name: "M. Firdaus", team: "Redline Crew", pts: 55 },
      { pos: 10, name: "D. Saputra", team: "Tidal GT", pts: 44 }
    ],
    teams: [
      { pos: 1, team: "Tidal GT", pts: 246 },
      { pos: 2, team: "Aurora Motors", pts: 217 },
      { pos: 3, team: "Midnight Ops", pts: 198 },
      { pos: 4, team: "Volt Racing", pts: 154 },
      { pos: 5, team: "Street Pulse", pts: 142 }
    ]
  }
};

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function AnimatedNumber({ value, duration = 1200 }) {
  const ref = useRef(value);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const start = ref.current || 0;
    const end = Number(value) || 0;
    if (start === end) { setDisplay(end); return; }
    let raf = null;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const current = Math.round(start + (end - start) * easeOutCubic(t));
      setDisplay(current);
      if (t < 1) raf = requestAnimationFrame(tick);
      else ref.current = end;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <span>{display}</span>;
}

function Podium({ items, type }) {
  return (
    <div className="flex items-end justify-center gap-6 my-8 flex-wrap">
      <div className="flex flex-col items-center order-1 sm:order-none">
        <div className="bg-gray-500 w-24 h-32 flex flex-col items-center justify-center font-bold rounded-t-xl shadow-xl">
          <span className="text-2xl">🥈</span>
          <span className="text-sm"><AnimatedNumber value={items[1].pts} /></span>
        </div>
        <div className="mt-2 text-gray-200 text-sm text-center font-semibold">{type === "drivers" ? items[1].name : items[1].team}</div>
      </div>
      <div className="flex flex-col items-center order-0 sm:order-none">
        <div className="bg-yellow-400 w-28 h-40 flex flex-col items-center justify-center font-extrabold rounded-t-xl shadow-2xl">
          <span className="text-3xl">🥇</span>
          <span className="text-base"><AnimatedNumber value={items[0].pts} /></span>
        </div>
        <div className="mt-2 text-white font-bold text-center text-lg">{type === "drivers" ? items[0].name : items[0].team}</div>
      </div>
      <div className="flex flex-col items-center order-2 sm:order-none">
        <div className="bg-orange-500 w-20 h-28 flex flex-col items-center justify-center font-bold rounded-t-xl shadow-xl">
          <span className="text-2xl">🥉</span>
          <span className="text-sm"><AnimatedNumber value={items[2].pts} /></span>
        </div>
        <div className="mt-2 text-orange-300 text-sm text-center font-semibold">{type === "drivers" ? items[2].name : items[2].team}</div>
      </div>
    </div>
  );
}

function Table({ data, type }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 uppercase text-xs">
          <th className="text-left p-2">Pos</th>
          <th className="text-left p-2">{type === "drivers" ? "Driver" : "Team"}</th>
          <th className="text-right p-2">Pts</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d, i) => {
          const delay = `${i * 60}ms`;
          const highlight = d.pos === 1 ? "text-yellow-400" : d.pos === 2 ? "text-gray-300" : d.pos === 3 ? "text-orange-400" : "text-cyan-400";
          return (
            <tr
              key={`${type}-${d.pos}`}
              className="border-t border-gray-700 hover:bg-gray-800/60"
              style={{ animation: `fadeInUp 0.5s ease both`, animationDelay: delay }}
            >
              <td className={`p-2 font-extrabold drop-shadow ${highlight}`}>{d.pos}</td>
              <td className="p-2">
                {type === "drivers" ? (
                  <>
                    <div className="font-bold text-white tracking-wide">{d.name}</div>
                    <div className="text-xs text-gray-400 italic">{d.team}</div>
                  </>
                ) : (
                  <span className="font-bold text-white tracking-wide">{d.team}</span>
                )}
              </td>
              <td className={`p-2 font-extrabold text-right drop-shadow ${highlight}`}>
                <AnimatedNumber value={d.pts} duration={900} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function SeriesCard({ title, badge, drivers, teams, accent }) {
  const [activeTab, setActiveTab] = useState("drivers");
  return (
    <div className="relative bg-gradient-to-br from-[#0f1116] via-[#141820] to-[#0f1116] p-6 rounded-2xl border border-gray-700 shadow-2xl backdrop-blur-lg overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 animate-glowline" style={{ background: `linear-gradient(90deg, ${accent[0]} 0%, ${accent[1]} 100%)` }} />
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-2xl font-extrabold tracking-widest uppercase text-gray-100 drop-shadow-lg">{title}</h2>
        <span className="px-4 py-1 rounded-full font-extrabold text-black text-sm shadow-lg animate-badgepulse" style={{ background: `linear-gradient(90deg, ${accent[0]}, ${accent[1]})` }}>{badge}</span>
      </div>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab("drivers")} className={`px-3 py-1 rounded-lg font-bold text-sm ${activeTab === "drivers" ? "bg-cyan-500 text-black" : "bg-gray-700 text-gray-300"}`}>Drivers</button>
        <button onClick={() => setActiveTab("teams")} className={`px-3 py-1 rounded-lg font-bold text-sm ${activeTab === "teams" ? "bg-cyan-500 text-black" : "bg-gray-700 text-gray-300"}`}>Teams</button>
      </div>

      {activeTab === "drivers" && (
        <>
          <Podium items={drivers.slice(0, 3)} type="drivers" />
          <h3 className="font-bold mb-2 text-xs text-gray-400 uppercase tracking-wide border-b border-gray-700 pb-1">Driver Standings</h3>
          <Table data={drivers.slice(3)} type="drivers" />
        </>
      )}
      {activeTab === "teams" && (
        <>
          <Podium items={teams.slice(0, 3)} type="teams" />
          <h3 className="font-bold mb-2 text-xs text-gray-400 uppercase tracking-wide border-b border-gray-700 pb-1">Team Standings</h3>
          <Table data={teams.slice(3)} type="teams" />
        </>
      )}
    </div>
  );
}

export default function App() {
  useEffect(() => { document.title = "SMC Standings — GT1 & GT3"; }, []);

  return (
    <div className="bg-[#05060a] min-h-screen text-white p-8 font-sans relative overflow-hidden">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glowline { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
        @keyframes badgepulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        .animate-glowline { animation: glowline 4s infinite; }
        .animate-badgepulse { animation: badgepulse 3s infinite; }
        .drop-shadow { text-shadow: 0 2px 6px rgba(0,0,0,0.6); }
      `}</style>

      <header className="flex flex-col sm:flex-row justify-between items-center mb-12 border-b border-gray-800 pb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center font-extrabold text-xl shadow-2xl animate-badgepulse">SMC</div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-wide drop-shadow">SMC — Official Standings</h1>
            <p className="text-gray-400 text-sm mt-1 italic">Driver & Team Standings • Season 2025</p>
          </div>
        </div>
        <div className="mt-6 sm:mt-0 text-right">
          <div className="font-bold uppercase tracking-wide text-xs text-gray-400">Updated</div>
          <div className="text-sm text-gray-200">Sep 19, 2025</div>
        </div>
      </header>

      <main className="grid md:grid-cols-2 gap-10 relative z-10">
        <SeriesCard title="GT1 Championship" badge="GT1" drivers={standings.gt1.drivers} teams={standings.gt1.teams} accent={["#ff4d6e","#ff9db9"]} />
        <SeriesCard title="GT3 Championship" badge="GT3" drivers={standings.gt3.drivers} teams={standings.gt3.teams} accent={["#2ec5ff","#9fe9ff"]} />
      </main>

      <footer className="text-center text-gray-500 text-xs mt-16 border-t border-gray-800 pt-4 relative z-10">
        © 2025 SMC Race Department • Official classification according to SMC regulations
      </footer>
    </div>
  );
}
