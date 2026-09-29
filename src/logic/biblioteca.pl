% Usuarios registrados.
usuario(ana).
usuario(carlos).
usuario(lucia).
% Usuarios habilitados para pedir libros.
activo(ana).
activo(carlos).

% Permite el préstamo a usuarios activos si el libro está disponible.
puede_prestar(Persona, Libro) :-
    usuario(Persona),
    activo(Persona),
    estado(Libro, disponible).

% motor.js agrega el estado actual de cada libro.
