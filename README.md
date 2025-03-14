# 🚀 MotionParts - E-commerce de Autopartes

**MotionParts** es una plataforma eCommerce especializada en la venta de autopartes, con la posibilidad de integrarse a sistemas de facturación de terceros para una gestión más eficiente. Proporciona un sistema sólido, seguro y escalable para tiendas de autopartes y mayoristas. 🏎️🔩

---

## 🛠️ Tecnologías Utilizadas

### 📌 Backend 🖥️
MotionParts cuenta con un backend robusto desarrollado en **Java**, utilizando el framework **Spring Boot**, lo que permite una arquitectura modular, escalable y segura.

- **Lenguaje:** Java ☕
- **Framework:** Spring Boot 🛡️
- **Seguridad:** Spring Security + JWT 🔑
- **ORM:** JPA / Hibernate 🗄️
- **Patrón:** MVC 🔄
- **Integraciones:** API para sistemas de facturación 📑

### 📌 Frontend 🌐
La interfaz de usuario está construida con **Angular 19**, asegurando una experiencia rápida y dinámica. Se ha integrado **TailwindCSS** para proporcionar estilos modernos y responsivos.

- **Framework:** Angular 19 ⚡
- **Estilos:** TailwindCSS 🎨
- **Gestión de estado:** Servicios y Módulos en Angular 📦

### 📌 Base de Datos 🗄️
Para el almacenamiento de datos, se ha elegido **PostgreSQL**, un sistema de base de datos relacional altamente seguro, estable y escalable.

- **Motor:** PostgreSQL 🐘
- **Ventajas:** Seguridad, solidez y extensibilidad 🔥

---

## 📌 Características Principales
- ✅ Venta de autopartes en línea
- ✅ Gestión de usuarios y productos
- ✅ Integración con sistemas de facturación externos
- ✅ Seguridad robusta con JWT y Spring Security
- ✅ Diseño moderno y responsive con TailwindCSS

---

## 📂 Estructura del Proyecto
```plaintext
MotionParts/
│── backend/  # Java + Spring Boot
│── frontend/ # Angular 19 + TailwindCSS
```

---

## 🚀 Instalación y Configuración

### 📌 Requisitos Previos
Antes de comenzar, asegúrate de tener instalados los siguientes componentes:
- [Node.js](https://nodejs.org/) & npm (para Angular)
- [Java 17+](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html) (para Spring Boot)
- [PostgreSQL](https://www.postgresql.org/) instalado y configurado

### 🔧 Pasos de Instalación
1. **Clonar el Repositorio**
   ```sh
   git clone https://github.com/tuusuario/MotionParts.git
   cd MotionParts
   ```

2. **Configurar la Base de Datos**
   - Crear una base de datos PostgreSQL llamada `motionParts`.

3. **Levantar el Backend**
   ```sh
   cd backend
   ./mvnw spring-boot:run
   ```

4. **Iniciar el Frontend**
   ```sh
   cd frontend
   npm install
   ng serve
   ```

---

## 🎯 Contribuir
¡Las contribuciones son bienvenidas! 🏆 Si deseas colaborar, sigue estos pasos:

1. Haz un **fork** 🍴 del proyecto.
2. Crea una nueva rama `feature/nueva-funcionalidad`.
3. Realiza tus cambios y haz un commit:
   ```sh
   git commit -m "Agrega nueva función"
   ```
4. Envía un **Pull Request** 📩 para su revisión.

---

## 📄 Licencia
Este proyecto está bajo la licencia **MIT** 📝.

---

💡 *"Construyendo el futuro del eCommerce automotriz, una pieza a la vez."* 🚗⚙️
