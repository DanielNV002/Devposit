# Devposit 📱💰

Devposit es una aplicación móvil para **gestionar ingresos y gastos personales**, desarrollada con **React + Capacitor**, pensada para Android. Permite registrar movimientos, almacenarlos localmente y visualizar la evolución del saldo de forma clara mediante una gráfica temporal.

---

## ✨ Funcionalidades

- ➕ Registro de **ingresos**
- ➖ Registro de **gastos**
- 💾 Persistencia local usando **Capacitor Filesystem** (JSON)
- 📊 Gráfica de **evolución del saldo diario**
- 🔄 Actualización en tiempo real al añadir movimientos
- 📱 App nativa Android (no WebView suelta)

---

## 🛠️ Tecnologías usadas

- **React**
- **Capacitor**
- **Recharts** (gráficas)
- **SCSS**
- **Android Studio**

---

## 📂 Estructura del proyecto

```
src/
 ├── components/
 │   ├── Movimiento.jsx
 │   ├── FormMovimientos.jsx
 │   ├── DashboardGrafica.jsx
 │   └── Grafica.jsx
 ├── storage/
 │   └── movimientosStorage.js
 ├── App.jsx
 └── main.jsx
```

---

## 💾 Almacenamiento de datos

Los movimientos se guardan localmente en un archivo JSON usando Capacitor:

```
/data/data/com.daniel.gestiones/files/movimientos.json
```

Esto permite que los datos persistan aunque la app se cierre.

---

## 📊 Gráfica de saldo

La gráfica muestra:

- Eje X → Fechas
- Eje Y → Saldo acumulado
- Un único punto por día (saldo total diario)

Los datos se recalculan automáticamente cada vez que se añade un movimiento.

---

## ▶️ Ejecutar el proyecto en desarrollo

### Instalar dependencias
```bash
npm install
```

### Ejecutar en navegador
```bash
npm run dev
```

### Build + sincronizar con Android
```bash
npm run build
npx cap sync android
```

### Ejecutar directamente en un móvil conectado
```bash
npx cap run android --device
```

---

## 📦 Generar APK

Desde Android Studio:

```
Build → Build Bundle(s) / APK(s) → Build APK(s)
```

---

## 🚧 Posibles mejoras futuras

- 📆 Filtro por meses
- 🏷️ Categorías de gastos
- ☁️ Backup / exportación de datos
- 🌙 Modo oscuro
- 📈 Más tipos de gráficas

---

## 👨‍💻 Autor

**Daniel Navarro**

Proyecto personal para aprendizaje y experimentación con React + Capacitor.

---

Siéntete libre de clonar, probar y modificar el proyecto 🚀

