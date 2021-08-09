# TP Final con NodeJS
Proyecto Final del curso "Desarrollo BackEnd con Node JS" dictado por el Cluster Tecnológico Catamarca - CCT

## Instrucciones

### API endpoints
`GET /`

Muestra el usuario y la contraseña para realizar pruebas

---

`GET /eventos`

Lista todos los eventos ordenados por fecha.

---

`GET /compartirevento`

Devuelve un mensaje con el nombre del evento, la fecha de realización y el link de la url de la imagen asociada.

---

`GET /eventos/{id}`

Lista todos los detalles de un evento.

---

`GET /eventosdestacados`

Lista todos los eventos destacados.

---

`POST /usuario`

Crea un nuevo usuario.

---

`POST /login`

Realiza el login ingresando usuario y contraseña, devolviendo un token para validar la sesión.

---

`POST /usuario/eventos`

Crea un evento (solamente permitido para los usuarios que han realizado un login exitoso).

---

`GET /usuario/eventos/:page?`

Lista los eventos del usuario paginados de a 3 por pagina.

---