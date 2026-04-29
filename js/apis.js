/**
 * F1IA - API Layer con Fallback Dual
 * Sistema de APIs dobles para máxima disponibilidad
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
 * Fetch con fallback automático
 * Intenta API primaria, si falla usa secundaria
 */
async function fetchWithFallback(endpoints, options = {}) {
  const { primary, secondary } = endpoints;
  
  try {
    console.log('🔵 API Primaria:', primary);
    const response = await fetch(primary, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn('⚠️ Primaria falló, usando secundaria:', error.message);
    
    if (!secondary) {
      throw new Error('No hay API secundaria disponible');
    }
    
    try {
      console.log('🟡 API Secundaria:', secondary);
      const response = await fetch(secondary, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (secondaryError) {
      console.error('❌ Ambas APIs fallaron:', secondaryError.message);
      throw new Error('Servicio no disponible - intenta más tarde');
    }
  }
}

/**
 * Fetch para múltiples fuentes (noticias RSS)
 * Intenta todas las fuentes y combina resultados
 */
async function fetchFromMultiple(sources, options = {}) {
  const results = [];
  
  for (const source of sources) {
    try {
      console.log('📰 Fetching:', source);
      const response = await fetch(source, options);
      
      if (response.ok) {
        const text = await response.text();
        results.push({ source, content: text });
      }
    } catch (error) {
      console.warn('⚠️ Fuente falló:', source, error.message);
    }
  }
  
  if (results.length === 0) {
    throw new Error('Ninguna fuente de noticias disponible');
  }
  
  return results;
}

// ==================== RESULTADOS Y CLASIFICACIÓN ====================

const StandingsAPI = {
  /**
   * Obtener clasificación de pilotos
   */
  async getDriversStandings(season = '2026') {
    const data = await fetchWithFallback(F1_APIS.standings);
    
    // Normalizar datos de ambas APIs
    if (data.MRData?.StandingsTable?.StandingsLists) {
      // Formato Jolpica/Ergast
      const seasonData = data.MRData.StandingsTable.StandingsLists.find(
        s => s.season === season
      );
      return seasonData?.DriverStandings || [];
    }
    
    if (data.standings) {
      // Formato F1 API Dev
      return data.standings.drivers || [];
    }
    
    throw new Error('Formato de datos no reconocido');
  },
  
  /**
   * Obtener clasificación de constructores
   */
  async getConstructorsStandings(season = '2026') {
    const data = await fetchWithFallback(F1_APIS.standings);
    
    if (data.MRData?.StandingsTable?.StandingsLists) {
      const seasonData = data.MRData.StandingsTable.StandingsLists.find(
        s => s.season === season
      );
      return seasonData?.ConstructorStandings || [];
    }
    
    if (data.standings) {
      return data.standings.constructors || [];
    }
    
    throw new Error('Formato de datos no reconocido');
  },
  
  /**
   * Obtener calendario de temporada
   */
  async getCalendar(season = '2026') {
    const data = await fetchWithFallback(F1_APIS.standings);
    
    if (data.MRData?.RaceTable?.Races) {
      return data.MRData.RaceTable.Races;
    }
    
    if (data.calendar) {
      return data.calendar;
    }
    
    throw new Error('Formato de datos no reconocido');
  },
  
  /**
   * Obtener resultados de carrera específica
   */
  async getRaceResults(season, round) {
    const url = `${F1_APIS.standings.primary}/${season}/${round}/results.json`;
    const secondary = `${F1_APIS.standings.secondary}/results/${season}/${round}`;
    
    const data = await fetchWithFallback({ primary: url, secondary });
    
    if (data.MRData?.RaceTable?.Races?.[0]?.Results) {
      return data.MRData.RaceTable.Races[0].Results;
    }
    
    if (data.results) {
      return data.results;
    }
    
    throw new Error('Formato de datos no reconocido');
  }
};

// ==================== LIVE TIMING ====================

const LiveTimingAPI = {
  /**
   * Obtener sesión en vivo actual
   */
  async getCurrentSession() {
    const data = await fetchWithFallback(F1_APIS.live);
    
    if (data.sessions) {
      return data.sessions.find(s => s.status === 'live') || null;
    }
    
    if (data.current_session) {
      return data.current_session;
    }
    
    return null;
  },
  
  /**
   * Obtener clasificación en vivo
   */
  async getLiveStandings(sessionKey) {
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
  },
  
  /**
   * Obtener telemetría de piloto
   */
  async getTelemetry(sessionKey, driverNumber) {
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
    
    const results = await fetchFromMultiple(sources);
    
    // Parsear RSS y combinar
    const newsItems = [];
    
    for (const result of results) {
      const items = this.parseRSS(result.content, result.source);
      newsItems.push(...items);
    }
    
    // Ordenar por fecha
    return newsItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  },
  
  /**
   * Parsear XML RSS a objetos
   */
  parseRSS(xml, source) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const items = [];
    
    // RSS standard
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
    const fullPrompt = `Eres un experto en Fórmula 1. Responde de forma clara y concisa en español.

Contexto: ${context}

Pregunta: ${prompt}

Respuesta:`;
    
    // Intentar Ollama local primero
    try {
      const response = await fetch(F1_APIS.ai.primary, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2',
          prompt: fullPrompt,
          stream: false
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.response || data.text || 'No pude generar una respuesta.';
      }
    } catch (error) {
      console.warn('⚠️ Ollama local no disponible, usando HuggingFace');
    }
    
    // Fallback a HuggingFace
    try {
      const response = await fetch(F1_APIS.ai.secondary, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer hf_xxx' // Opcional, sin key tiene límites
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data[0]?.generated_text || 'No pude generar una respuesta.';
      }
    } catch (error) {
      console.error('❌ Ambas APIs de IA fallaron');
    }
    
    return 'Lo siento, no puedo responder ahora. Intenta de nuevo más tarde.';
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
