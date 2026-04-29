/**
 * F1IA - Aplicación Principal
 */

const F1App = {
  currentSection: 'news',
  refreshInterval: null,
  
  /**
   * Inicializar aplicación
   */
  init() {
    console.log('🏁 F1IA Inicializando...');
    
    this.bindNavigation();
    this.bindTabs();
    this.checkConnection();
    
    // Cargar sección inicial
    this.loadSection('news');
    
    // Actualizar cada 60 segundos
    setInterval(() => this.checkConnection(), 60000);
    
    console.log('✅ F1IA listo');
  },
  
  /**
   * Vincular navegación
   */
  bindNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        this.navigateTo(section);
      });
    });
  },
  
  /**
   * Vincular tabs
   */
  bindTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });
    
    // Filter tabs para noticias
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        this.filterNews(filter);
      });
    });
  },
  
  /**
   * Navegar a sección
   */
  navigateTo(section) {
    if (section === this.currentSection) return;
    
    // Actualizar botones de nav
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === section);
    });
    
    // Mostrar sección
    document.querySelectorAll('.section').forEach(sec => {
      sec.classList.toggle('active', sec.id === section);
    });
    
    this.currentSection = section;
    
    // Cargar datos de la sección
    this.loadSection(section);
  },
  
  /**
   * Cargar datos de sección
   */
  async loadSection(section) {
    console.log('📂 Cargando sección:', section);
    
    switch (section) {
      case 'news':
        await this.loadNews();
        break;
      case 'results':
        await this.loadResults();
        break;
      case 'live':
        await this.loadLiveTiming();
        break;
      case 'ai':
        AIChat.init();
        break;
    }
  },
  
  /**
   * Cambiar tab
   */
  switchTab(tab) {
    // Actualizar botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    // Mostrar panel
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === tab);
    });
    
    // Cargar datos si es necesario
    if (tab === 'standings-drivers') {
      this.loadDriversStandings();
    } else if (tab === 'standings-constructors') {
      this.loadConstructorsStandings();
    } else if (tab === 'calendar') {
      this.loadCalendar();
    } else if (tab === 'results') {
      this.loadRaceResults();
    }
  },
  
  // ==================== NOTICIAS ====================
  
  /**
   * Cargar noticias
   */
  async loadNews(filter = 'all') {
    const feed = document.getElementById('news-feed');
    if (!feed) return;
    
    feed.innerHTML = '<div class="loading-spinner">Cargando noticias...</div>';
    
    try {
      const news = await NewsAPI.getNews(filter);
      
      if (news.length === 0) {
        feed.innerHTML = '<div class="loading-spinner">No hay noticias disponibles</div>';
        return;
      }
      
      feed.innerHTML = news.map(item => this.renderNewsCard(item)).join('');
    } catch (error) {
      console.error('Error cargando noticias:', error);
      feed.innerHTML = `
        <div class="loading-spinner">
          Error cargando noticias.<br>
          <small>${error.message}</small>
        </div>
      `;
    }
  },
  
  /**
   * Filtrar noticias
   */
  filterNews(filter) {
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.filter === filter);
    });
    
    this.loadNews(filter);
  },
  
  /**
   * Renderizar card de noticia
   */
  renderNewsCard(item) {
    const date = new Date(item.pubDate).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const excerpt = item.description
      ?.replace(/<[^>]*>/g, '')
      ?.substring(0, 150) || 'Sin descripción';
    
    return `
      <article class="news-card" onclick="window.open('${item.link}', '_blank')">
        ${item.image ? `<img src="${item.image}" alt="" class="news-card-image" onerror="this.style.display='none'">` : ''}
        <div class="news-card-content">
          <div class="news-card-source">${item.source}</div>
          <h3 class="news-card-title">${item.title}</h3>
          <p class="news-card-excerpt">${excerpt}...</p>
          <div class="news-card-meta">
            <span>📅 ${date}</span>
          </div>
        </div>
      </article>
    `;
  },
  
  // ==================== RESULTADOS ====================
  
  /**
   * Cargar resultados (clasificación)
   */
  async loadResults() {
    this.loadDriversStandings();
  },
  
  /**
   * Cargar clasificación de pilotos
   */
  async loadDriversStandings() {
    const panel = document.getElementById('standings-drivers');
    if (!panel) return;
    
    const season = document.getElementById('season-select')?.value || '2026';
    
    panel.innerHTML = '<div class="loading-spinner">Cargando clasificación...</div>';
    
    try {
      const standings = await StandingsAPI.getDriversStandings(season);
      
      panel.innerHTML = `
        <table class="standings-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Piloto</th>
              <th>Equipo</th>
              <th style="text-align:right">Pts</th>
            </tr>
          </thead>
          <tbody>
            ${standings.map(d => this.renderDriverRow(d)).join('')}
          </tbody>
        </table>
      `;
    } catch (error) {
      panel.innerHTML = `<div class="loading-spinner">Error: ${error.message}</div>`;
    }
  },
  
  /**
   * Cargar clasificación de constructores
   */
  async loadConstructorsStandings() {
    const panel = document.getElementById('standings-constructors');
    if (!panel) return;
    
    const season = document.getElementById('season-select')?.value || '2026';
    
    panel.innerHTML = '<div class="loading-spinner">Cargando constructores...</div>';
    
    try {
      const standings = await StandingsAPI.getConstructorsStandings(season);
      
      panel.innerHTML = `
        <table class="standings-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Equipo</th>
              <th style="text-align:right">Pts</th>
            </tr>
          </thead>
          <tbody>
            ${standings.map(c => `
              <tr>
                <td class="position">${c.position}</td>
                <td class="team">${c.Constructor?.name || c.name}</td>
                <td class="points">${c.points}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } catch (error) {
      panel.innerHTML = `<div class="loading-spinner">Error: ${error.message}</div>`;
    }
  },
  
  /**
   * Renderizar fila de piloto
   */
  renderDriverRow(driver) {
    const firstName = driver.Driver?.givenName || driver.given_name || '';
    const lastName = driver.Driver?.familyName || driver.family_name || '';
    const team = driver.Constructors?.[0]?.name || driver.team || '';
    const number = driver.Driver?.permanentNumber || driver.number || '';
    
    return `
      <tr>
        <td class="position">${driver.position}</td>
        <td class="driver">
          <div class="driver-helmet"></div>
          <div>
            <div class="driver-name">${firstName} ${lastName}</div>
          </div>
        </td>
        <td class="team">${team}</td>
        <td class="points">${driver.points}</td>
      </tr>
    `;
  },
  
  /**
   * Cargar calendario
   */
  async loadCalendar() {
    const panel = document.getElementById('calendar');
    if (!panel) return;
    
    const season = document.getElementById('season-select')?.value || '2026';
    
    panel.innerHTML = '<div class="loading-spinner">Cargando calendario...</div>';
    
    try {
      const calendar = await StandingsAPI.getCalendar(season);
      const today = new Date();
      
      panel.innerHTML = `
        <div class="calendar-list">
          ${calendar.map((race, idx) => this.renderRaceCard(race, idx + 1, today)).join('')}
        </div>
      `;
    } catch (error) {
      panel.innerHTML = `<div class="loading-spinner">Error: ${error.message}</div>`;
    }
  },
  
  /**
   * Renderizar card de carrera
   */
  renderRaceCard(race, round, today) {
    const raceDate = new Date(race.date + 'T' + (race.time || '14:00:00'));
    const isNext = raceDate > today && !race.Results;
    const isCompleted = race.Results || raceDate < today;
    
    const day = raceDate.getDate();
    const month = raceDate.toLocaleDateString('es-ES', { month: 'short' });
    
    return `
      <div class="race-card ${isNext ? 'next' : ''} ${isCompleted ? 'completed' : ''}">
        <div class="race-round">${round}</div>
        <div class="race-info">
          <div class="race-name">${race.raceName}</div>
          <div class="race-circuit">${race.Circuit?.circuitName || ''}</div>
        </div>
        <div class="race-date">
          <span class="day">${day}</span>
          <span>${month}</span>
        </div>
      </div>
    `;
  },
  
  /**
   * Cargar resultados de carreras
   */
  async loadRaceResults() {
    const panel = document.getElementById('results');
    panel.innerHTML = '<div class="loading-spinner">Próximamente...</div>';
  },
  
  // ==================== LIVE TIMING ====================
  
  /**
   * Cargar live timing
   */
  async loadLiveTiming() {
    const standings = document.getElementById('live-standings');
    if (!standings) return;
    
    standings.innerHTML = '<div class="loading-spinner">Buscando sesión en vivo...</div>';
    
    try {
      const session = await LiveTimingAPI.getCurrentSession();
      
      if (!session) {
        document.getElementById('timing-session-title').textContent = 'Sin sesión en vivo';
        standings.innerHTML = `
          <div class="loading-spinner">
            No hay sesiones en vivo ahora.<br>
            <small>Los datos aparecen durante FP1, Qualy, Sprint y Carrera</small>
          </div>
        `;
        return;
      }
      
      document.getElementById('timing-session-title').textContent = session.name || 'Sesión en Vivo';
      
      const drivers = await LiveTimingAPI.getLiveStandings(session.session_key);
      
      standings.innerHTML = `
        <div class="live-standings-list">
          ${drivers.slice(0, 20).map(d => this.renderLiveDriverRow(d)).join('')}
        </div>
      `;
      
      // Actualizar cada 10 segundos
      if (this.refreshInterval) clearInterval(this.refreshInterval);
      this.refreshInterval = setInterval(() => this.refreshLiveTiming(session.session_key), 10000);
      
    } catch (error) {
      standings.innerHTML = `<div class="loading-spinner">Error: ${error.message}</div>`;
    }
  },
  
  /**
   * Renderizar fila de piloto en vivo
   */
  renderLiveDriverRow(driver) {
    return `
      <div class="live-driver-row">
        <div class="live-pos">${driver.position || '-'}</div>
        <div class="live-driver">
          <span class="live-number">${driver.number || ''}</span>
          <span class="live-code">${driver.driver_code || driver.abbreviation || '-'}</span>
          <span class="live-team">${driver.team_name || driver.team || ''}</span>
        </div>
        <div class="live-gap">${driver.gap_to_leader || driver.time || '-'}</div>
        <div class="live-interval">${driver.interval || ''}</div>
      </div>
    `;
  },
  
  /**
   * Refrescar live timing
   */
  async refreshLiveTiming(sessionKey) {
    try {
      const drivers = await LiveTimingAPI.getLiveStandings(sessionKey);
      const standings = document.getElementById('live-standings');
      
      if (standings) {
        standings.innerHTML = `
          <div class="live-standings-list">
            ${drivers.slice(0, 20).map(d => this.renderLiveDriverRow(d)).join('')}
          </div>
        `;
      }
    } catch (error) {
      console.warn('Error refrescando live timing:', error);
    }
  },
  
  // ==================== UTILIDADES ====================
  
  /**
   * Verificar conexión
   */
  checkConnection() {
    const status = document.getElementById('connection-status');
    if (!status) return;
    
    if (navigator.onLine) {
      status.textContent = '🟢 Online';
      status.style.color = 'var(--success)';
    } else {
      status.textContent = '🔴 Offline';
      status.style.color = 'var(--error)';
    }
  }
};

// Iniciar app cuando DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  F1App.init();
});

// Exportar global
window.F1App = F1App;
