// Guarda los datos del libro y permite prestarlo o devolverlo.
export class Libro {
  #disponible = true;

  constructor(id, titulo, autor) {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
  }

  // Permite consultar la disponibilidad.
  get disponible() {
    return this.#disponible;
  }

  prestar() {
    if (!this.#disponible) {
      return "El libro ya está prestado.";
    }
    this.#disponible = false;
    return "Préstamo realizado.";
  }

  devolver() {
    if (this.#disponible) {
      return "El libro ya estaba disponible.";
    }
    this.#disponible = true;
    return "Devolución realizada.";
  }
}

// Crea los tres libros disponibles.
export function crearCatalogo() {
  return [
    new Libro("el_principito", "El principito", "Antoine de Saint-Exupéry"),
    new Libro("don_quijote", "Don Quijote de la Mancha", "Miguel de Cervantes"),
    new Libro("cuentos_de_mi_tia", "Cuentos de mi tía Panchita", "Carmen Lyra"),
  ];
}
