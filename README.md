# 🏁 F1IA - Formula 1 Intelligence App

**La mejor web de Fórmula 1 con Live Timing, telemetría, predicciones y stats en tiempo real.**

## 🌐 Deploy Actual

**Netlify:** https://f1ia-joanvalls.netlify.app

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

## ✨ Características

- 📰 **Noticias** en tiempo real de múltiples fuentes (F1.com, F1Technical, Reddit)
- 🏁 **Resultados y Clasificación** de pilotos y constructores
- 📅 **Calendario** de carreras 2026
- ⏱️ **Live Timing** durante sesiones en vivo
- 📊 **Telemetría** de pilotos en tiempo real
- 🤖 **IA Integrada** para resúmenes y preguntas

## 🚀 Tecnologías

### APIs (con fallback dual)
- **Resultados:** Jolpica API + F1 API Dev
- **Live Timing:** OpenF1 API + FastF1
- **Noticias:** RSS feeds múltiples
- **IA:** Ollama local + HuggingFace

### Frontend
- HTML5, CSS3, JavaScript Vanilla
- Diseño responsive (Mac, iPad, iPhone)
- PWA ready (instalable)
- Sin frameworks - máximo rendimiento

## 📁 Estructura

```
F1IA/
├── index.html          # App principal
├── css/
│   └── styles.css      # Estilos F1 dark theme
├── js/
│   ├── apis.js         # Capa de APIs con fallback
│   ├── ai.js           # Lógica de IA y chat
│   └── app.js          # Lógica de la app
└── assets/
    └── favicon.svg     # Icono F1IA
```

## 🛠️ Instalación

### Opción 1: Netlify (RECOMENDADO)

1. Ve a https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Conecta GitHub y selecciona `joanvalls1998-ui/F1IA`
4. Build command: `(dejar vacío)` | Publish directory: `/`
5. Click "Deploy site"
6. ¡Listo en 30 segundos!

**URL:** `https://f1ia-joanvalls.netlify.app`

Ver `NETLIFY-DEPLOY.md` para instrucciones detalladas.

### Opción 2: GitHub Pages

1. Sube el contenido a un repo GitHub
2. Activa GitHub Pages en Settings
3. ¡Listo! URL: `https://tu-usuario.github.io/F1IA/`

### Opción 3: Local

```bash
# Abrir directamente en navegador
open F1IA/index.html

# O usar servidor local
python3 -m http.server 8000
# Abrir http://localhost:8000
```

### Opción 4: Vercel

1. Conecta tu repo de GitHub en Vercel
2. Deploy automático
3. ¡Gratis y con HTTPS!

## 📱 Uso

### Navegación
- **Noticias:** Últimas noticias de F1
- **Resultados:** Clasificación y calendario
- **Live Timing:** Datos en vivo durante sesiones
- **IA:** Chat para preguntas y resúmenes

### IA - Ejemplos de uso
- "¿Quién ganó el último GP?"
- "Clasificación de pilotos 2026"
- "Resume las noticias de hoy"
- "¿Cuántos mundiales tiene Hamilton?"

## 🔧 Configuración

### APIs
Las APIs están configuradas en `js/apis.js`. Puedes cambiarlas si es necesario:

```javascript
const F1_APIS = {
  standings: {
    primary: 'https://api.jolpi.ca/ergast/f1',
    secondary: 'https://f1api.dev/api/f1'
  },
  // ... más APIs
};
```

### IA Local (Ollama)
Para usar IA local sin límites:

```bash
# Instalar Ollama
brew install ollama

# Descargar modelo
ollama pull llama3.2

# Iniciar servidor
ollama serve
```

## 🎨 Diseño

- **Tema:** F1 Dark (negro, rojo, gris)
- **Responsive:** Mac, iPad, iPhone
- **Accesible:** Contraste WCAG AA
- **Rápido:** Sin dependencias externas

## 📊 Estado de APIs

| Servicio | Primary | Secondary | Estado |
|----------|---------|-----------|--------|
| Resultados | Jolpica | F1 API Dev | ✅ |
| Live Timing | OpenF1 | FastF1 | ✅ |
| Noticias | F1.com RSS | Multi-feed | ✅ |
| IA | Ollama Local | HuggingFace | ✅ |

## 🐛 Solución de Problemas

### "No hay datos disponibles"
- Verifica tu conexión a internet
- Las APIs pueden estar caídas temporalmente
- El fallback debería activarse automáticamente

### "IA no responde"
- Ollama debe estar corriendo localmente
- O usa HuggingFace (tiene límites gratis)

### Live Timing no funciona
- Solo disponible durante sesiones en vivo
- FP1, Qualy, Sprint, Carrera

## 📝 Licencia

MIT License - Haz lo que quieras con esto.

## 🙏 Créditos

- **Jolpica API:** Datos históricos F1
- **OpenF1:** Live timing y telemetría
- **F1.com:** Noticias oficiales

---

**Hecho con ❤️ para fans de F1**
