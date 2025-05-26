# VeterinariaICP 🐾

Sistema de gestión veterinaria descentralizado construido en Internet Computer Protocol (ICP) para el manejo de carnets de mascotas y validación de vacunas.

## 📋 Descripción

VeterinariaICP es una aplicación descentralizada que permite a las veterinarias gestionar de forma segura y transparente los carnets de salud de las mascotas, incluyendo el registro y validación de vacunas. Utiliza la blockchain de Internet Computer para garantizar la inmutabilidad y veracidad de los registros médicos veterinarios.

## ✨ Características

- 🏥 **Gestión de Veterinarias**: Registro y administración de clínicas veterinarias
- 🐕 **Carnets de Mascotas**: Creación y mantenimiento de historiales médicos digitales
- 💉 **Control de Vacunas**: Registro, seguimiento y validación de vacunas aplicadas
- 🔐 **Autenticación Segura**: Integración con Internet Identity para acceso seguro
- 📱 **Interfaz Responsive**: Diseño adaptable para dispositivos móviles y desktop
- 🌐 **Descentralizado**: Almacenamiento seguro en la blockchain de ICP

## 🚀 Comenzando

### Prerrequisitos

- Node.js (versión 16 o superior)
- DFX SDK instalado
- Git

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/GuidoSV7/VeterinariaICP.git
   cd VeterinariaICP
   ```

2. **Instala las dependencias del frontend**
   ```bash
   cd src/frontend
   npm install
   cd ../..
   ```

3. **Inicia la réplica local de ICP**
   ```bash
   dfx start --background --clean
   ```

4. **Despliega Internet Identity**
   ```bash
   dfx deploy internet_identity
   ```

5. **Despliega el backend**
   ```bash
   dfx deploy backend
   ```

6. **Genera los archivos de declaración**
   ```bash
   dfx generate backend
   ```

7. **Configura las variables de entorno**
   ```bash
   cp .env-example .env
   ```
   
   Edita el archivo `.env` y actualiza:
   - `REACT_APP_INTERNET_COMPUTER_PROVIDER` con la URL de Internet Identity
   - `REACT_APP_BACKEND_CANISTER_ID` con el ID del canister backend

8. **Ejecuta la aplicación en modo desarrollo**
   ```bash
   npm run start
   ```

## 🛠️ Comandos Útiles

### Desarrollo
```bash
# Iniciar en modo desarrollo
npm run start

# Ejecutar tests
npm test

# Build de producción
npm run build
```

### Despliegue
```bash
# Desplegar todo el proyecto
dfx deploy

# Desplegar solo el frontend
dfx deploy frontend

# Desplegar solo el backend
dfx deploy backend
```

### Utilidades
```bash
# Ver logs del canister
dfx canister logs backend

# Obtener ID de canister
dfx canister id backend

# Estado de los canisters
dfx canister status --all
```

## 🔧 Tecnologías Utilizadas

- **Frontend**: React.js, CSS Modules, JavaScript
- **Backend**: Motoko/Rust (ICP Canisters)
- **Blockchain**: Internet Computer Protocol (ICP)
- **Autenticación**: Internet Identity
- **Herramientas**: DFX SDK, Node.js, npm

## 🐾 Funcionalidades Específicas

### Para Veterinarios
- Registro de nuevas mascotas en el sistema
- Actualización de historiales médicos
- Aplicación y registro de vacunas
- Generación de reportes de salud

### Para Propietarios
- Visualización del carnet digital de su mascota
- Historial completo de vacunas y tratamientos
- Verificación de autenticidad de registros
- Acceso desde cualquier dispositivo

### Para el Sistema
- Validación automática de fechas de vacunación
- Alertas de vacunas próximas a vencer
- Trazabilidad completa de todos los registros
- Backup automático en blockchain

---

⭐ ¡No olvides dar una estrella al proyecto si te fue útil!

🐕 Hecho con ❤️ para el bienestar de nuestras mascotas