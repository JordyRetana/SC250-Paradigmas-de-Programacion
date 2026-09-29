import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { crearCatalogo } from "../src/domain/Libro.js";
import pl from "tau-prolog";
import {
  construirPrograma,
  consultar as ejecutar,
} from "../src/logic/motor.js";

// Usa Prolog para ejecutar las pruebas.
const consultar = (programa, pregunta) => ejecutar(programa, pregunta, pl);

const reglas = readFileSync(
  new URL("../src/logic/biblioteca.pl", import.meta.url),
  "utf8",
);

test("cada objeto mantiene su estado; un doble préstamo se rechaza y se puede devolver", () => {
  const [a, b] = crearCatalogo();
  assert.equal(a.prestar(), "Préstamo realizado.");
  assert.equal(a.disponible, false);
  assert.equal(b.disponible, true);
  assert.equal(a.prestar(), "El libro ya está prestado.");
  assert.throws(() => {
    a.disponible = true;
  }, TypeError);
  assert.equal(a.devolver(), "Devolución realizada.");
  assert.equal(a.devolver(), "El libro ya estaba disponible.");
  assert.equal(a.disponible, true);
});

test("Prolog prueba una consulta concreta y rechaza al usuario sin habilitación", async () => {
  const programa = construirPrograma(reglas, crearCatalogo());
  assert.deepEqual(
    await consultar(programa, "puede_prestar(ana, el_principito)."),
    ["true"],
  );
  assert.deepEqual(
    await consultar(programa, "puede_prestar(lucia, el_principito)."),
    [],
  );
  assert.deepEqual(
    await consultar(programa, "puede_prestar(desconocido, el_principito)."),
    [],
  );
});

test("la variable encuentra todas las alternativas y los préstamos cambian los hechos", async () => {
  const libros = crearCatalogo();
  const buscar = () =>
    consultar(construirPrograma(reglas, libros), "puede_prestar(ana, Libro).");
  assert.equal((await buscar()).length, 3);
  libros[0].prestar();
  const restantes = await buscar();
  assert.equal(restantes.length, 2);
  assert.ok(restantes.every((r) => !r.includes("el_principito")));
  assert.deepEqual(
    await consultar(
      construirPrograma(reglas, libros),
      "puede_prestar(ana, el_principito).",
    ),
    [],
  );
  libros.forEach((l) => l.prestar());
  assert.deepEqual(await buscar(), []);
  libros[0].devolver();
  assert.equal((await buscar()).length, 1);
});

test("los errores de Prolog no se presentan como ausencia de soluciones", async () => {
  await assert.rejects(consultar("esto no es prolog", "true."));
});
