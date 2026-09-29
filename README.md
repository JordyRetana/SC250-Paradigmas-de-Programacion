# SC-250 · Paradigmas de Programación

Ejemplos prácticos del **Grupo 2** para la Tarea 1, Universidad Fidélitas.
Una biblioteca permite comparar programación orientada a objetos y lógica.

**[Abrir la demostración](https://JordyRetana.github.io/SC250-Paradigmas-de-Programacion/)**

## Qué demuestra

- **Objetos (JavaScript):** cada `Libro` tiene estado privado y métodos `prestar()` / `devolver()`. Probá prestar dos veces el mismo ejemplar.
- **Lógico (Prolog):** hechos y una regla determinan si un usuario activo puede pedir un libro disponible. Elegí Ana y luego Lucía; usá “Todos los libros disponibles” para ver varias soluciones.
- **React** dibuja la interfaz. **Tau Prolog** ejecuta las consultas reales; los préstamos del primer ejemplo actualizan los hechos del segundo. Consultar no registra un préstamo.

## Ejecutar localmente

Requiere Node.js 24 y npm. Desde la carpeta del proyecto:

```sh
npm ci
npm run dev
```

Abrí la dirección que muestre Vite. `npm test` verifica ambos paradigmas;
`npm run build` genera `dist/`. GitHub Actions prueba y publica cada cambio en `main`.

## Dónde leer el código

| Archivo                    | Responsabilidad                                           |
| -------------------------- | --------------------------------------------------------- |
| `src/domain/Libro.js`      | Clase, encapsulación y objetos del catálogo.              |
| `src/logic/biblioteca.pl`  | Hechos de usuarios y regla de préstamo.                   |
| `src/logic/motor.js`       | Traducción del estado a hechos y ejecución de Tau Prolog. |
| `src/App.jsx`              | Controles, resultados y explicación de los ejemplos.      |
| `tests/paradigmas.test.js` | Pruebas de estado, consultas, alternativas y errores.     |

Los comentarios explican las decisiones principales. La página permite desplegar
el código real de ambos ejemplos. Los datos son de demostración, viven en memoria
y se reinician al recargar; no es un sistema de préstamos multiusuario.
El botón del ejemplo 01 demuestra cambios de estado sin validar usuarios;
el ejemplo 02 demuestra la elegibilidad sin ejecutar la operación de préstamo.
