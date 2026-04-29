# 🚀 Deploy Rápido - F1IA

## Opción 1: GitHub Pages (2 minutos)

```bash
# 1. Inicializar repo
cd /Users/joanvalls/.openclaw/workspace/F1IA
git init
git add .
git commit -m "F1IA initial commit"

# 2. Crear repo en GitHub (web)
# Ve a github.com/new y crea "F1IA"

# 3. Push
git remote add origin https://github.com/Mistergg15/F1IA.git
git push -u origin main

# 4. Activar GitHub Pages
# Settings → Pages → Branch: main → Save
```

**URL resultante:** `https://Mistergg15.github.io/F1IA/`

---

## Opción 2: Vercel (1 minuto)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
cd /Users/joanvalls/.openclaw/workspace/F1IA
vercel --prod
```

**URL resultante:** `https://f1ia.vercel.app/`

---

## Opción 3: Netlify Drop (30 segundos)

1. Ve a https://app.netlify.com/drop
2. Arrastra la carpeta `F1IA` completa
3. ¡Listo!

**URL resultante:** `https://f1ia-random.netlify.app/`

---

## Probar Localmente

```bash
# Opción A: Abrir directamente
open /Users/joanvalls/.openclaw/workspace/F1IA/index.html

# Opción B: Servidor local
cd /Users/joanvalls/.openclaw/workspace/F1IA
python3 -m http.server 8000
open http://localhost:8000
```

---

## ✅ Checklist Post-Deploy

- [ ] La web carga sin errores
- [ ] Las noticias se ven
- [ ] La clasificación carga
- [ ] El calendario se ve
- [ ] La IA responde (si Ollama está activo)
- [ ] Funciona en móvil (responsive)

---

## 🆘 Problemas Comunes

### CORS Errors
Las APIs pueden bloquear peticiones desde el navegador. Solución:
- Usar servidor local (no file://)
- GitHub Pages/Vercel funcionan bien

### IA no responde
- Ollama debe estar corriendo: `ollama serve`
- O comenta Ollama en `js/apis.js` y usa solo HuggingFace

### Live Timing vacío
- Solo funciona durante sesiones en vivo
- No hay datos en días sin carrera

---

**¿Listo para deploy?** Elige una opción y vamos.
