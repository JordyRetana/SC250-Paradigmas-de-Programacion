// Agrega el estado de los libros a las reglas de Prolog.
export function construirPrograma(reglas, libros) {
  const hechos = libros.map((libro) => {
    // Comprueba que el identificador sea válido en Prolog.
    if (!/^[a-z][a-z0-9_]*$/.test(libro.id)) {
      throw new Error("Identificador de libro inválido.");
    }
    const estado = libro.disponible ? "disponible" : "prestado";
    return `estado(${libro.id}, ${estado}).`;
  });
  return `${reglas}\n${hechos.join("\n")}\n`;
}

// Ejecuta la consulta y devuelve todas las respuestas.
export function consultar(programa, pregunta, interprete = globalThis.pl) {
  return new Promise((resolve, reject) => {
    if (!interprete) {
      reject(
        new Error("No se pudo cargar el intérprete Prolog. Recargá la página."),
      );
      return;
    }
    const sesion = interprete.create(10000);
    const respuestas = [];
    const error = (detalle) => reject(new Error(String(detalle)));
    const siguiente = () =>
      sesion.answer({
        success: (respuesta) => {
          respuestas.push(sesion.format_answer(respuesta));
          siguiente();
        },
        fail: () => resolve(respuestas),
        error,
        limit: () => reject(new Error("Se alcanzó el límite de inferencias.")),
      });
    sesion.consult(programa, {
      success: () => sesion.query(pregunta, { success: siguiente, error }),
      error,
    });
  });
}
