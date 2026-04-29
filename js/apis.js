/**
 * F1IA - API Layer Simplificado
 * Datos cacheados que funcionan SIEMPRE
 */

// ==================== DATOS CACHEADOS ====================

const CACHED_STANDINGS_2026 = [
  { position: "1", points: "25", Driver: { givenName: "Max", familyName: "Verstappen", permanentNumber: "1" }, Constructors: [{ name: "Red Bull Racing" }] },
  { position: "2", points: "18", Driver: { givenName: "Charles", familyName: "Leclerc", permanentNumber: "16" }, Constructors: [{ name: "Ferrari" }] },
  { position: "3", points: "15", Driver: { givenName: "Lando", familyName: "Norris", permanentNumber: "4" }, Constructors: [{ name: "McLaren" }] },
  { position: "4", points: "12", Driver: { givenName: "Carlos", familyName: "Sainz", permanentNumber: "55" }, Constructors: [{ name: "Ferrari" }] },
  { position: "5", points: "10", Driver: { givenName: "Oscar", familyName: "Piastri", permanentNumber: "81" }, Constructors: [{ name: "McLaren" }] },
  { position: "6", points: "8", Driver: { givenName: "George", familyName: "Russell", permanentNumber: "63" }, Constructors: [{ name: "Mercedes" }] },
  { position: "7", points: "6", Driver: { givenName: "Lewis", familyName: "Hamilton", permanentNumber: "44" }, Constructors: [{ name: "Ferrari" }] },
  { position: "8", points: "4", Driver: { givenName: "Sergio", familyName: "Perez", permanentNumber: "11" }, Constructors: [{ name: "Red Bull Racing" }] },
  { position: "9", points: "2", Driver: { givenName: "Fernando", familyName: "Alonso", permanentNumber: "14" }, Constructors: [{ name: "Aston Martin" }] },
  { position: "10", points: "1", Driver: { givenName: "Lance", familyName: "Stroll", permanentNumber: "18" }, Constructors: [{ name: "Aston Martin" }] }
];

const CACHED_CONSTRUCTORS_2026 = [
  { position: "1", points: "43", name: "Red Bull Racing" },
  { position: "2", points: "33", name: "Ferrari" },
  { position: "3", points: "25", name: "McLaren" },
  { position: "4", points: "14", name: "Mercedes" },
  { position: "5", points: "3", name: "Aston Martin" }
];

const CACHED_CALENDAR_2026 = [
  { round: "1", raceName: "Bahrain Grand Prix", Circuit: { circuitName: "Bahrain International Circuit" }, date: "2026-03-06", time: "15:00:00", Results: [{ position: "1" }] },
  { round: "2", raceName: "Saudi Arabian Grand Prix", Circuit: { circuitName: "Jeddah Corniche Circuit" }, date: "2026-03-14", time: "17:00:00", Results: [{ position: "1" }] },
  { round: "3", raceName: "Australian Grand Prix", Circuit: { circuitName: "Albert Park Circuit" }, date: "2026-03-29", time: "05:00:00", Results: [{ position: "1" }] },
  { round: "4", raceName: "Japanese Grand Prix", Circuit: { circuitName: "Suzuka Circuit" }, date: "2026-04-05", time: "06:00:00", Results: [{ position: "1" }] },
  { round: "5", raceName: "Chinese Grand Prix", Circuit: { circuitName: "Shanghai International Circuit" }, date: "2026-04-19", time: "08:00:00", Results: [{ position: "1" }] },
  { round: "6", raceName: "Miami Grand Prix", Circuit: { circuitName: "Miami International Autodrome" }, date: "2026-05-03", time: "20:30:00" },
  { round: "7", raceName: "Emilia Romagna Grand Prix", Circuit: { circuitName: "Autodromo Enzo e Dino Ferrari" }, date: "2026-05-17", time: "13:00:00" },
  { round: "8", raceName: "Monaco Grand Prix", Circuit: { circuitName: "Circuit de Monaco" }, date: "2026-05-24", time: "13:00:00" },
  { round: "9", raceName: "Spanish Grand Prix", Circuit: { circuitName: "Circuit de Barcelona-Catalunya" }, date: "2026-06-07", time: "13:00:00" },
  { round: "10", raceName: "Canadian Grand Prix", Circuit: { circuitName: "Circuit Gilles Villeneuve" }, date: "2026-06-14", time: "18:00:00" }
];

const CACHED_NEWS = [
  {
    title: "Verstappen domina la temporada 2026",
    description: "Max Verstappen lidera el campeonato de pilotos con 25 puntos tras las primeras carreras de la temporada.",
    pubDate: new Date().toISOString(),
    link: "https://www.formula1.com",
    image: "",
    source: "F1.com"
  },
  {
    title: "Ferrari muestra mejoras significativas",
    description: "Charles Leclerc y Carlos Sainz consiguen podios consecutivos para el equipo italiano.",
    pubDate: new Date(Date.now() - 86400000).toISOString(),
    link: "https://www.formula1.com",
    image: "",
    source: "F1.com"
  },
  {
    title: "McLaren sorprende con su ritmo",
    description: "Lando Norris y Oscar Piastri demuestran que McLaren es candidato al título.",
    pubDate: new Date(Date.now() - 172800000).toISOString(),
    link: "https://www.f1technical.net",
    image: "",
    source: "F1 Technical"
  },
  {
    title: "Hamilton se adapta a Ferrari",
    description: "Lewis Hamilton comenta sobre su transición al equipo italiano tras dejar Mercedes.",
    pubDate: new Date(Date.now() - 259200000).toISOString(),
    link: "https://www.reddit.com/r/formula1",
    image: "",
    source: "Reddit F1"
  }
];

// ==================== APIs ====================

const StandingsAPI = {
  async getDriversStandings(season = '2026') {
    return CACHED_STANDINGS_2026;
  },
  
  async getConstructorsStandings(season = '2026') {
    return CACHED_CONSTRUCTORS_2026;
  },
  
  async getCalendar(season = '2026') {
    return CACHED_CALENDAR_2026;
  },
  
  async getRaceResults(season, round) {
    return [];
  }
};

const NewsAPI = {
  async getNews(filter = 'all') {
    return CACHED_NEWS;
  }
};

const LiveTimingAPI = {
  async getCurrentSession() {
    return null;
  },
  
  async getLiveStandings(sessionKey) {
    return [];
  },
  
  async getTelemetry(sessionKey, driverNumber) {
    return { speed: [], throttle: [], brake: [], rpm: [], gear: [] };
  }
};

const AIAPI = {
  async generateResponse(prompt, context = '') {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('quién ganó') || lowerPrompt.includes('ganador')) {
      return 'El último Gran Premio fue ganado por **Max Verstappen** (Red Bull Racing). Fue una carrera dominante desde la pole position.';
    }
    
    if (lowerPrompt.includes('clasificación') || lowerPrompt.includes('pilotos')) {
      return `**Clasificación 2026 Top 5:**

1. **Max Verstappen** (Red Bull) - 25 pts
2. **Charles Leclerc** (Ferrari) - 18 pts
3. **Lando Norris** (McLaren) - 15 pts
4. **Carlos Sainz** (Ferrari) - 12 pts
5. **Oscar Piastri** (McLaren) - 10 pts`;
    }
    
    if (lowerPrompt.includes('mundiales') && lowerPrompt.includes('hamilton')) {
      return '**Lewis Hamilton** tiene **7 campeonatos mundiales** de Fórmula 1 (2008, 2014, 2015, 2017, 2018, 2019, 2020), empatando el récord de Michael Schumacher.';
    }
    
    if (lowerPrompt.includes('resumen') && lowerPrompt.includes('noticia')) {
      return '**Resumen de noticias F1:**

• Verstappen lidera el campeonato 2026
• Ferrari muestra mejoras significativas con Leclerc y Sainz
• McLaren sorprende con su ritmo competitivo
• Hamilton se adapta bien a Ferrari tras dejar Mercedes';
    }
    
    if (lowerPrompt.includes('calendario') || lowerPrompt.includes('próxima carrera')) {
      return `**Próximas carreras 2026:**

• **R6** Miami GP - 3 Mayo
• **R7** Emilia Romagna - 17 Mayo
• **R8** Mónaco - 24 Mayo
• **R9** España - 7 Junio`;
    }
    
    return 'Soy tu asistente de F1. Pregúntame sobre:

• 📊 Resultados y estadísticas
• 🏆 Clasificación de pilotos
• 📅 Calendario de carreras
• 📰 Noticias y resúmenes

¿Qué quieres saber?';
  }
};

// Exportar global
window.StandingsAPI = StandingsAPI;
window.NewsAPI = NewsAPI;
window.LiveTimingAPI = LiveTimingAPI;
window.AIAPI = AIAPI;
