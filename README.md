# Proyecto WEB
## Documentacion

> Esta aplicación web está diseñada para la venta de alimentos secos para perros y gatos, permitiendo a los clientes elegir entre una variedad de productos disponibles.

> Funcionalidades
En la aplicación existen dos roles fundamentales:
+ [Administrador](#administrador): Gestiona los productos, usuarios y pedidos.
+ [Cliente](#cliente): Puede navegar por el catálogo de productos, agregar artículos al carrito y realizar compras.
  
> Características Adicionales.
+ [ChatBot](#chatbot): La aplicación cuenta con un chatbot desarrollado con IBM Watson, proporcionando asistencia automática y respuestas a las consultas de los usuarios en tiempo real.
Esta plataforma ofrece una experiencia de usuario intuitiva y eficiente para satisfacer las necesidades nutricionales de las mascotas.

---

### Tabla de contenidos
+ [Modulos para el front-end y back-end](#modulos-para-front-end-y-back-end)
+ [¿Cómo ejecutar el programa?](#como-ejecutar-el-programa)
+ [¿Cómo mato un proceso de servidor?](#como-matar-proceso-servidor)
+ [Tecnologías utilizadas](#tecnologias)
+ [Imagenes](#imagenes)

---

### Modulos para front-end y back-end
<a name="modulos-para-front-end-y-back-end"></a>
> ##### bcryptjs: - 2.4.3:
- Utilizado para cifrar contraseñas y almacenarlas de forma segura como hashes.

> ##### body-parser: - 1.20.2:
- Middleware para procesar el cuerpo de las solicitudes HTTP.

> ##### connect-flash: - 0.1.1:
- Facilita el envío de mensajes entre múltiples vistas, útil para notificar sobre eventos como contraseñas débiles o errores de inicio de sesión.

> ##### express: - 4.19.2:
- Framework de Node.js para simplificar la creación de servidores web.

> ##### express-fileupload - 1.5.0:
- Una biblioteca para Express.js que facilita la carga de archivos. Permite manejar fácilmente las solicitudes de carga de archivos en aplicaciones Express, simplificando el proceso de subida de archivos.

> ##### express-handlebars - 3.0.0:
- Un motor de plantillas para Express.js que permite la creación de vistas dinámicas utilizando Handlebars.

> ##### express-session: - 1.18.0:
- Almacena temporalmente información de sesión del usuario para mantener la autenticación entre solicitudes

> ##### method-override: - 3.0.0:
- Extiende la funcionalidad de los métodos HTTP en formularios web, como PUT y DELETE, para manejar solicitudes que no son compatibles con HTML nativo.

> ##### mongoose: - 8.2.4:
- Facilita la interacción con bases de datos MongoDB desde Express, proporcionando una interfaz sencilla para la gestión de modelos y consultas.

> ##### multer: - 1.4.5-lts.1:
- Un middleware para el manejo de archivos en Node.js. Multer es una opción popular para procesar formularios que incluyen carga de archivos en aplicaciones Node.js, ofreciendo una fácil integración con frameworks como Express. La versión 1.4.5-lts.1 puede considerarse una versión LTS (Long-Term Support), lo que significa que se brinda soporte a largo plazo para esta versión específica.
  
> ##### passport: - 0.7.0:
- Middleware de autenticación para Node.js que simplifica el proceso de autenticación de usuarios.

> ##### passport-local: - 1.0.0:
- Estrategia de autenticación Passport basada en contraseñas locales, ideal para autenticar usuarios utilizando credenciales almacenadas en una base de datos local.

> ##### nodemon: - 3.1.0:
- Herramienta que ayuda a desarrollar aplicaciones basadas en Node.js reiniciando automáticamente la aplicación cuando se detectan cambios en el código fuente.

---

### ¿Cómo ejecutar el programa?
<a name="como-ejecutar-el-programa"></a>
- Para ejecutar el código, simplemente abre la terminal y utiliza el siguiente comando: `npm run dev`. Este comando ejecuta el código, y lo más interesante es que el servidor se reinicia automáticamente con cada modificación, eliminando la necesidad de reiniciarlo manualmente con `CTRL + C` y luego ejecutar `node src/index.js`.

### ¿Cómo mato un proceso de servidor?
<a name="como-matar-proceso-servidor"></a>
- Si olvidaste cerrar (matar) el proceso del servidor, no te preocupes aqui tengo la solucion.
- 1-. Consulta la informaion del proceso con el siguiente comando: `lsof -i :TU_PUERTO`.
- 2-. Identifica el valor de la propiedad PID.
- 3-. Ingresa el siguiente comando: `kill <VALOR_PID>`.

---

### Tecnologías utilizadas
<a name="tecnologias"></a>
> ###### Front-end
- [x] HTML
- [x] CSS
- [x] Bootstrap
____
> ###### Back-end
- [x] JavaScript
- [x] Node.js
- [x] Express
____
> ###### Base de datos
- [x] MongoDB
- [x] MongoAtlas
____
> ###### Despliegue
- [x] Railway
____
> ###### Chatbot
- [x] IBM Watson Assistant

---

### Imagenes
<a name="imagenes"></a>
> ###### Fotografías y gráficos gratuitos para uso personal y comercial
- [x] FreeImages.com

---


<br><br><br><br>
##### Copia y pega el codigo generado en la pagina en este documento
`<URL para la documentacion> ` https://pandao.github.io/editor.md/en.html
