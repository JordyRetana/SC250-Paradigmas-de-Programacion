import { useState } from "react";
import { crearCatalogo } from "./domain/Libro.js";
import { construirPrograma, consultar } from "./logic/motor.js";
import reglas from "./logic/biblioteca.pl?raw";
import codigoObjetos from "./domain/Libro.js?raw";

const REPO = "https://github.com/JordyRetana/SC250-Paradigmas-de-Programacion";
const usuarios = { ana: "Ana", carlos: "Carlos", lucia: "Lucía" };

// Muestra el catálogo y las consultas.
export default function App() {
  const [vista, setVista] = useState("objetos");
  const [libros, setLibros] = useState(crearCatalogo);
  const [movimientos, setMovimientos] = useState([]);
  const [persona, setPersona] = useState("ana");
  const [seleccion, setSeleccion] = useState("el_principito");
  const [resultado, setResultado] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState("");

  // Prepara los hechos y la pregunta para Prolog.
  const programa = construirPrograma(reglas, libros);
  const pregunta = `puede_prestar(${persona}, ${seleccion === "todos" ? "Libro" : seleccion}).`;

  function mover(libro, operacion) {
    const antes = libro.disponible;
    // Presta o devuelve el libro.
    const mensaje = libro[operacion]();
    setLibros([...libros]);
    setMovimientos((actuales) =>
      [
        {
          titulo: libro.titulo,
          operacion,
          antes,
          despues: libro.disponible,
          mensaje,
        },
        ...actuales,
      ].slice(0, 6),
    );
    setAviso(`${libro.titulo}: ${mensaje}`);
    setResultado(null); // Borra la consulta anterior.
  }

  function reiniciar() {
    setLibros(crearCatalogo());
    setMovimientos([]);
    setResultado(null);
    setAviso("Catálogo reiniciado: los tres libros están disponibles.");
  }

  async function ejecutar(evento) {
    evento.preventDefault();
    setOcupado(true);
    setResultado(null);
    try {
      const respuestas = await consultar(programa, pregunta);
      setResultado({ pregunta, respuestas });
    } catch (error) {
      setResultado({ pregunta, error: error.message });
    } finally {
      setOcupado(false);
    }
  }

  return (
    <>
      <header className="masthead">
        <a className="wordmark" href="#inicio" aria-label="Biblioteca, inicio">
          <span className="mark">B</span> Biblioteca de ejemplos
        </a>
        <span className="course">
          FIDÉLITAS <span aria-hidden="true">/</span> SC-250
        </span>
      </header>
      <main id="inicio">
        <div className="intro">
          <p className="eyebrow">GRUPO 2 · TAREA 1 · EJEMPLOS PRÁCTICOS</p>
          <h1>
            Un catálogo.
            <br className="mobile-break" /> Dos formas de programar.
          </h1>
          <p>
            Prestá un libro con objetos. Consultá las condiciones de préstamo
            con lógica.
          </p>
        </div>
        <nav className="switcher" aria-label="Elegir ejemplo">
          <button
            type="button"
            aria-pressed={vista === "objetos"}
            onClick={() => setVista("objetos")}
          >
            <span>01</span> Orientado a objetos
          </button>
          <button
            type="button"
            aria-pressed={vista === "logico"}
            onClick={() => setVista("logico")}
          >
            <span>02</span> Lógico
          </button>
        </nav>

        {vista === "objetos" ? (
          <section aria-labelledby="titulo-objetos" className="workspace">
            <div className="exercise">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">JAVASCRIPT · CLASE LIBRO</p>
                  <h2 id="titulo-objetos">Mesa de préstamos</h2>
                </div>
                <button className="text-button" onClick={reiniciar}>
                  Reiniciar ejemplo ↺
                </button>
              </div>
              <p className="instructions">
                Cada fila representa un objeto. Probá prestar el mismo libro dos
                veces y después devolverlo.
              </p>
              <div className="catalogue">
                {libros.map((libro, i) => (
                  <article className="book-row" key={libro.id}>
                    <div className={`book-cover cover-${i}`} aria-hidden="true">
                      <span>
                        SC
                        <br />
                        250
                      </span>
                      <strong>
                        {
                          [
                            "El\nprincipito",
                            "Don\nQuijote",
                            "Cuentos\nde mi tía",
                          ][i]
                        }
                      </strong>
                      <small>
                        {["SAINT-EXUPÉRY", "CERVANTES", "CARMEN LYRA"][i]}
                      </small>
                    </div>
                    <div className="book-info">
                      <span className="shelf">EJEMPLAR 00{i + 1}</span>
                      <h3>{libro.titulo}</h3>
                      <p>{libro.autor}</p>
                      <span
                        className={`status ${libro.disponible ? "" : "unavailable"}`}
                      >
                        <span aria-hidden="true">●</span>{" "}
                        {libro.disponible ? "Disponible" : "Prestado"}
                      </span>
                    </div>
                    <div className="book-actions">
                      <button
                        onClick={() => mover(libro, "prestar")}
                        aria-label={`Prestar ${libro.titulo}`}
                      >
                        Prestar
                      </button>
                      <button
                        className="secondary"
                        onClick={() => mover(libro, "devolver")}
                        aria-label={`Devolver ${libro.titulo}`}
                      >
                        Devolver
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <div className="activity">
                <h3>Registro de operaciones</h3>
                <p role="status" className="live-message">
                  {aviso ||
                    "Todavía no hay movimientos. Elegí un libro para empezar."}
                </p>
                {movimientos.length > 0 && (
                  <ol>
                    {movimientos.map((m, i) => (
                      <li key={i}>
                        <code>{m.operacion}()</code>
                        <div>
                          <strong>{m.titulo}</strong>
                          <span>{m.mensaje}</span>
                        </div>
                        <code>
                          {String(m.antes)} → {String(m.despues)}
                        </code>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
            <aside className="notes">
              <p className="eyebrow">QUÉ ESTÁS VIENDO</p>
              <h2>
                Datos y acciones,
                <br />
                en un mismo objeto.
              </h2>
              <dl>
                <dt>Clase</dt>
                <dd>
                  <code>Libro</code> define la estructura común de los
                  ejemplares.
                </dd>
                <dt>Objetos</dt>
                <dd>
                  Los tres libros son instancias independientes de esa clase.
                </dd>
                <dt>Estado encapsulado</dt>
                <dd>
                  <code>#disponible</code> es privado. Se consulta con un getter
                  y se cambia mediante métodos.
                </dd>
                <dt>Comportamiento</dt>
                <dd>
                  <code>prestar()</code> y <code>devolver()</code> controlan las
                  transiciones de estado.
                </dd>
              </dl>
              <p className="try-note">
                <strong>Para comprobarlo</strong>Prestá El principito. Los otros
                dos libros conservan su disponibilidad.
              </p>
              <a
                className="next-example"
                href="#inicio"
                onClick={() => setVista("logico")}
              >
                Consultá ese estado con Prolog →
              </a>
            </aside>
            <Source
              title="Ver el código del ejemplo orientado a objetos"
              filename="src/domain/Libro.js"
              code={codigoObjetos}
            />
          </section>
        ) : (
          <section aria-labelledby="titulo-logico" className="workspace">
            <div className="exercise">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">PROLOG · HECHOS, REGLAS Y CONSULTAS</p>
                  <h2 id="titulo-logico">¿Quién puede pedir un libro?</h2>
                </div>
              </div>
              <p className="instructions">
                Ana y Carlos están activos. Lucía está registrada, pero no está
                habilitada en esta base de conocimiento.
              </p>
              <form onSubmit={ejecutar} className="query-form">
                <div className="fields">
                  <label>
                    Persona
                    <select
                      value={persona}
                      onChange={(e) => {
                        setPersona(e.target.value);
                        setResultado(null);
                      }}
                      disabled={ocupado}
                    >
                      {Object.entries(usuarios).map(([id, nombre]) => (
                        <option key={id} value={id}>
                          {nombre}
                          {id === "lucia" ? " (sin habilitación)" : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Libro
                    <select
                      value={seleccion}
                      onChange={(e) => {
                        setSeleccion(e.target.value);
                        setResultado(null);
                      }}
                      disabled={ocupado}
                    >
                      {libros.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.titulo}
                        </option>
                      ))}
                      <option value="todos">
                        Todos los libros disponibles
                      </option>
                    </select>
                  </label>
                </div>
                <div className="query-line">
                  <span aria-hidden="true">?-</span>
                  <code>{pregunta}</code>
                </div>
                <button type="submit" disabled={ocupado}>
                  {ocupado ? "Consultando…" : "Ejecutar consulta"}{" "}
                  <span aria-hidden="true">→</span>
                </button>
              </form>
              <div className="result" aria-live="polite" aria-busy={ocupado}>
                <p className="eyebrow">RESPUESTA DEL INTÉRPRETE</p>
                {!resultado ? (
                  <p className="empty-result">
                    Ejecutá la consulta para buscar una solución.
                  </p>
                ) : resultado.error ? (
                  <>
                    <h3>No se pudo completar</h3>
                    <p>{resultado.error}</p>
                  </>
                ) : (
                  <>
                    <h3>
                      {resultado.respuestas.length
                        ? seleccion === "todos"
                          ? `${resultado.respuestas.length} libro${resultado.respuestas.length === 1 ? "" : "s"} disponible${resultado.respuestas.length === 1 ? "" : "s"}`
                          : "Préstamo permitido"
                        : "No se puede demostrar el préstamo"}
                    </h3>
                    <pre>
                      {resultado.respuestas.length
                        ? resultado.respuestas.join("\n")
                        : "false."}
                    </pre>
                    <p>
                      {resultado.respuestas.length
                        ? "Prolog encontró soluciones que cumplen todos los objetivos de la regla."
                        : "La consulta no tiene soluciones con los hechos actuales: se requiere un usuario activo y un libro disponible."}
                    </p>
                  </>
                )}
              </div>
              <div className="facts">
                <h3>Estado actual del catálogo</h3>
                {libros.map((l) => (
                  <div key={l.id}>
                    <span>{l.titulo}</span>
                    <span
                      className={`status ${l.disponible ? "" : "unavailable"}`}
                    >
                      {l.disponible ? "Disponible" : "Prestado"}
                    </span>
                  </div>
                ))}
                <p>
                  Los préstamos de la pestaña 01 se reflejan aquí. Esta consulta
                  no presta ni devuelve libros.
                </p>
              </div>
            </div>
            <aside className="notes">
              <p className="eyebrow">CÓMO SE RESUELVE</p>
              <h2>
                Declarás condiciones.
                <br />
                Prolog busca soluciones.
              </h2>
              <dl>
                <dt>Hechos</dt>
                <dd>
                  <code>usuario(ana).</code>, <code>activo(ana).</code> y los
                  estados de los libros describen lo conocido.
                </dd>
                <dt>Regla</dt>
                <dd>
                  Una persona puede pedir un libro si está registrada, está
                  activa y el libro está disponible.
                </dd>
                <dt>Consulta</dt>
                <dd>
                  Una pregunta concreta devuelve <code>true</code> o{" "}
                  <code>false</code>. La variable <code>Libro</code> permite
                  buscar alternativas.
                </dd>
                <dt>Inferencia y retroceso</dt>
                <dd>
                  El motor unifica la consulta con la regla y explora los hechos
                  para encontrar todas las respuestas.
                </dd>
              </dl>
              <p className="try-note">
                <strong>Para comprobarlo</strong>Consultá todos los libros para
                Ana. Después probá con Lucía y compará las respuestas.
              </p>
            </aside>
            <Source
              title="Ver los hechos y la regla que se ejecutan"
              filename="src/logic/biblioteca.pl + estados del catálogo"
              code={programa}
            />
          </section>
        )}
        <section
          className="comparison"
          aria-label="Comparación de los ejemplos"
        >
          <div>
            <span className="eyebrow">01 / OBJETOS</span>
            <p>
              El método <code>prestar()</code> cambia el estado de un libro.
            </p>
          </div>
          <div>
            <span className="eyebrow">02 / LÓGICA</span>
            <p>
              La consulta <code>puede_prestar/2</code> deduce qué préstamos
              cumplen las condiciones.
            </p>
          </div>
        </section>
      </main>
      <footer>
        <p>
          SC-250 · Paradigmas de Programación
        </p>
        <div>
          <a href={REPO}>Código y README ↗</a>
        </div>
      </footer>
    </>
  );
}

// Muestra el código del ejemplo.
function Source({ title, filename, code }) {
  return (
    <details className="source">
      <summary>
        {title}
        <span aria-hidden="true"> +</span>
      </summary>
      <p>{filename}</p>
      <pre>
        <code>{code}</code>
      </pre>
    </details>
  );
}
