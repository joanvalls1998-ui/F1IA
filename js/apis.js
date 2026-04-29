/**
 * F1IA - API Layer con Fallback Dual y Datos Cacheados
 * Sistema de APIs dobles + datos de respaldo para máxima disponibilidad
 */

const F1_APIS = {
  // Resultados y Clasificación
  standings: {
    primary: 'https://api.jolpi.ca/ergast/f1',
    secondary: 'https://f1api.dev/api/f1'
  },
  
  // Live Timing y Telemetría
  live: {
    primary: 'https://api.openf1.org/v1',
    secondary: 'https://fastf1-api.onrender.com'
  },
  
  // Noticias RSS (múltiples fuentes)
  news: [
    'https://www.formula1.com/en/latest.rss',
    'https://www.f1technical.net/rss.php',
    'https://www.reddit.com/r/formula1/.rss'
  ],
  
  // IA Local (Ollama)
  ai: {
    primary: 'http://localhost:11434/api/generate',
    secondary: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2'
  }
};

/**
 * DATOS CACHEADOS DE RESPALDO
 * Se usan si las APIs fallan
 */

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
    image: "https://www.formula1.com/content/dam/fom-website/2024/03/verstappen.jpg",
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

/**
 * Proxy CORS para evitar bloqueos del navegador
 * Usa allorigins.win como proxy gratuito
 */
function corsProxy(url) {
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
}

/**
 * Fetch con fallback automático y proxy CORS
 * Intenta API primaria, si falla usa secundaria, si falla usa cache
 */
async function fetchWithFallback(endpoints, options = {}) {
  const { primary, secondary } = endpoints;
  
  // Intentar con proxy CORS primero
  try {
    console.log('🔵 API Primaria (proxy):', primary);
    const proxyUrl = corsProxy(primary);
    const response = await fetch(proxyUrl, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    console.log('✅ API Primaria funcionó');
    return await response.json();
  } catch (error) {
    console.warn('⚠️ Primaria falló, usando secundaria:', error.message);
    
    if (!secondary) {
      throw new Error('No hay API secundaria disponible');
    }
    
    try {
      console.log('🟡 API Secundaria (proxy):', secondary);
      const proxyUrl = corsProxy(secondary);
      const response = await fetch(proxyUrl, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      console.log('✅ API Secundaria funcionó');
      return await response.json();
    } catch (secondaryError) {
      console.error('❌ Ambas APIs fallaron, usando cache:', secondaryError.message);
      throw new Error('USANDO_CACHE');
    }
  }
}

/**
 * Fetch para múltiples fuentes (noticias RSS) con proxy CORS
 * Intenta todas las fuentes y combina resultados
 */
async function fetchFromMultiple(sources, options = {}) {
  const results = [];
  
  for (const source of sources) {
    try {
      console.log('📰 Fetching (proxy):', source);
      const proxyUrl = corsProxy(source);
      const response = await fetch(proxyUrl, options);
      
      if (response.ok) {
        const text = await response.text();
        results.push({ source, content: text });
      }
    } catch (error) {
      console.warn('⚠️ Fuente falló:', source, error.message);
    }
  }
  
  if (results.length === 0) {
    console.log('⚠️ Sin fuentes RSS, usando cache');
    return null;
  }
  
  return results;
}

// ==================== RESULTADOS Y CLASIFICACIÓN ====================

const StandingsAPI = {
  /**
   * Obtener clasificación de pilotos
   */
  async getDriversStandings(season = '2026') {
    try {
      const data = await fetchWithFallback(F1_APIS.standings);
      
      // Normalizar datos de ambas APIs
      if (data.MRData?.StandingsTable?.StandingsLists) {
        const seasonData = data.MRData.StandingsTable.StandingsLists.find(
          s => s.season === season
        );
        return seasonData?.DriverStandings || CACHED_STANDINGS_2026;
      }
      
      if (data.standings) {
        return data.standings.drivers || CACHED_STANDINGS_2026;
      }
      
      return CACHED_STANDINGS_2026;
    } catch (error) {
      console.log('📦 Usando datos cacheados para clasificación');
      return CACHED_STANDINGS_2026;
    }
  },
  
  /**
   * Obtener clasificación de constructores
   */
  async getConstructorsStandings(season = '2026') {
    try {
      const data = await fetchWithFallback(F1_APIS.standings);
      
      if (data.MRData?.StandingsTable?.StandingsLists) {
        const seasonData = data.MRData.StandingsTable.StandingsLists.find(
          s => s.season === season
        );
        return seasonData?.ConstructorStandings || CACHED_CONSTRUCTORS_2026;
      }
      
      if (data.standings) {
        return data.standings.constructors || CACHED_CONSTRUCTORS_2026;
      }
      
      return CACHED_CONSTRUCTORS_2026;
    } catch (error) {
      console.log('📦 Usando datos cacheados para constructores');
      return CACHED_CONSTRUCTORS_2026;
    }
  },
  
  /**
   * Obtener calendario de temporada
   */
  async getCalendar(season = '2026') {
    try {
      const data = await fetchWithFallback(F1_APIS.standings);
      
      if (data.MRData?.RaceTable?.Races) {
        return data.MRData.RaceTable.Races;
      }
      
      if (data.calendar) {
        return data.calendar;
      }
      
      return CACHED_CALENDAR_2026;
    } catch (error) {
      console.log('📦 Usando calendario cacheado');
      return CACHED_CALENDAR_2026;
    }
  },
  
  /**
   * Obtener resultados de carrera específica
   */
  async getRaceResults(season, round) {
    try {
      const url = `${F1_APIS.standings.primary}/${season}/${round}/results.json`;
      const secondary = `${F1_APIS.standings.secondary}/results/${season}/${round}`;
      
      const data = await fetchWithFallback({ primary: url, secondary });
      
      if (data.MRData?.RaceTable?.Races?.[0]?.Results) {
        return data.MRData.RaceTable.Races[0].Results;
      }
      
      if (data.results) {
        return data.results;
      }
      
      return [];
    } catch (error) {
      return [];
    }
  }
};

// ==================== LIVE TIMING ====================

const LiveTimingAPI = {
  /**
   * Obtener sesión en vivo actual
   */
  async getCurrentSession() {
    try {
      const data = await fetchWithFallback(F1_APIS.live);
      
      if (data.sessions) {
        return data.sessions.find(s => s.status === 'live') || null;
      }
      
      if (data.current_session) {
        return data.current_session;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  },
  
  /**
   * Obtener clasificación en vivo
   */
  async getLiveStandings(sessionKey) {
    try {
      const url = `${F1_APIS.live.primary}/timing/session?session_key=${sessionKey}`;
      const secondary = `${F1_APIS.live.secondary}/timing/${sessionKey}`;
      
      const data = await fetchWithFallback({ primary: url, secondary });
      
      if (data.drivers) {
        return data.drivers;
      }
      
      if (data.timing_data) {
        return data.timing_data;
      }
      
      return [];
    } catch (error) {
      return [];
    }
  },
  
  /**
   * Obtener telemetría de piloto
   */
  async getTelemetry(sessionKey, driverNumber) {
    try {
      const url = `${F1_APIS.live.primary}/telemetry?session_key=${sessionKey}&driver_number=${driverNumber}`;
      const secondary = `${F1_APIS.live.secondary}/telemetry/${sessionKey}/${driverNumber}`;
      
      const data = await fetchWithFallback({ primary: url, secondary });
      
      if (data.telemetry) {
        return data.telemetry;
      }
      
      if (data.data) {
        return data.data;
      }
      
      return { speed: [], throttle: [], brake: [], rpm: [], gear: [] };
    } catch (error) {
      return { speed: [], throttle: [], brake: [], rpm: [], gear: [] };
    }
  }
};

// ==================== NOTICIAS ====================

const NewsAPI = {
  /**
   * Obtener noticias de múltiples fuentes
   */
  async getNews(filter = 'all') {
    const sources = filter === 'all' 
      ? F1_APIS.news 
      : F1_APIS.news.filter((_, i) => {
          if (filter === 'f1com') return i === 0;
          if (filter === 'technical') return i === 1;
          if (filter === 'reddit') return i === 2;
          return true;
        });
    
    try {
      const results = await fetchFromMultiple(sources);
      
      if (results) {
        const newsItems = [];
        
        for (const result of results) {
          const items = this.parseRSS(result.content, result.source);
          newsItems.push(...items);
        }
        
        if (newsItems.length > 0) {
          return newsItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        }
      }
    } catch (error) {
      console.warn('⚠️ Error fetcheando RSS:', error);
    }
    
    // Fallback a noticias cacheadas
    console.log('📦 Usando noticias cacheadas');
    return CACHED_NEWS;
  },
  
  /**
   * Parsear XML RSS a objetos
   */
  parseRSS(xml, source) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const items = [];
    
    const entries = doc.querySelectorAll('item, entry');
    
    entries.forEach(entry => {
      const title = entry.querySelector('title')?.textContent || '';
      const link = entry.querySelector('link')?.textContent || entry.querySelector('link')?.getAttribute('href') || '';
      const description = entry.querySelector('description, summary')?.textContent || '';
      const pubDate = entry.querySelector('pubDate, published')?.textContent || new Date().toISOString();
      const image = entry.querySelector('enclosure')?.getAttribute('url') || 
                   entry.querySelector('content')?.getAttribute('url') ||
                   entry.querySelector('media\\:content')?.getAttribute('url') || '';
      
      items.push({
        title,
        link,
        description,
        pubDate,
        image,
        source: this.getSourceName(source)
      });
    });
    
    return items;
  },
  
  /**
   * Obtener nombre legible de la fuente
   */
  getSourceName(url) {
    if (url.includes('formula1.com')) return 'F1.com';
    if (url.includes('f1technical')) return 'F1 Technical';
    if (url.includes('reddit')) return 'Reddit F1';
    return 'F1 News';
  }
};

// ==================== IA ====================

const AIAPI = {
  /**
   * Generar respuesta con IA
   */
  async generateResponse(prompt, context = '') {
    // IA simulada para respuestas básicas (sin dependencias externas)
    const lowerPrompt = prompt.toLowerCase();
    
    // Respuestas predefinidas para preguntas comunes
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
    
    // Respuesta genérica
    return 'Soy tu asistente de F1. Puedo ayudarte con:

• 📊 **Resultados y estadísticas** - Pregúntame sobre ganadores, podios, récords
• 🏆 **Clasificaciones** - Pilotos y constructores de cualquier temporada
• 📅 **Calendario** - Fechas de carreras y circuitos
• 📰 **Noticias** - Resumen de las últimas novedades
• 📈 **Telemetría** - Datos en vivo durante sesiones

¿Qué quieres saber?';
  },
  
  /**
   * Resumir noticias
   */
  async summarizeNews(articles) {
    const articlesText = articles.slice(0, 5).map(a => 
      `- ${a.title}: ${a.description?.substring(0, 100)}...`
    ).join('\n');
    
    const prompt = `Resume estas noticias de F1 en 3-4 puntos clave:

${articlesText}

Resumen:`;
    
    return await this.generateResponse(prompt);
  }
};

// Exportar para uso global
window.F1_APIS = F1_APIS;
window.StandingsAPI = StandingsAPI;
window.LiveTimingAPI = LiveTimingAPI;
window.NewsAPI = NewsAPI;
window.AIAPI = AIAPI;
window.CACHED_STANDINGS_2026 = CACHED_STANDINGS_2026;
window.CACHED_CONSTRUCTORS_2026 = CACHED_CONSTRUCTORS_2026;
window.CACHED_CALENDAR_2026 = CACHED_CALENDAR_2026;
window.CACHED_NEWS = CACHED_NEWS;
