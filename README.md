<h1>Proyecto WEB</h1>
<h2>Documentación</h2>

<h3>Índice</h3>
<ul>
    <li><a href="#indice-modulos">Módulos para front-end y back-end</a></li>
    <li><a href="#ejecucion-programa">Cómo ejecutar el programa?</a></li>
</ul>

<h3 id="indice-modulos">Módulos para front-end y back-end</h3>
<ul>
    <li type="radio"><h4 id="bcryptjs">bcryptjs: - 2.4.3</h4></li>
    <li><p>Utilizado para cifrar contraseñas y almacenarlas de forma segura como hashes.</p></li>
    
    <li type="radio"><h4 id="body-parser">body-parser: - 1.20.2</h4></li>
    <li><p>Middleware para procesar el cuerpo de las solicitudes HTTP.</p></li>
    
    <li type="radio"><h4 id="connect-flash">connect-flash: - 0.1.1</h4></li>
    <li><p>Facilita el envío de mensajes entre múltiples vistas, útil para notificar sobre eventos como contraseñas débiles o errores de inicio de sesión.</p></li>
    
    <li type="radio"><h4 id="express">express: - 4.19.2</h4></li>
    <li><p>Framework de Node.js para simplificar la creación de servidores web.</p></li>
    
    <li type="radio"><h4 id="express-session">express-session: - 1.18.0</h4></li>
    <li><p>Almacena temporalmente información de sesión del usuario para mantener la autenticación entre solicitudes.</p></li>
    
    <li type="radio"><h4 id="method-override">method-override: - 3.0.0</h4></li>
    <li><p>Extiende la funcionalidad de los métodos HTTP en formularios web, como PUT y DELETE, para manejar solicitudes que no son compatibles con HTML nativo.</p></li>
    
    <li type="radio"><h4 id="mongoose">mongoose: - 8.2.4</h4></li>
    <li><p>Facilita la interacción con bases de datos MongoDB desde Express, proporcionando una interfaz sencilla para la gestión de modelos y consultas.</p></li>
    
    <li type="radio"><h4 id="passport">passport: - 0.7.0</h4></li>
    <li><p>Middleware de autenticación para Node.js que simplifica el proceso de autenticación de usuarios.</p></li>
    
    <li type="radio"><h4 id="passport-local">passport-local: - 1.0.0</h4></li>
    <li><p>Estrategia de autenticación Passport basada en contraseñas locales, ideal para autenticar usuarios utilizando credenciales almacenadas en una base de datos local.</p></li>
    
    <li type="radio"><h4 id="nodemon">nodemon: - 3.1.0</h4></li>
    <li><p>Herramienta que ayuda a desarrollar aplicaciones basadas en Node.js reiniciando automáticamente la aplicación cuando se detectan cambios en el código fuente.</p></li>
</ul>

<h3 id="ejecucion-programa">Cómo ejecutar el programa</h3>
<p>Para ejecutar el código, simplemente abre la terminal y utiliza el siguiente comando: 'npm run dev'. Este comando ejecuta el código, 
    y lo más interesante es que el servidor se reinicia automáticamente con cada modificación, eliminando la necesidad de reiniciarlo 
    manualmente con 'CTRL + C' y luego ejecutar 'node src/index.js'.</p>
