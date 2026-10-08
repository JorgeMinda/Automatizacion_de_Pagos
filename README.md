# School Lunch & Payment Automation System (Wasp + Clean Architecture)

Sistema empresarial de automatización de pagos y control de almuerzos escolares con **Double-Entry Ledger**, arquitectura **Offline-First**, integración con **ERP Pontífico** y **Bot de WhatsApp**.

---

## 🏗️ Arquitectura del Sistema

```
c:\Users\minda\Desktop\Automatización de Pagos\
├── main.wasp.ts              # Orquestador central Wasp (Rutas, Operaciones, Jobs, Auth)
├── schema.prisma             # Modelo relacional de alta integridad (PostgreSQL)
├── package.json              # Configuración de dependencias
├── tailwind.config.cjs       # Design System Cyberpunk Glassmorphism
└── src/
    ├── core/                 # Entidades puras, Value Objects, Errores y Seed
    │   ├── domain/types.ts
    │   ├── errors/DomainErrors.ts
    │   └── seed.ts
    ├── modules/              # Vertical Slices (Clean Architecture)
    │   ├── payments/         # Pagos directos, Ledger de Doble Entrada
    │   ├── pos/              # Despacho atómico en mostrador, Idempotencia
    │   ├── inventory/        # Recetas y descomposición BOM
    │   └── whatsapp/         # Bot y máquina de estados desacoplada
    ├── infrastructure/       # Adaptadores externos (ERP Pontífico HMAC, WhatsApp API)
    └── client/               # Frontend React con Futuristic Dark Glassmorphism
        ├── components/       # GlassCard, AmbientGlow, QRCardModal, Navbar
        └── pages/            # POSCheckoutPage, ParentDashboardPage, AdminReportsPage
```

---

## 🚀 Pasos para Iniciar en Desarrollo

1. **Configurar Variables de Entorno:**
   ```bash
   cp .env.example .env
   ```

2. **Instalar Dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar Migraciones de Base de Datos:**
   ```bash
   wasp db migrate-dev
   ```

4. **Iniciar Servidor de Desarrollo:**
   ```bash
   wasp start
   ```

---

## 🛡️ Características Principales Implementadas

- **Double-Entry Ledger:** Registro inmutable (Append-Only) en compras y recargas monetarias.
- **Idempotencia Estricta:** Clave criptográfica `idempotency_key` por cada despacho en caja para evitar cobros dobles en caso de inestabilidad de red.
- **Alertas Médicas Bloqueantes:** Banner emergente interruptivo en el POS ante estudiantes con alergias de severidad `CRITICO`.
- **Descomposición de Recetas BOM:** Deducción proporcional automática de insumos simples y materias primas hacia el ERP Pontífico vía HMAC-SHA256.
- **Bot de WhatsApp Desacoplado:** Consultas de menú, datos bancarios y calendario conectadas en tiempo real a PostgreSQL.
- **Design System Futurista:** Paleta `#05030a`, `#9d4edd`, `#f72585`, contenedores con `backdrop-blur` y luces ambientales.
