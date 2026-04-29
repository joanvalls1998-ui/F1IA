/**
 * F1IA - Lógica de IA y Chat
 */

const AIChat = {
  messages: [],
  isProcessing: false,
  
  /**
   * Inicializar chat de IA
   */
  init() {
    this.bindEvents();
    this.loadHistory();
  },
  
  /**
   * Vincular eventos
   */
  bindEvents() {
    const input = document.getElementById('ai-input');
    const sendBtn = document.getElementById('ai-send-btn');
    const chips = document.querySelectorAll('.suggestion-chip');
    
    // Enviar con botón
    sendBtn?.addEventListener('click', () => this.sendMessage());
    
    // Enviar con Enter (Shift+Enter para nueva línea)
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    // Chips de sugerencias
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.dataset.query;
        input.value = query;
        this.sendMessage();
      });
    });
  },
  
  /**
   * Enviar mensaje
   */
  async sendMessage() {
    if (this.isProcessing) return;
    
    const input = document.getElementById('ai-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Añadir mensaje de usuario
    this.addMessage(message, 'user');
    input.value = '';
    
    // Mostrar indicador de "escribiendo..."
    this.showTypingIndicator();
    
    this.isProcessing = true;
    
    try {
      // Obtener contexto si es relevante
      const context = await this.getRelevantContext(message);
      
      // Generar respuesta
      const response = await AIAPI.generateResponse(message, context);
      
      // Ocultar indicador
      this.hideTypingIndicator();
      
      // Añadir respuesta
      this.addMessage(response, 'ai');
      
      // Guardar en historial
      this.saveToHistory(message, response);
    } catch (error) {
      console.error('Error en IA:', error);
      this.hideTypingIndicator();
      this.addMessage('Lo siento, tuve un problema. Intenta de nuevo.', 'system');
    }
    
    this.isProcessing = false;
  },
  
  /**
   * Obtener contexto relevante para la pregunta
   */
  async getRelevantContext(question) {
    const lower = question.toLowerCase();
    
    // Si pregunta sobre resultados/clasificación
    if (lower.includes('clasific') || lower.includes('puntos') || lower.includes('piloto')) {
      try {
        const standings = await StandingsAPI.getDriversStandings('2026');
        const top5 = standings.slice(0, 5).map(d => 
          `${d.position}. ${d.Driver?.givenName || d.driver} ${d.Driver?.familyName || ''} (${d.Constructors?.[0]?.name || d.team}) - ${d.points} pts`
        ).join('\n');
        
        return `Clasificación 2026 Top 5:\n${top5}`;
      } catch {
        return '';
      }
    }
    
    // Si pregunta sobre noticias
    if (lower.includes('noticia') || lower.includes('resumen')) {
      try {
        const news = await NewsAPI.getNews();
        const recent = news.slice(0, 3).map(n => `- ${n.title}`).join('\n');
        
        return `Noticias recientes:\n${recent}`;
      } catch {
        return '';
      }
    }
    
    return '';
  },
  
  /**
   * Añadir mensaje al chat
   */
  addMessage(text, type = 'user') {
    const chat = document.getElementById('ai-chat');
    if (!chat) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ai-message-${type}`;
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = this.formatMessage(text);
    
    messageDiv.appendChild(content);
    chat.appendChild(messageDiv);
    
    // Scroll al final
    chat.scrollTop = chat.scrollHeight;
  },
  
  /**
   * Formatear mensaje (markdown básico)
   */
  formatMessage(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>')
      .replace(/- (.*?)(<br>|$)/g, '• $1$2');
  },
  
  /**
   * Mostrar indicador de escribiendo
   */
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
  
  /**
   * Ocultar indicador
   */
  hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  },
  
  /**
   * Guardar en historial (localStorage)
   */
  saveToHistory(userMessage, aiResponse) {
    const history = JSON.parse(localStorage.getItem('f1ia_chat_history') || '[]');
    
    history.push({
      user: userMessage,
      ai: aiResponse,
      timestamp: new Date().toISOString()
    });
    
    // Mantener últimos 50 mensajes
    if (history.length > 50) history.shift();
    
    localStorage.setItem('f1ia_chat_history', JSON.stringify(history));
  },
  
  /**
   * Cargar historial
   */
  loadHistory() {
    const history = JSON.parse(localStorage.getItem('f1ia_chat_history') || '[]');
    
    history.forEach(msg => {
      this.addMessage(msg.user, 'user');
      this.addMessage(msg.ai, 'ai');
    });
  },
  
  /**
   * Limpiar chat
   */
  clear() {
    localStorage.removeItem('f1ia_chat_history');
    const chat = document.getElementById('ai-chat');
    if (chat) chat.innerHTML = '';
    this.messages = [];
  }
};

// Exportar
window.AIChat = AIChat;
