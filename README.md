# SGAU
Sistema Web de Gestión Académica Universitaria

---

### resumen del proyecto
Actualmente, cuando hablamos de información, o gestión académica (notas, asistencias, promedios, acceso offline) se realiza mediante procesos manuales, herramientas poco integradas o no lo suficientemente precisas, generando errores de cálculo, falta de transparencia para el estudiante y una carga administrativa excesiva para el docente. También mencionando que muchas veces, varias de estas herramientas se encuentran en diferentes plataformas.

En nuestra solución, Proponemos un sistema de gestión web centralizado que automatice el cálculo de promedio en tiempo real, adaptado al sistema educativo de nuestro país, también permitiendo a los estudiantes tener seguimientos de sus rendimientos (promedios, ponderados, nota necesaria para aprobar, etc) lo que garantiza la integridad de los datos, dependiendo por supuesto del rol del usuario.

---

### Alcance a cubrir
Como primera entrega, nos queremos proponer que los actores puedan realizar las siguientes acciones prioritarias:
* Administrador: Gestionar (Crear, Leer, Actualizar, Borrar) cuentas de usuarios, carreras y asignaturas
* Docente: Registrar evaluaciones con sus respectivas ponderaciones, también ingresar calificaciones para cada estudiante en sus ramos asignados.
* Estudiante: Consulta su historial de notas, su promedio actual por ramo, ponderaciones y ‘nota necesaria’ para alcanzar aprobación en evaluaciones pendientes.

---

### Objetivos
Para cumplir con el alcance, planeamos implementar:
* Módulo de autenticación: Login seguro con redirección, basándose en los roles (Admin, Docente y Estudiante), restringiendo el acceso en caso de ser necesario.
* Motor de Cálculo Automático: Algoritmo que procese promedios ponderados inmediatamente tras el ingreso de una nota, con un margen de error del 0%
* Panel de Rendimiento Predictivo: Interfaz que calcule y muestre la nota mínima requerida en los ítems restantes según la regla de aprobación institucional.
* Base de Datos Relacional: Centralización de datos que permita consultas de historial académico.

---

### Definición de tecnologías a utilizar
Finalmente, para el desarrollo de este sistema, hemos seleccionado el stack MERN (MongoDB, Express, React, Node.js) por la necesidad de manejar datos dinámicos, convidando una experiencia de usuario fluida, con el provecho de un lenguaje unificado (JavaScript) en el ciclo del desarrollo.

* MongoDB (Base de Datos): Se utilizará para el almacenamiento de datos no relacionales, permitiendo una estructura flexible para los perfiles de estudiantes, docentes y el historial de notas. Es ideal para manejar la escalabilidad del sistema académico.
* Express.js (Backend): Actuará como el framework del servidor, gestionando las rutas de la API, la autenticación de usuarios y la lógica de negocio detrás del cálculo de promedios.
* React (Frontend): Se empleará para construir una interfaz de usuario interactiva y reactiva. Esto permitirá que los estudiantes vean las actualizaciones de sus promedios y el rendimiento académico en tiempo real sin necesidad de recargar el sitio.
* Node.js (Entorno de ejecución): Proporcionará el entorno necesario para ejecutar el servidor en el backend, garantizando una comunicación eficiente y rápida entre la base de datos y la interfaz de usuario.

---

### Ejecución
En Terminal:

1. cd server
2. node index.js
3. (abre una segunda terminal)
4. npm run dev

entra a > http://localhost:5173/
(el local host es solo temporal hasta que la pagina web sea estable)
