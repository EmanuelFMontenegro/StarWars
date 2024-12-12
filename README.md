# Star Wars Universe - Frontend Application

**Star Wars Universe** es una aplicación web desarrollada en **Angular 18**, diseñada para ofrecer una experiencia dinámica de exploración del universo Star Wars. Este proyecto utiliza **SSR (Server-Side Rendering)** con Angular Universal para mejorar el rendimiento, el SEO y la accesibilidad. La aplicación consume la API pública de Star Wars (`https://swapi.dev`) y ofrece funcionalidades como búsqueda, paginación y visualización de detalles de planetas, naves estelares y personajes.

---

## Tabla de Contenidos

- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecución del Proyecto](#ejecución-del-proyecto)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Pruebas Unitarias y Cobertura](#pruebas-unitarias-y-cobertura)
- [Especificaciones Técnicas](#especificaciones-técnicas)
- [Futuro Desarrollo](#futuro-desarrollo)
- [Contribuciones](#contribuciones)

---

## Tecnologías Utilizadas

- **Angular** (v18): Framework para el desarrollo frontend.
- **Angular Universal**: Para Server-Side Rendering (SSR).
- **RxJS**: Manejo de programación reactiva.
- **Angular Material** (v18): Componentes estilizados para la interfaz.
- **Ngx-Toastr**: Notificaciones rápidas y claras.
- **Ngx-Spinner**: Indicador visual de carga.
- **Jasmine + Karma**: Pruebas unitarias.
- **REST API**: Consumo de la API pública de Star Wars.

---

## Características

1. **SSR con Angular Universal**:
   - Mejoras en el SEO y tiempos de carga inicial.
   - Optimización de rendimiento para dispositivos de bajo rendimiento.

2. **Uso de Angular Material v18**:
   - Componentes modernos, estilizados y adaptables.
   - Mejoras en la accesibilidad y diseño responsivo.

3. **Componentes Modulares y Reutilizables**:
   - Componentes independientes para fácil integración y escalabilidad.

4. **Funcionalidades Principales**:
   - **Búsqueda dinámica**: Encuentra planetas, naves o personajes de manera eficiente.
   - **Paginación**: Visualización organizada de datos con navegación por páginas.
   - **Visualización de Detalles**: Información detallada en modales.

5. **UI/UX Intuitiva**:
   - Diseño responsivo y accesible utilizando Angular Material.

---

## Requisitos Previos

Antes de iniciar, asegúrate de tener las siguientes herramientas instaladas:

- **Node.js** (v16 o superior): [Descargar Node.js](https://nodejs.org/)
- **Angular CLI**: Instalar mediante `npm install -g @angular/cli`
- **Git**: [Descargar Git](https://git-scm.com/)

---

## Instalación

1. **Clona este repositorio**:
   ```bash
   git clone https://github.com/usuario/star-wars-ssr-app.git
   cd star-wars-ssr-app
