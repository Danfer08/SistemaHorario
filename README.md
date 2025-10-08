## SistemaHorarios (UNAP) – Laravel + React (Vite)

Aplicación para gestionar horarios académicos. Backend en Laravel con autenticación por Sanctum; frontend en React (Vite) dentro de `resources/js`.

### Funcionalidades clave
- Autenticación con email institucional obligatorio `@unap.edu.pe` para login y registro.
- API de auth (`/api/login`, `/api/register`, `/api/logout`, `/api/user`) protegida con Sanctum.
- SPA con `Dashboard` tras autenticación y pantallas de Login/Registro.
- Sistema de alertas automáticas (success/error/info) con auto-cierre en 5 segundos.
- Redirección automática al Dashboard tras login/registro exitoso.
- Validación de dominio institucional en backend y frontend.
- Manejo de errores mejorado con mensajes específicos.
- Ejemplo de endpoint protegido: `/api/cursos`.

### Requisitos
- PHP 8.2+, Composer
- Node 18+, npm
- MySQL/MariaDB (o el motor que configures)

### Configuración rápida
1) Instala dependencias
```bash
composer install
npm install
```

2) Copia el archivo de entorno y configura la base de datos
```bash
cp .env.example .env  # en Windows copia manualmente si no existe
```
Edita `.env`:
```
APP_URL=http://127.0.0.1:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sistema_horarios
DB_USERNAME=root
DB_PASSWORD=tu_password

SANCTUM_STATEFUL_DOMAINS=127.0.0.1:8000,localhost:8000
SESSION_DOMAIN=127.0.0.1
```

3) Genera la clave de app y ejecuta migraciones
```bash
php artisan key:generate
php artisan migrate
```

4) Levanta el servidor y el frontend
```bash
php artisan serve
npm run dev
```
Abre `http://127.0.0.1:8000`.

### Endpoints de autenticación
- POST `/api/register` { name, email, password, password_confirmation }
- POST `/api/login` { email, password }
- POST `/api/logout`
- GET `/api/user`

**Respuestas del backend:**
- **Registro exitoso**: `{ success: true, message: "...", user: {...}, token: "..." }`
- **Login exitoso**: `{ success: true, message: "...", user: {...}, token: "..." }`
- **Usuario autenticado**: `{ success: true, user: {...} }`

Notas:
- El email debe terminar en `@unap.edu.pe` (validación aplicada en backend y frontend).
- Se usa cookie de sesión de Sanctum; el frontend llama a `/sanctum/csrf-cookie` automáticamente.
- Las alertas se muestran automáticamente y se cierran en 5 segundos.

### Estructura relevante
- **Backend**
  - `routes/api.php`: rutas de auth y protegidas
  - `app/Http/Controllers/AuthController.php`: login/register/logout/user con validación de dominio
  - `config/sanctum.php`, `config/cors.php`: CORS/Sanctum
- **Frontend**
  - `resources/js/contexts/AuthContext.jsx`: manejo de sesión, alertas y estado global
  - `resources/js/components/auth/*`: Login/Registro/AuthPage con validación de dominio
  - `resources/js/components/Dashboard.jsx`: dashboard principal
  - `resources/js/app.jsx`: arranque de la SPA con sistema de alertas
- **Flujo de autenticación**
  - Registro → Backend valida dominio → Usuario creado → Alerta verde → Dashboard
  - Login → Backend valida credenciales → Usuario autenticado → Alerta verde → Dashboard
  - Logout → Sesión cerrada → Alerta azul → LoginForm

### Solución de problemas
- **401/419 al loguear**: confirma `SANCTUM_STATEFUL_DOMAINS` y `SESSION_DOMAIN`; accede por `127.0.0.1`.
- **500 en login/registro**: revisa `storage/logs/laravel.log` y conexión a BD `.env`.
- **CORS**: revisa `config/cors.php` y ejecuta `php artisan config:clear` tras cambios.
- **No redirección tras login/registro**: verifica que el backend devuelva `success: true` y que `fetchUser()` funcione.
- **Alertas no aparecen**: confirma que el contexto esté actualizado y que las alertas se muestren en `app.jsx`.
- **"Error en el login/registro"**: verifica que el backend devuelva la estructura `{ success: true, user: {...} }`.
- **Usuario se crea pero muestra error**: el backend está funcionando, pero el frontend no maneja bien la respuesta.
- **Validación de dominio**: confirma que tanto backend como frontend validen `@unap.edu.pe`.

### Licencia
Proyecto educativo. Basado en Laravel (MIT).
