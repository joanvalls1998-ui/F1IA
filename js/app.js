/**
 * F1IA - Aplicación Principal
 */

const F1App = {
  currentSection: 'news',
  
  init() {
    console.log('🏁 F1IA Iniciando...');
    
    this.bindNavigation();
    this.bindTabs();
    this.loadSection('news');
    
    console.log('✅ F1IA listo');
  },
  
  bindNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.navigateTo(btn.dataset.section);
      });
    });
  },
  
  bindTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.dataset.tab);
      });
    });
    
    document.querySelectorAll('.filter-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        this.loadNews(btn.dataset.filter);
      });
    });
  },
  
  navigateTo(section) {
    if (section === this.currentSection) return;
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === section);
    });
    
    document.querySelectorAll('.section').forEach(sec => {
      sec.classList.toggle('active', sec.id === section);
    });
    
    this.currentSection = section;
    this.loadSection(section);
  },
  
  switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === tab);
    });
  },
  
  async loadSection(section) {
    switch (section) {
      case 'news':
        this.loadNews();
        break;
      case 'results':
        this.loadDriversStandings();
        break;
      case 'live':
        this.loadLiveTiming();
        break;
      case 'ai':
        AIChat.init();
        break;
    }
  },
  
  // ==================== NOTICIAS ====================
  
  async loadNews(filter = 'all') {
    const feed = document.getElementById('news-feed');
    if (!feed) return;
    
    feed.innerHTML = '<div class="loading-spinner">Cargando noticias...</div>';
    
    try {
      const news = await NewsAPI.getNews(filter);
      
      if (!news || news.length === 0) {
        feed.innerHTML = '<div class="loading-spinner">No hay noticias disponibles</div>';
        return;
      }
      
      feed.innerHTML = news.map(item => this.renderNewsCard(item)).join('');
    } catch (error) {
      console.error('Error noticias:', error);
      feed.innerHTML = '<div class="loading-spinner">Error cargando noticias</div>';
    }
  },
  
  renderNewsCard(item) {
    const date = new Date(item.pubDate).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const excerpt = (item.description || 'Sin descripción').substring(0, 150);
    
    return `
      <article class="news-card" onclick="window.open('${item.link}', '_blank')">
        <div class="news-card-content">
          <div class="news-card-source">${item.source || 'F1 News'}</div>
          <h3 class="news-card-title">${item.title || 'Sin título'}</h3>
          <p class="news-card-excerpt">${excerpt}...</p>
          <div class="news-card-meta">
            <span>📅 ${date}</span>
          </div>
        </div>
      </article>
    `;
  },
  
  // ==================== RESULTADOS ====================
  
  async loadDriversStandings() {
    const panel = document.getElementById('standings-drivers');
    if (!panel) return;
    
    panel.innerHTML = '<div class="loading-spinner">Cargando clasificación...</div>';
    
    try {
      const standings = await StandingsAPI.getDriversStandings('2026');
      
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
      panel.innerHTML = '<div class="loading-spinner">Error cargando datos</div>';
    }
  },
  
  renderDriverRow(driver) {
    const firstName = driver.Driver?.givenName || '';
    const lastName = driver.Driver?.familyName || '';
    const team = driver.Constructors?.[0]?.name || '';
    const number = driver.Driver?.permanentNumber || '';
    
    return `
      <tr>
        <td class="position">${driver.position}</td>
        <td class="driver">
          <div class="driver-helmet" style="background: hsl(${driver.position * 36}, 70%, 50%)"></div>
          <div>
            <div class="driver-name">${firstName} ${lastName}</div>
          </div>
        </td>
        <td class="team">${team}</td>
        <td class="points">${driver.points}</td>
      </tr>
    `;
  },
  
  async loadConstructorsStandings() {
    const panel = document.getElementById('standings-constructors');
    if (!panel) return;
    
    try {
      const standings = await StandingsAPI.getConstructorsStandings('2026');
      
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
                <td class="team">${c.name}</td>
                <td class="points">${c.points}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } catch (error) {
      panel.innerHTML = '<div class="loading-spinner">Error</div>';
    }
  },
  
  async loadCalendar() {
    const panel = document.getElementById('calendar');
    if (!panel) return;
    
    try {
      const calendar = await StandingsAPI.getCalendar('2026');
      const today = new Date();
      
      panel.innerHTML = `
        <div class="calendar-list">
          ${calendar.map((race, idx) => this.renderRaceCard(race, idx + 1, today)).join('')}
        </div>
      `;
    } catch (error) {
      panel.innerHTML = '<div class="loading-spinner">Error</div>';
    }
  },
  
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
  
  async loadRaceResults() {
    const panel = document.getElementById('results');
    panel.innerHTML = '<div class="loading-spinner">Próximamente...</div>';
  },
  
  // ==================== LIVE TIMING ====================
  
  async loadLiveTiming() {
    const standings = document.getElementById('live-standings');
    if (!standings) return;
    
    standings.innerHTML = `
      <div class="loading-spinner">
        No hay sesiones en vivo ahora.<br>
        <small>Los datos aparecen durante FP1, Qualy, Sprint y Carrera</small>
      </div>
    `;
    
    document.getElementById('timing-session-title').textContent = 'Sin sesión en vivo';
  }
};

// ==================== IA CHAT ====================

const AIChat = {
  init() {
    this.bindEvents();
  },
  
  bindEvents() {
    const input = document.getElementById('ai-input');
    const sendBtn = document.getElementById('ai-send-btn');
    const chips = document.querySelectorAll('.suggestion-chip');
    
    if (sendBtn) sendBtn.addEventListener('click', () => this.sendMessage());
    
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }
    
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        if (input) input.value = chip.dataset.query;
        this.sendMessage();
      });
    });
  },
  
  async sendMessage() {
    const input = document.getElementById('ai-input');
    const message = input?.value.trim();
    
    if (!message) return;
    
    this.addMessage(message, 'user');
    if (input) input.value = '';
    
    this.showTypingIndicator();
    
    try {
      const response = await AIAPI.generateResponse(message);
      this.hideTypingIndicator();
      this.addMessage(response, 'ai');
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage('Error de conexión', 'system');
    }
  },
  
  addMessage(text, type) {
    const chat = document.getElementById('ai-chat');
    if (!chat) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ai-message-${type}`;
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/• /g, '• ');
    
    messageDiv.appendChild(content);
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;
  },
  
  showTypingIndicator() {
    const chat = document.getElementById('ai-chat');
    if (!chat) return;
    
    const indicator = document.createElement('div');
    indicator.id = 'typing-indicator';
    indicator.className = 'ai-message ai-message-system';
    indicator.innerHTML = '<div class="message-content"><em>Escribiendo...</em></div>';
    
    chat.appendChild(indicator);
    chat.scrollTop = chat.scrollHeight;
  },
  
  hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }
};

// Iniciar cuando DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  F1App.init();
});
