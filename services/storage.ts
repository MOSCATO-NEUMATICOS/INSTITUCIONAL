
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, limit, updateDoc } from 'firebase/firestore';
import { Manual, NewsItem, FeedbackItem, ManualCategory, VisitRecord, EmployeeCourse, RecommendedCourse, IpAlias, Supplier } from '../types';

// --- CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyB-gOKzbpoE9AZo2NVjJYmdeupjbrWWK7U",
  authDomain: "moscato-c178a.firebaseapp.com",
  projectId: "moscato-c178a",
  storageBucket: "moscato-c178a.firebasestorage.app",
  messagingSenderId: "814979149684",
  appId: "1:814979149684:web:e55135fc457791ccaf4621",
  measurementId: "G-H7615W5F0M"
};

// Check if Firebase is configured (keys are not empty)
const isFirebaseConfigured = firebaseConfig.apiKey !== "";

let db: any = null;

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("✅ Conectado a Firebase Cloud (Moscato Neumáticos)");
  } catch (error) {
    console.error("Error inicializando Firebase:", error);
  }
} else {
  console.log("Firebase no configurado. Usando LocalStorage (Modo Offline/Local).");
}

// --- LOCAL STORAGE KEYS (Updated to v2 to force refresh) ---
const STORAGE_KEYS = {
  MANUALS: 'moscato_portal_manuals_v2',
  NEWS: 'moscato_portal_news_v2',
  FEEDBACK: 'moscato_portal_feedback_v2',
  EMPLOYEE_COURSES: 'moscato_portal_emp_courses_v1',
  RECOMMENDED_COURSES: 'moscato_portal_rec_courses_v1',
  IP_ALIASES: 'moscato_portal_ip_aliases_v1',
  SUPPLIERS: 'moscato_portal_suppliers_v1',
};

// --- INITIAL DATA FALLBACK ---
const INITIAL_MANUALS: Manual[] = [
  {
    id: '1',
    title: 'Reparación de Ruedas (Pinchadura Sin Cámara)',
    category: ManualCategory.TALLER,
    description: 'Objetivo, herramientas y paso a paso para la reparación segura de neumáticos tubeless.',
    lastUpdated: '26/02/2025',
    textContent: `REPARACIÓN DE RUEDAS MOSCATO
(PINCHADURA, SIN CÁMARA)

1. Objetivo
Estandarizar la reparación de neumáticos sin cámara, asegurando seguridad, durabilidad y calidad en el servicio.

2. Alcance
Aplica únicamente a neumáticos sin cámara de autos, utilitarios y SUV.
No incluye neumáticos con cámara, camiones ni motocicletas.

3. Herramientas necesarias
- Desarmadora de neumáticos
- Torno neumático para pulir interior
- Kit de parches (según tipo y tamaño de rotura)
- Cemento en frío
- Inflador y manómetro
- Recipiente con agua para prueba de pérdidas
- EPP obligatorio: Zapatos de seguridad, Faja lumbar (si se manipulan ruedas pesadas)

4. Pasos del procedimiento
1. Retirar la rueda del vehículo.
2. Inflar el neumático y revisar en agua si la pérdida no es evidente.
3. Marcar la zona de la pérdida y la ubicación del pico.
4. Desarmar el neumático con la desarmadora.
5. Inspeccionar interior y exterior.
 - Si la rotura está en el lateral: el técnico evalúa si es reparable con seguridad; en caso de duda, consulta al jefe de taller.
6. Pulir la superficie interior con torno neumático.
7. Aplicar cemento en frío y dejar actuar el tiempo necesario (2 a 3 minutos).
8. Colocar el parche indicado según el tipo y tamaño de la rotura.
9. Vulcanizar con presión utilizando rodillo.
10. Montar el neumático en la llanta en su posición original.
11. Inflar y sumergir en agua para confirmar ausencia de pérdidas.
12. Ajustar a presión recomendada.
13. Colocar la rueda en el vehículo.
14. Ajustar tuercas en cruz y dar torque final con el vehículo en el piso.
15. Calibrar el resto de los neumáticos a presión recomendada.

5. Seguridad
- Revisar en agua siempre al final, y al inicio solo si es necesario.
- Usar el parche correcto según el tipo de daño.
- No reparar neumáticos con roturas laterales que no sean seguras.
- Trabajar en lugar ventilado al usar cemento en frío.

6. Tiempo estimado
15 a 20 minutos por rueda.

7. Control de calidad
- Confirmar ausencia de pérdidas (prueba final en agua).
- Presión correcta.
- Torque verificado.
- Reparación registrada en la orden de trabajo.`
  },
  {
    id: '2',
    title: 'Procedimiento de Alineación 3D',
    category: ManualCategory.TALLER,
    description: 'Protocolo completo (Know How) para el alineador: preparación, medición y ajustes.',
    lastUpdated: '26/02/2025',
    textContent: `KNOW HOW – PROCEDIMIENTO DE ALINEACIÓN 3D
Rol responsable: Alineador
Alcance: desde el ingreso del vehículo al elevador de alineación hasta la entrega del informe impreso.

1. Preparación del vehículo y seguridad
1. Verificar que el vehículo tenga orden de trabajo asignada.
2. Colocar el vehículo en el elevador de alineación.
3. Revisar visualmente el estado de los neumáticos:
 - Desgaste irregular (interno, externo, en forma de “serrucho”).
 - Daños visibles (cortes, abultamientos, etc.).
 ⚠️ Si se detecta desgaste anormal → realizar revisión de tren delantero en el mismo elevador de la alineadora y registrar observaciones.
7. Informar a administración para evaluar presupuesto y comunicar al cliente.
8. NO accionar freno de mano (es necesario poder moverlo para el alabeo).
9. Colocar el bloqueador de volante si es necesario para mantenerlo centrado.
10. Tener a mano el bloqueador de pedal de freno (se usa solo en la etapa final de ajustes si la alineadora lo requiere).
11. Elevar el vehículo según corresponda (si el equipo lo requiere).

2. Colocación de sensores
12. Instalar las garras en cada llanta asegurando correcta fijación.
13. Colocar los sensores/targets de la alineadora 3D en las cuatro ruedas.
14. Verificar en pantalla que los sensores estén reconocidos y calibrados.

3. Compensación inicial (alabeo)
15. Seguir procedimiento de la alineadora para realizar compensación de rodadura.
16. Confirmar que todos los valores iniciales se hayan registrado correctamente.

4. Medición y diagnóstico
17. Registrar mediciones de: Convergencia delantera y trasera, Caída, Avance, Ángulo de empuje, y otros parámetros.
18. Comparar con valores de referencia cargados en la máquina.
19. Si hay desviaciones graves que no puedan corregirse, detener el procedimiento e informar a administración.

5. Ajustes
20. Aflojar y ajustar según corresponda: convergencia delantera, convergencia trasera (si aplica), caída y avance (si son regulables).
21. Aplicar el par de apriete adecuado en todas las fijaciones.
22. Repetir mediciones después de cada ajuste hasta lograr valores dentro de tolerancia.

6. Control final
23. Revisar nuevamente que el volante esté centrado.
24. Confirmar en pantalla que todos los valores estén dentro de rango.
25. Imprimir el informe final desde la alineadora.
26. Colocar el informe dentro del vehículo (en el asiento del acompañante).
27. Pegar sticker con fecha del servicio y km actual + 10.000 en el parante de la puerta debajo de la cerradura.
28. Colocar una bolsa para residuos en la palanca de cambios.
29. Retirar bloqueador de volante (si se usó) y bloqueador de pedal de freno.
30. Bajar el vehículo del elevador.
31. Realizar una prueba de manejo corta para verificar volante derecho, que no se desvíe y sin ruidos anormales.

7. Entrega del vehículo
32. Dejar el vehículo listo para administración (entregando orden de trabajo firmada) o para el siguiente trabajo en playa.
33. Si el cliente está presente y consulta, explicar brevemente el resultado usando el informe impreso de ser necesario.

Notas internas
• Mantener limpio y calibrado el equipo de alineación.
• Revisar periódicamente el estado de las garras para no dañar llantas.
• Cualquier inconveniente técnico con la alineadora debe informarse de inmediato.`
  },
  {
    id: '3',
    title: 'Balanceo de Ruedas',
    category: ManualCategory.TALLER,
    description: 'Procedimiento estándar para evitar vibraciones. Tipos de plomos y control de calidad.',
    lastUpdated: '26/02/2025',
    textContent: `BALANCEO DE RUEDAS

1. Objetivo
Estandarizar el procedimiento de balanceo de ruedas para garantizar un rodado seguro, sin vibraciones y con mayor durabilidad de neumáticos y suspensión.

2. Alcance
Aplica a ruedas de autos, utilitarios y SUV.
No incluye vehículos pesados ni motocicletas.

3. Herramientas necesarias
- Balanceadora de ruedas
- Plomos para balancear (adhesivos o de clip, según llanta)
- Pinza para plomos (colocar/retirar)
- Inflador y manómetro
- Trapo limpio y alcohol (para limpieza de llantas en caso de plomos adhesivos)
- EPP obligatorio: Zapatos de seguridad, Faja lumbar (si se manipulan ruedas pesadas)

4. Pasos del procedimiento
1. Retirar la rueda del vehículo.
2. Verificar presión de inflado y ajustarla a la recomendada antes del balanceo.
3. Colocar la rueda en la balanceadora, asegurando que quede bien centrada.
4. Ingresar medidas necesarias en la máquina (ancho, diámetro, distancia).
5. Hacer girar la rueda y esperar lectura de la máquina.
6. Colocar los plomos donde indique el equipo:
 - Adhesivos: limpiar bien la superficie de la llanta con trapo y alcohol antes de pegarlos.
 - De clip: usar la pinza para plomos.
9. Repetir medición hasta que la máquina marque 0–0 (o dentro de la tolerancia 5).
10. Retirar la rueda de la balanceadora.
11. Montar la rueda en el vehículo.
12. Ajustar tuercas en cruz y dar torque final con el vehículo en el piso.

Siempre respetar orden de ajuste:
1. Delantera izquierda
2. Delantera derecha
3. Trasera derecha
4. Trasera izquierda

5. Seguridad
- Revisar que la rueda esté bien fijada en la balanceadora antes de encenderla.
- Usar plomos adecuados al tipo de llanta (adhesivos o de clip).
- Limpiar bien la zona antes de colocar plomos adhesivos.

6. Tiempo estimado
8 - 10 minutos por rueda.

7. Control de calidad
- Confirmar que la máquina marque dentro de tolerancia (0–0).
- Verificar que los plomos estén firmes (no flojos ni mal pegados).
- Registrar el servicio en la orden de trabajo.`
  },
  {
    id: '4',
    title: 'Cambio de Neumáticos',
    category: ManualCategory.TALLER,
    description: 'Guía paso a paso para el desmontaje y montaje seguro, incluyendo orden de torque.',
    lastUpdated: '26/02/2025',
    textContent: `CAMBIO DE NEUMÁTICOS

1. Objetivo
Estandarizar el procedimiento de cambio de neumáticos para asegurar seguridad, rapidez y calidad del servicio.

2. Alcance
Aplica a autos, utilitarios y SUV.
No incluye camiones ni motocicletas.

3. Herramientas necesarias
- Gato o elevador hidráulico
- Llave de impacto y llave cruz
- Desarmadora de neumáticos
- Balanceadora de ruedas
- Inflador y manómetro
- EPP obligatorio: Zapatos de seguridad, Faja lumbar (si se manipulan ruedas pesadas)

4. Pasos del procedimiento
1. Aflojar tuercas con el vehículo apoyado en el piso.
2. Levantar el vehículo de forma segura con gato o elevador.
3. Retirar la rueda.
4. Desarmar neumático con la desarmadora.
5. Revisar llanta y válvula; reemplazar válvula si es necesario.
6. Montar neumático nuevo (o reparado).
7. Si el neumático es nuevo → balancear la rueda.
8. Inflar a presión recomendada.
9. Colocar la rueda en el vehículo.
10. Ajustar tuercas en cruz (preajuste con pistola o llave).
11. Bajar el vehículo al piso.
12. Ajustar tuercas en cruz y dar torque final con el vehículo en el piso.

Siempre respetar orden de ajuste:
1. Delantera izquierda
2. Delantera derecha
3. Trasera derecha
4. Trasera izquierda

5. Seguridad
- Verificar que el gato o elevador esté bien apoyado antes de retirar la rueda.
- No permanecer debajo del vehículo sostenido solo por el gato.
- Usar zapatos de seguridad y faja lumbar para maniobras pesadas.

6. Tiempo estimado
8 a 12 minutos por rueda (con balanceo incluido en caso de neumáticos nuevos).

7. Control de calidad
- Confirmar presión con manómetro calibrado.
- Balanceo correcto en caso de neumáticos nuevos.
- Revisar que todas las tuercas estén firmes.
- Registrar el trabajo en la orden de servicio.`
  },
  {
    id: '5',
    title: 'Cambio de Válvulas TPMS (Chevrolet y Ford)',
    category: ManualCategory.TALLER,
    description: 'Procedimiento de reaprendizaje de sensores y cambio de válvulas de goma.',
    lastUpdated: '26/02/2025',
    textContent: `CAMBIO DE VÁLVULAS TPMS (CHEVROLET Y FORD)

1. Objetivo
Estandarizar el procedimiento de cambio de válvulas TPMS de goma en vehículos Chevrolet y Ford, asegurando el correcto reaprendizaje del sistema y el funcionamiento de los sensores.

2. Alcance
Aplica a vehículos Chevrolet y Ford equipados con sensores TPMS de válvula de goma.
No aplica a sensores de banda interna ni sistemas TPMS externos.

3. Herramientas necesarias
- Aparato/programador TPMS para reaprendizaje
- Herramienta para retirar e instalar óvulo (núcleo de la válvula)
- Desarmadora de neumáticos
- Inflador y manómetro
- EPP obligatorio: Zapatos de seguridad, Faja lumbar (si se manipulan ruedas pesadas)

4. Pasos del procedimiento

Chequeo inicial – Identificación del sensor defectuoso
1. Siempre realizar un reaprendizaje inicial para confirmar qué sensor no está reconociendo.
 - Esto evita cambiar una válvula que no corresponde.
2. Una vez identificado el sensor defectuoso → proceder al cambio.

Procedimiento de reaprendizaje

Chevrolet
- Poner el auto en marcha, en Parking o Neutro, con freno de mano colocado.
- Usar el comando del volante para ir a la pantalla de presiones de neumáticos.
- Mantener presionado el botón OK / tilde unos 10 segundos hasta que aparezca el mensaje de inicio de reaprendizaje (o suenen 2 bocinas).
- El sistema pedirá sensar en este orden: 1) Delantera izquierda 2) Delantera derecha 3) Trasera derecha 4) Trasera izquierda.
- La baliza encendida indica qué rueda corresponde.
- Para activar: acercar el aparato TPMS al pico y presionar el botón.
- Cada sensor reconocido hace sonar 1 bocina.
- Al finalizar el reaprendizaje suenan 2 bocinas como confirmación.

Ford
- Poner el vehículo en Parking o Neutro, con freno de mano colocado.
- Pisar y soltar el pedal de freno.
- Poner y sacar contacto 3 veces seguidas, terminando con contacto puesto.
- Pisar y soltar el freno nuevamente.
- Repetir los 3 ciclos de contacto (poner/sacar), terminando en contacto puesto.
- Sonará 1 bocina y el tablero indicará inicio de reaprendizaje.
- El tablero marcará comenzar con el neumático delantero izquierdo.
- Orden de sensores: 1) Delantera izquierda 2) Delantera derecha 3) Trasera derecha 4) Trasera izquierda.
- Activar sensor con el aparato TPMS en el pico.
- Cada sensor reconocido hace sonar 1 bocina.
- Al finalizar suenan 2 bocinas de confirmación.

⚠️ En algunos casos, ciertos modelos Ford no permiten realizar este aprendizaje de manera manual y es necesario conectar el scanner por OBD2. En ese caso, consultar con el jefe de taller.

Cambio de válvula
- Retirar la rueda del vehículo correspondiente.
- Desinflar el neumático retirando el óvulo.
- Desarmar con la desarmadora hasta acceder a la válvula TPMS.
- Retirar válvula defectuosa.
- Colocar válvula nueva de goma compatible con TPMS.
- Reinstalar óvulo e inflar a presión recomendada.

Reaprendizaje final
- Ejecutar el procedimiento de reaprendizaje según marca (Chevrolet o Ford).
- Confirmar que los 4 sensores fueron reconocidos (4 bocinas → 1 por cada rueda).
- Confirmar las 2 bocinas finales de confirmación.
- Revisar que el tablero muestre las presiones de los 4 neumáticos sin fallas.

5. Seguridad
- Siempre identificar el sensor defectuoso antes de desarmar.
- Desinflar el neumático antes de desmontar la válvula.
- No usar herramientas que puedan dañar el sensor.
- Confirmar presión correcta antes de liberar el vehículo.

6. Tiempo estimado
20 a 25 minutos por válvula (incluyendo reaprendizaje).

7. Control de calidad
- Confirmar presión en las cuatro ruedas.
- Verificar que todos los sensores transmitan correctamente en tablero.
- Escuchar las 2 bocinas finales que confirman el reaprendizaje.
- Registrar el cambio en la orden de trabajo.`
  },
  {
    id: '6',
    title: 'Guía de Trabajo - Sucursal Moscato',
    category: ManualCategory.ADMINISTRACION,
    description: 'Manual de convivencia, atención al cliente, orden y comunicación interna del equipo.',
    lastUpdated: '26/02/2025',
    textContent: `Guía de trabajo – Sucursal Moscato

1. Atención al cliente
- Saludamos siempre con buena onda, aunque estemos a mil.
- Escuchamos con atención lo que el cliente necesita.
- Explicamos con claridad: no usamos jerga técnica si no hace falta.
- Si hay algo que no se puede hacer en el momento, se le ofrece turno y se deja bien anotado.
- Siempre se intenta resolver el problema del cliente, o al menos dejarle una solución clara.

2. Manera de trabajar en el taller
- Revisamos bien cada vehículo antes de intervenir.
- Se anotan las observaciones que puedan servir para futuros controles.
- Si hay algo que no está dentro del trabajo pedido pero conviene avisar, se le informa al cliente con respeto.
- Usamos herramientas con cuidado y las devolvemos a su lugar.
- Se prioriza la prolijidad y el trabajo bien hecho, aunque tome un poco más.

3. Tareas administrativas básicas
- Todo trabajo que entra, se registra en el sistema.
- Se emite la factura con los datos correctos.
- Se actualiza la historia clínica del vehículo con el trabajo realizado.
- Se lleva control de pagos (si es contado) o se registra bien si es cuenta corriente.
- Las dudas se consultan, no se improvisa.

4. Orden y limpieza
- Cada uno deja su puesto limpio al terminar un trabajo.
- Se limpian las herramientas y se acomodan.
- La playa de trabajo tiene que estar lo más presentable posible, siempre.
- Las oficinas también: papeles ordenados, escritorios limpios.

5. Resolución de problemas
- Si hay un reclamo o una situación complicada, primero se escucha.
- Se trata de resolver rápido y sin discutir.
- Si no se puede resolver en el momento, se consulta con Marcos, Diego o quien este a cargo.
- Nunca se promete algo que no se puede cumplir.

6. Comunicación interna
- Se informa todo lo importante entre compañeros: trabajos pendientes, clientes que vuelven, problemas detectados.
- Se mantiene el respeto y el compañerismo, siempre.
- Lo que se acuerda, se cumple.`
  },
  {
    id: '7',
    title: 'Políticas de Garantía',
    category: ManualCategory.ADMINISTRACION,
    description: 'Condiciones, plazos y exclusiones para garantías de neumáticos, alineación y tren delantero.',
    lastUpdated: '26/02/2025',
    textContent: `Políticas de Garantía – Moscato Neumáticos

1. Alcance de la garantía
- La garantía aplica únicamente a los trabajos realizados en Moscato Neumáticos y a las piezas provistas por nuestro taller.
- No se cubren trabajos realizados fuera de nuestro taller ni piezas aportadas por el cliente.

2. Plazos de garantía
- Neumáticos: Garantía de fábrica según lo indicado por el proveedor (defectos de fabricación).
- Balanceo y colocación de neumáticos: 30 días o 1.000 km, lo que ocurra primero.
- Alineación: 30 días o 1.000 km, salvo golpes, baches o accidentes.
- Reparaciones de tren delantero / suspensión: 3 meses o 5.000 km, siempre que las piezas no presenten desgaste normal o mal uso.
- Reparación de neumáticos: Garantía de 15 días únicamente sobre la reparación realizada (no sobre el neumático completo).

3. Condiciones para hacer válida la garantía
- Presentar factura o comprobante de la operación.
- El vehículo debe ser revisado en Moscato Neumáticos sin intervención previa de terceros.
- La pieza o servicio debe mostrar falla por defecto de fabricación o mala instalación.
- La garantía no aplica cuando las piezas hayan sido provistas por el cliente.

4. Exclusiones
- Golpes, baches, choques o accidentes.
- Desgaste normal por uso.
- Intervención de terceros en la reparación o modificación del trabajo.
- Uso inadecuado del vehículo (sobrecarga, falta de mantenimiento, presión incorrecta de neumáticos, etc.).
- Piezas no provistas por Moscato Neumáticos.

5. Procedimiento de reclamo
- El cliente debe acercarse al taller con el vehículo y la factura.
- El encargado revisará el caso y determinará si corresponde aplicar garantía.
- Si corresponde, se realizará la reparación o reemplazo sin costo adicional.
- Si no corresponde, se explicará al cliente el motivo por escrito.

6. Limitaciones de responsabilidad
- La garantía cubre únicamente la reparación o el reemplazo de la pieza/servicio fallado.
- No cubre gastos adicionales como remolques, traslados o daños indirectos.`
  },
  {
    id: '8',
    title: 'Instructivo: Carga de Clientes (WhatsApp)',
    category: ManualCategory.VENTAS,
    description: 'Normas para agendar contactos con códigos de fecha (ej: ENE25) para listas de difusión.',
    lastUpdated: '26/02/2025',
    textContent: `Cómo cargar clientes en WhatsApp usando códigos de fecha (ENE25, FEB25, etc.)

Objetivo
Crear un sistema ordenado para nombrar contactos de WhatsApp y poder usar listas de difusión sin confusiones.

1. ¿Qué código usamos?
Usamos un código de 5 caracteres: MMMYY → las tres letras del mes + dos dígitos del año.
Ejemplos:
- ENE25
- FEB25
- NOV25

2. ¿Dónde colocamos el código?
Siempre al final del nombre del contacto.
Ejemplos:
- Juan Pérez ENE25
- Corolla Blanco FEB25
- Romina HRV NOV25

3. ¿Cuando asignamos el código?
- Cada vez que cargamos un contacto nuevo.
- Siempre usamos el mes actual.
- El código no se modifica cuando el cliente vuelve.

4. ¿Para qué sirve el código?
- Crear listas de difusión por mes.
- Saber cuántos contactos cargamos cada mes.
- Segmentar clientes.
- Ordenar búsquedas dentro de WhatsApp.

5. Reglas básicas
1. Mayúsculas siempre.
2. Sin guiones: ENE25, no ENE-25.
3. Abreviaciones fijas: ENE, FEB, MAR, ABR, MAY, JUN, JUL, AGO, SEP, OCT, NOV, DIC.
4. Sin símbolos ni espacios raros.
5. El código va siempre al final.

6. Ejemplos correctos e incorrectos
Correcto:
- Hilux Gris 2020 MAR25
- Carlos Gómez JUL25
Incorrecto:
- ENE25 Carlos
- Carlos-Gómez-ENE25
- CGL25
- Carlos (sin código)

7. Tip rápido para renombrar
Abrir contacto → Editar → Agregar código → Guardar.

8. Explicación corta para el equipo
“Cuando cargues un cliente nuevo en WhatsApp, agregale al final del nombre un código del mes y año actual (ej.: MAR25). Ese código sirve para ordenar contactos y crear listas de difusión.”`
  }
];

// --- INITIAL RECOMMENDATIONS ---
const INITIAL_RECOMMENDED: RecommendedCourse[] = [
  { id: '1', title: 'Goodyear Learning Center', platform: 'Goodyear', description: 'Capacitación oficial sobre productos y tecnología de neumáticos.', link: 'https://www.goodyeartrucktires.com/learning-center/' },
  { id: '2', title: 'Curso de Mecánica Básica', platform: 'YouTube', description: 'Fundamentos de tren delantero y frenos.', link: 'https://www.youtube.com' }
];

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'Corven', discountChain: '35+10', margin: 40, marginBase: 'cost', addIva: true },
  { id: '2', name: 'Monroe', discountChain: '40+5', margin: 45, marginBase: 'cost', addIva: true },
  { id: '3', name: 'Fric-Rot', discountChain: '30+10+5', margin: 40, marginBase: 'cost', addIva: true },
];

// --- HELPERS ---
function getLocal<T>(key: string, defaultData: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  } catch {
    return defaultData;
  }
}

function setLocal(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Helper to handle and log Firebase errors friendly
const handleFirebaseError = (e: any, context: string) => {
  console.error(`Error en ${context}:`, e);
  
  // Detectar si la API no está habilitada
  if (e.message?.includes('Cloud Firestore API') || e.code === 'permission-denied') {
    console.warn(`
      🚨 ATENCIÓN: La base de datos no está habilitada en Firebase Console.
      
      PASOS PARA SOLUCIONAR:
      1. Entra a https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore
      2. Haz clic en "Crear base de datos"
      3. Selecciona "Modo de prueba" (Test mode) y Habilitar.
    `);
  }
};

// --- STORAGE SERVICE ---
export const storageService = {
  
  // --- MANUALS ---
  async getManuals(): Promise<Manual[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "manuals"));
        const querySnapshot = await getDocs(q);
        const manuals = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Manual));
        // If empty, return INITIAL DATA so user sees the 5 manuals
        return manuals.length > 0 ? manuals : getLocal(STORAGE_KEYS.MANUALS, INITIAL_MANUALS);
      } catch (e) {
        handleFirebaseError(e, 'getManuals');
        return getLocal(STORAGE_KEYS.MANUALS, INITIAL_MANUALS);
      }
    }
    return getLocal(STORAGE_KEYS.MANUALS, INITIAL_MANUALS);
  },

  async addManual(manual: Manual): Promise<Manual> {
    if (isFirebaseConfigured && db) {
      try {
        const { id, ...data } = manual; 
        const docRef = await addDoc(collection(db, "manuals"), data);
        return { ...manual, id: docRef.id };
      } catch (e) {
        handleFirebaseError(e, 'addManual');
      }
    }
    const current = getLocal<Manual[]>(STORAGE_KEYS.MANUALS, INITIAL_MANUALS);
    const updated = [manual, ...current];
    setLocal(STORAGE_KEYS.MANUALS, updated);
    return manual;
  },

  async deleteManual(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "manuals", id));
        return;
      } catch(e) { handleFirebaseError(e, 'deleteManual'); }
    }
    const current = getLocal<Manual[]>(STORAGE_KEYS.MANUALS, []);
    setLocal(STORAGE_KEYS.MANUALS, current.filter(m => m.id !== id));
  },

  // --- NEWS ---
  async getNews(): Promise<NewsItem[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "news"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
      } catch (e) { handleFirebaseError(e, 'getNews'); }
    }
    return getLocal<NewsItem[]>(STORAGE_KEYS.NEWS, []);
  },

  async addNews(item: NewsItem): Promise<NewsItem> {
    if (isFirebaseConfigured && db) {
      try {
        const { id, ...data } = item;
        const docRef = await addDoc(collection(db, "news"), data);
        return { ...item, id: docRef.id };
      } catch (e) { handleFirebaseError(e, 'addNews'); }
    }
    const current = getLocal<NewsItem[]>(STORAGE_KEYS.NEWS, []);
    setLocal(STORAGE_KEYS.NEWS, [item, ...current]);
    return item;
  },

  async updateNews(item: NewsItem): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const { id, ...data } = item;
        await updateDoc(doc(db, "news", id), data);
        return;
      } catch (e) { handleFirebaseError(e, 'updateNews'); }
    }
    const current = getLocal<NewsItem[]>(STORAGE_KEYS.NEWS, []);
    const updated = current.map(n => n.id === item.id ? item : n);
    setLocal(STORAGE_KEYS.NEWS, updated);
  },

  async deleteNews(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "news", id));
        return;
      } catch (e) { handleFirebaseError(e, 'deleteNews'); }
    }
    const current = getLocal<NewsItem[]>(STORAGE_KEYS.NEWS, []);
    setLocal(STORAGE_KEYS.NEWS, current.filter(n => n.id !== id));
  },

  // --- FEEDBACK / MESSAGES ---
  async getFeedback(): Promise<FeedbackItem[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "feedback"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeedbackItem));
      } catch (e) {
        handleFirebaseError(e, 'getFeedback');
      }
    }
    return getLocal<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, []);
  },

  async addFeedback(item: FeedbackItem): Promise<FeedbackItem> {
    if (isFirebaseConfigured && db) {
      try {
        const { id, ...data } = item;
        const docRef = await addDoc(collection(db, "feedback"), data);
        return { ...item, id: docRef.id };
      } catch (e) {
        handleFirebaseError(e, 'addFeedback');
      }
    }
    const current = getLocal<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, []);
    setLocal(STORAGE_KEYS.FEEDBACK, [item, ...current]);
    return item;
  },

  async deleteFeedback(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "feedback", id));
        return;
      } catch(e) { handleFirebaseError(e, 'deleteFeedback'); }
    }
    const current = getLocal<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, []);
    setLocal(STORAGE_KEYS.FEEDBACK, current.filter(f => f.id !== id));
  },

  // --- EMPLOYEE COURSES ---
  async getEmployeeCourses(): Promise<EmployeeCourse[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "employee_courses"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmployeeCourse));
      } catch (e) { handleFirebaseError(e, 'getEmployeeCourses'); }
    }
    return getLocal<EmployeeCourse[]>(STORAGE_KEYS.EMPLOYEE_COURSES, []);
  },

  async addEmployeeCourse(course: EmployeeCourse): Promise<EmployeeCourse> {
    if (isFirebaseConfigured && db) {
      try {
        const { id, ...data } = course;
        const docRef = await addDoc(collection(db, "employee_courses"), data);
        return { ...course, id: docRef.id };
      } catch (e) { handleFirebaseError(e, 'addEmployeeCourse'); }
    }
    const current = getLocal<EmployeeCourse[]>(STORAGE_KEYS.EMPLOYEE_COURSES, []);
    setLocal(STORAGE_KEYS.EMPLOYEE_COURSES, [course, ...current]);
    return course;
  },

  async updateEmployeeCourse(course: EmployeeCourse): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const { id, ...data } = course;
        await updateDoc(doc(db, "employee_courses", id), data);
        return;
      } catch (e) { handleFirebaseError(e, 'updateEmployeeCourse'); }
    }
    const current = getLocal<EmployeeCourse[]>(STORAGE_KEYS.EMPLOYEE_COURSES, []);
    const updated = current.map(c => c.id === course.id ? course : c);
    setLocal(STORAGE_KEYS.EMPLOYEE_COURSES, updated);
  },

  async deleteEmployeeCourse(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "employee_courses", id));
        return;
      } catch(e) { handleFirebaseError(e, 'deleteEmployeeCourse'); }
    }
    const current = getLocal<EmployeeCourse[]>(STORAGE_KEYS.EMPLOYEE_COURSES, []);
    setLocal(STORAGE_KEYS.EMPLOYEE_COURSES, current.filter(c => c.id !== id));
  },

  // --- RECOMMENDED COURSES ---
  async getRecommendedCourses(): Promise<RecommendedCourse[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "recommended_courses"));
        const querySnapshot = await getDocs(q);
        const courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RecommendedCourse));
        return courses.length > 0 ? courses : getLocal(STORAGE_KEYS.RECOMMENDED_COURSES, INITIAL_RECOMMENDED);
      } catch (e) { handleFirebaseError(e, 'getRecommendedCourses'); return getLocal(STORAGE_KEYS.RECOMMENDED_COURSES, INITIAL_RECOMMENDED); }
    }
    return getLocal(STORAGE_KEYS.RECOMMENDED_COURSES, INITIAL_RECOMMENDED);
  },

  async addRecommendedCourse(course: RecommendedCourse): Promise<RecommendedCourse> {
    if (isFirebaseConfigured && db) {
      try {
        const { id, ...data } = course;
        const docRef = await addDoc(collection(db, "recommended_courses"), data);
        return { ...course, id: docRef.id };
      } catch (e) { handleFirebaseError(e, 'addRecommendedCourse'); }
    }
    const current = getLocal<RecommendedCourse[]>(STORAGE_KEYS.RECOMMENDED_COURSES, INITIAL_RECOMMENDED);
    setLocal(STORAGE_KEYS.RECOMMENDED_COURSES, [course, ...current]);
    return course;
  },

  async updateRecommendedCourse(course: RecommendedCourse): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const { id, ...data } = course;
        await updateDoc(doc(db, "recommended_courses", id), data);
        return;
      } catch (e) { handleFirebaseError(e, 'updateRecommendedCourse'); }
    }
    const current = getLocal<RecommendedCourse[]>(STORAGE_KEYS.RECOMMENDED_COURSES, INITIAL_RECOMMENDED);
    const updated = current.map(c => c.id === course.id ? course : c);
    setLocal(STORAGE_KEYS.RECOMMENDED_COURSES, updated);
  },

  async deleteRecommendedCourse(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "recommended_courses", id));
        return;
      } catch(e) { handleFirebaseError(e, 'deleteRecommendedCourse'); }
    }
    const current = getLocal<RecommendedCourse[]>(STORAGE_KEYS.RECOMMENDED_COURSES, INITIAL_RECOMMENDED);
    setLocal(STORAGE_KEYS.RECOMMENDED_COURSES, current.filter(c => c.id !== id));
  },

  // --- IP ALIASES ---
  async getIpAliases(): Promise<IpAlias[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "ip_aliases"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IpAlias));
      } catch (e) { handleFirebaseError(e, 'getIpAliases'); }
    }
    return getLocal<IpAlias[]>(STORAGE_KEYS.IP_ALIASES, []);
  },

  async addIpAlias(alias: IpAlias): Promise<IpAlias> {
    if (isFirebaseConfigured && db) {
      try {
        const { id, ...data } = alias;
        const docRef = await addDoc(collection(db, "ip_aliases"), data);
        return { ...alias, id: docRef.id };
      } catch (e) { handleFirebaseError(e, 'addIpAlias'); }
    }
    const current = getLocal<IpAlias[]>(STORAGE_KEYS.IP_ALIASES, []);
    setLocal(STORAGE_KEYS.IP_ALIASES, [alias, ...current]);
    return alias;
  },

  async deleteIpAlias(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "ip_aliases", id));
        return;
      } catch (e) { handleFirebaseError(e, 'deleteIpAlias'); }
    }
    const current = getLocal<IpAlias[]>(STORAGE_KEYS.IP_ALIASES, []);
    setLocal(STORAGE_KEYS.IP_ALIASES, current.filter(a => a.id !== id));
  },

  // --- SUPPLIERS (PROVEEDORES) ---
  async getSuppliers(): Promise<Supplier[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "suppliers"));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Supplier));
        return items.length > 0 ? items : getLocal(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
      } catch (e) { handleFirebaseError(e, 'getSuppliers'); return getLocal(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS); }
    }
    return getLocal<Supplier[]>(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
  },

  async addSupplier(supplier: Supplier): Promise<Supplier> {
    if (isFirebaseConfigured && db) {
      try {
        const { id, ...data } = supplier;
        const docRef = await addDoc(collection(db, "suppliers"), data);
        return { ...supplier, id: docRef.id };
      } catch (e) { handleFirebaseError(e, 'addSupplier'); }
    }
    const current = getLocal<Supplier[]>(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
    setLocal(STORAGE_KEYS.SUPPLIERS, [supplier, ...current]);
    return supplier;
  },

  async updateSupplier(supplier: Supplier): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const { id, ...data } = supplier;
        await updateDoc(doc(db, "suppliers", id), data);
        return;
      } catch (e) { handleFirebaseError(e, 'updateSupplier'); }
    }
    const current = getLocal<Supplier[]>(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
    const updated = current.map(s => s.id === supplier.id ? supplier : s);
    setLocal(STORAGE_KEYS.SUPPLIERS, updated);
  },

  async deleteSupplier(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "suppliers", id));
        return;
      } catch(e) { handleFirebaseError(e, 'deleteSupplier'); }
    }
    const current = getLocal<Supplier[]>(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
    setLocal(STORAGE_KEYS.SUPPLIERS, current.filter(s => s.id !== id));
  },

  // --- VISIT COUNTER (ANALYTICS) - CLOUD ONLY ---
  async recordVisit(): Promise<void> {
    let ipAddress = 'Desconocido';
    try {
        // Fetch public IP address
        const response = await fetch('https://api.ipify.org?format=json');
        if (response.ok) {
            const data = await response.json();
            ipAddress = data.ip;
        }
    } catch (error) {
        console.warn("Error fetching IP:", error);
    }

    const visitData = {
      timestamp: Date.now(),
      dateString: new Date().toLocaleDateString('es-AR'),
      deviceInfo: navigator.userAgent,
      ip: ipAddress
    };

    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, "visits"), visitData);
        console.log("Visita registrada en Firebase");
      } catch (e) {
        console.error("Error al registrar visita en Firebase:", e);
      }
    }
    // NOT saving to localStorage to avoid data fragmentation and misleading stats.
  },

  async getVisits(): Promise<VisitRecord[]> {
    if (isFirebaseConfigured && db) {
      try {
        // Increased limit for better historical data in Admin
        const q = query(collection(db, "visits"), orderBy("timestamp", "desc"), limit(2000));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VisitRecord));
      } catch (e) {
        handleFirebaseError(e, 'getVisits');
        return [];
      }
    }
    // Return empty array if not connected to avoid showing local-only data which is incorrect
    return [];
  },

  // --- HELPERS ---
  getLocal,
  setLocal
};
