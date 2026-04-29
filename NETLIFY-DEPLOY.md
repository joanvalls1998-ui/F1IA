# 🚀 Deploy F1IA en Netlify

## Opción A: Deploy Automático (RECOMENDADA)

### Pasos:

1. **Ve a Netlify**
   - Abre: https://app.netlify.com
   - Click en "Sign up" (gratis, sin tarjeta)
   - Usa "Continue with GitHub"

2. **Conecta tu repositorio**
   - Click en "Add new site" → "Import an existing project"
   - Selecciona "GitHub"
   - Busca el repo: `joanvalls1998-ui/F1IA`
   - Click en "Select repository"

3. **Configura el build**
   - **Build command:** `(dejar vacío)`
   - **Publish directory:** `/`
   - El archivo `netlify.toml` ya está configurado

4. **Deploy**
   - Click en "Deploy site"
   - Espera ~30 segundos
   - ¡Listo! Tu URL será: `https://f1ia-joanvalls.netlify.app`

5. **Actualiza la URL en el README**
   ```bash
   git add README.md
   git commit -m "📝 Update deploy URL to Netlify"
   git push
   ```

---

## Opción B: Deploy Manual (CLI)

### Si quieres usar la terminal:

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Inicializar sitio
netlify init

# 4. Deploy
netlify deploy --prod
```

---

## ✅ Qué incluye Netlify Free:

- ✅ Hosting gratuito ilimitado
- ✅ SSL automático (HTTPS)
- ✅ Deploy automático con cada push a GitHub
- ✅ Deploy previews para pull requests
- ✅ CDN global (rápido en todo el mundo)
- ✅ 100 GB bandwidth/mes
- ✅ 300 build minutes/mes
- ✅ Functions serverless (si las necesitas luego)

---

## 🔗 URLs:

- **Producción:** `https://f1ia-joanvalls.netlify.app`
- **Dashboard Netlify:** `https://app.netlify.com/sites/f1ia-joanvalls`
- **Repo:** `https://github.com/joanvalls1998-ui/F1IA`

---

## 📊 Deploy Automático:

Cada vez que has `git push`, Netlify:
1. Detecta el cambio en GitHub
2. Hace build automático
3. Actualiza la web en ~30 segundos
4. Mantiene historial de deploys (puedes hacer rollback)

---

## 🎨 Personalización (Opcional):

### Cambiar el nombre del sitio:
1. Ve al dashboard en Netlify
2. "Site settings" → "Change site name"
3. Ejemplo: `f1ia-f1-dashboard` → `https://f1ia-f1-dashboard.netlify.app`

### Dominio personalizado (si compras uno):
1. "Domain management" → "Add custom domain"
2. Ejemplo: `f1ia.joanvalls.com`
3. Netlify te da instrucciones para DNS

---

## 🆘 Soporte:

- Docs: https://docs.netlify.com
- Status: https://www.netlifystatus.com
- Community: https://answers.netlify.com
