
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, limit, updateDoc, arrayUnion, writeBatch } from 'firebase/firestore';
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

// --- LOCAL STORAGE KEYS (Updated to v5 to force refresh with updated TPMS manual) ---
const STORAGE_KEYS = {
  MANUALS: 'moscato_portal_manuals_v5', 
  NEWS: 'moscato_portal_news_v2',
  FEEDBACK: 'moscato_portal_feedback_v2',
  EMPLOYEE_COURSES: 'moscato_portal_emp_courses_v1',
  RECOMMENDED_COURSES: 'moscato_portal_rec_courses_v1',
  IP_ALIASES: 'moscato_portal_ip_aliases_v1',
  SUPPLIERS: 'moscato_portal_suppliers_v1',
  DEVICE_ID: 'moscato_device_id_v1'
};

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

function getOrCreateDeviceId(): string {
  let deviceId = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  if (!deviceId) {
    deviceId = crypto.randomUUID ? crypto.randomUUID() : `legacy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
  }
  return deviceId;
}

const handleFirebaseError = (e: any, context: string) => {
  console.error(`Error en ${context}:`, e);
  if (e.message?.includes('Cloud Firestore API') || e.code === 'permission-denied') {
    console.warn(`🚨 Error de permisos o API en Firebase.`);
  }
};

// --- INITIAL DATA (OFFICIAL MOSCATO MANUALS) ---
const INITIAL_MANUALS: Manual[] = [
  {
    id: '1',
    title: 'Guía de Trabajo - Sucursal Moscato',
    category: ManualCategory.ADMINISTRACION,
    description: 'Estándares de atención al cliente, orden, limpieza, tareas administrativas básicas y resolución de problemas.',
    lastUpdated: '01/01/2024',
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
    id: '2',
    title: 'Carga de Clientes en WhatsApp',
    category: ManualCategory.VENTAS,
    description: 'Sistema de codificación de contactos por fecha (ej: ENE25) para gestión de listas de difusión.',
    lastUpdated: '01/01/2024',
    textContent: `Cómo cargar clientes en WhatsApp usando códigos de fecha (ENE25, FEB25, etc.)

Objetivo:
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
"Cuando cargues un cliente nuevo en WhatsApp, agregale al final del nombre un código del mes y año actual (ej.: MAR25). Ese código sirve para ordenar contactos y crear listas de difusión."`
  },
  {
    id: '3',
    title: 'Procedimiento de Alineación 3D',
    category: ManualCategory.TALLER,
    description: 'Protocolo completo desde la preparación del vehículo, colocación de sensores, medición, ajustes y control final.',
    lastUpdated: '01/01/2024',
    textContent: `PROCEDIMIENTO DE ALINEACIÓN 3D
Rol responsable: Alineador
Alcance: desde el ingreso del vehículo al elevador de alineación hasta la entrega del informe impreso.

1. Preparación del vehículo y seguridad
- Verificar que el vehículo tenga orden de trabajo asignada.
- Colocar el vehículo en el elevador de alineación.
- Revisar visualmente el estado de los neumáticos: Desgaste irregular o daños visibles.
- Si se detecta desgaste anormal → realizar revisión de tren delantero y registrar observaciones.
- Informar a administración para evaluar presupuesto.
- NO accionar freno de mano (necesario para alabeo).
- Colocar bloqueador de volante si es necesario.
- Elevar el vehículo según corresponda.

2. Colocación de sensores
- Instalar garras asegurando correcta fijación.
- Colocar sensores/targets 3D en las cuatro ruedas.
- Verificar reconocimiento y calibración en pantalla.

3. Compensación inicial (alabeo)
- Seguir procedimiento de la máquina para compensación de rodadura.
- Confirmar registro correcto de valores iniciales.

4. Medición y diagnóstico
- Registrar: Convergencia (del/tras), Caída, Avance, Ángulo de empuje.
- Comparar con valores de referencia.
- Si hay desviaciones graves no corregibles, detener e informar.

5. Ajustes
- Aflojar y ajustar: convergencia, caída y avance (si aplica).
- Aplicar par de apriete adecuado.
- Repetir mediciones tras cada ajuste hasta lograr tolerancia.

6. Control final
- Revisar volante centrado.
- Confirmar valores en rango en pantalla.
- Imprimir informe final.
- Colocar informe en asiento del acompañante.
- Pegar sticker con fecha y km (+10.000) en parante puerta.
- Colocar bolsa de residuos en palanca.
- Retirar bloqueadores.
- Bajar vehículo.
- Prueba de manejo corta obligatoria (volante derecho, sin desvíos).

7. Entrega
- Dejar vehículo listo para administración o playa.
- Explicar resultado al cliente si está presente.

Notas internas:
- Mantener equipo limpio y calibrado.
- Revisar estado de garras periódicamente.`
  },
  {
    id: '4',
    title: 'Procedimiento de Balanceo',
    category: ManualCategory.TALLER,
    description: 'Pasos para el balanceo de ruedas de autos, utilitarios y SUV. Uso de plomos adhesivos y de clip.',
    lastUpdated: '01/01/2024',
    textContent: `BALANCEO DE RUEDAS

1. Objetivo
Estandarizar el balanceo para garantizar seguridad, sin vibraciones y mayor durabilidad.

2. Alcance
Autos, utilitarios y SUV. (No camiones ni motos).

3. Herramientas
- Balanceadora
- Plomos (adhesivos/clip)
- Pinza para plomos
- Inflador/Manómetro
- Trapo y alcohol
- EPP: Zapatos seguridad, Faja lumbar.

4. Procedimiento
1. Retirar rueda.
2. Verificar presión y ajustar.
3. Colocar en balanceadora, asegurar centrado.
4. Ingresar medidas (ancho, diámetro, distancia).
5. Girar y esperar lectura.
6. Colocar plomos:
   - Adhesivos: limpiar superficie con alcohol antes.
   - De clip: usar pinza.
7. Repetir medición hasta marcar 0–0 (o tolerancia 5).
8. Retirar rueda.
9. Montar en vehículo.
10. Ajustar tuercas en cruz y dar torque final en el piso.

5. Seguridad
- Revisar fijación en máquina antes de encender.
- Usar plomos adecuados a la llanta.

6. Tiempo estimado
8 - 10 minutos por rueda.

7. Control de calidad
- Máquina en 0-0.
- Plomos firmes.
- Registrar servicio en orden.`
  },
  {
    id: '5',
    title: 'Cambio de Neumáticos',
    category: ManualCategory.TALLER,
    description: 'Procedimiento estándar de desmontaje, revisión de válvula, montaje, inflado y ajuste de tuercas.',
    lastUpdated: '01/01/2024',
    textContent: `CAMBIO DE NEUMÁTICOS

1. Objetivo
Asegurar seguridad, rapidez y calidad en el recambio.

2. Alcance
Autos, utilitarios y SUV.

3. Herramientas
- Gato/Elevador
- Llave impacto/cruz
- Desarmadora
- Balanceadora
- Inflador
- EPP obligatorio.

4. Procedimiento
1. Aflojar tuercas en piso.
2. Levantar vehículo seguro.
3. Retirar rueda.
4. Desarmar neumático.
5. Revisar llanta y válvula (reemplazar si es necesario).
6. Montar neumático nuevo/reparado.
7. Si es nuevo -> Balancear.
8. Inflar a presión recomendada.
9. Colocar rueda.
10. Ajustar tuercas en cruz (preajuste).
11. Bajar vehículo.
12. Torque final en piso.

Orden de ajuste:
1. Delantera Izq
2. Delantera Der
3. Trasera Der
4. Trasera Izq

5. Seguridad
- Verificar apoyo de gato/elevador.
- No permanecer bajo vehículo sostenido solo por gato.

6. Tiempo
8 a 12 minutos por rueda.

7. Control
- Presión confirmada.
- Balanceo OK (si aplica).
- Tuercas firmes.
- Registrar en orden.`
  },
  {
    id: '6',
    title: 'Cambio de Válvulas TPMS (Chevrolet y Ford)',
    category: ManualCategory.TALLER,
    description: 'Guía específica para reemplazo de válvulas de goma TPMS y procedimientos de reaprendizaje manual.',
    lastUpdated: '01/01/2024',
    textContent: `CAMBIO DE VÁLVULAS TPMS (CHEVROLET Y FORD)

1. Objetivo
Estandarizar cambio de válvulas TPMS de goma y reaprendizaje del sistema.

2. Alcance
Vehículos con TPMS de válvula de goma (No banda interna).

3. Herramientas
- Programador TPMS
- Herramienta de óvulos
- Desarmadora
- EPP.

4. Procedimiento

Chequeo inicial:
1. Reaprendizaje inicial para IDENTIFICAR sensor defectuoso.
2. Proceder al cambio.

Reaprendizaje Chevrolet:
- Freno de mano, contacto o marcha.
- Menú tablero -> Presión neumáticos.
- Mantener OK/Tilde hasta bocina.
- Orden sensado: DI -> DD -> TD -> TI.
- Activar sensor con aparato. (Bocina confirma).
- Final: 2 bocinas.

Reaprendizaje Ford:
- Freno de mano.
- Pisar/soltar freno.
- Contacto poner/sacar 3 veces (fin en puesto).
- Pisar/soltar freno.
- Contacto poner/sacar 3 veces (fin en puesto).
- Bocina indica inicio.
- Orden: DI -> DD -> TD -> TI.
- Activar con aparato.
- Final: 2 bocinas.
* Nota: Algunos modelos requieren scanner OBD2.

Cambio de válvula:
- Retirar rueda.
- Desinflar (sacar óvulo).
- Desarmar con cuidado de no romper sensor.
- Retirar válvula vieja, colocar nueva compatible.
- Indicar en el interior de la llanta, junto al sensor, la fecha del dia de cambio.
- Reinstalar óvulo e inflar.

Reaprendizaje final:
- Ejecutar procedimiento nuevamente para confirmar los 4 sensores.
- Verificar tablero sin fallas.

5. Seguridad
- Identificar sensor antes de desarmar.
- Cuidado al desalonar para no romper sensor.

6. Tiempo
20-25 min por válvula.`
  },
  {
    id: '7',
    title: 'Reparación de Ruedas (Pinchaduras)',
    category: ManualCategory.TALLER,
    description: 'Proceso técnico para reparación de neumáticos sin cámara: inspección, pulido, cementado y vulcanización en frío.',
    lastUpdated: '01/01/2024',
    textContent: `REPARACIÓN DE RUEDAS MOSCATO (PINCHADURA, SIN CÁMARA)

1. Objetivo
Reparación segura y duradera de neumáticos sin cámara.

2. Alcance
Autos, utilitarios, SUV (Sin cámara).

3. Herramientas
- Desarmadora
- Torno pulir
- Parches, Cemento en frío
- Inflador, batea agua
- EPP.

4. Procedimiento
1. Retirar rueda.
2. Inflar y buscar pérdida en agua.
3. Marcar zona y pico.
4. Desarmar.
5. Inspeccionar interior/exterior. (Rotura lateral: evaluar seguridad/consultar jefe).
6. Pulir superficie interior.
7. Aplicar cemento en frío, dejar actuar (2-3 min).
8. Colocar parche adecuado.
9. Vulcanizar con rodillo (presión).
10. Montar en posición original.
11. Inflar y sumergir para prueba final.
12. Ajustar presión.
13. Colocar en vehículo.
14. Torque final en piso.
15. Calibrar resto de neumáticos.

5. Seguridad
- Revisar en agua al final SIEMPRE.
- No reparar laterales inseguros.
- Ventilación al usar cemento.

6. Tiempo
15-20 min.

7. Control
- Sin pérdidas.
- Presión OK.
- Torque OK.`
  },
  {
    id: '8',
    title: 'Políticas de Garantía',
    category: ManualCategory.VENTAS,
    description: 'Condiciones generales, plazos de cobertura por servicio y exclusiones de la garantía oficial.',
    lastUpdated: '01/01/2024',
    textContent: `Políticas de Garantía – Moscato Neumáticos

1. Alcance
- Solo trabajos realizados en nuestro taller y piezas provistas por nosotros.
- No cubre trabajos externos ni piezas del cliente.

2. Plazos
- Neumáticos: Garantía de fábrica (defectos fabricación).
- Balanceo/Colocación: 30 días o 1.000 km.
- Alineación: 30 días o 1.000 km (salvo golpes/baches).
- Tren delantero/Suspensión: 3 meses o 5.000 km.
- Reparación Pinchadura: 15 días (solo sobre el parche).

3. Condiciones
- Presentar factura.
- Revisión en nuestro taller sin intervención previa de terceros.
- Falla por defecto o mala instalación.

4. Exclusiones
- Golpes, baches, choques.
- Desgaste normal.
- Intervención de terceros.
- Uso inadecuado (sobrecarga, mala presión).
- Piezas provistas por cliente.

5. Reclamo
- Cliente acerca vehículo + factura.
- Encargado revisa.
- Si corresponde: reparación/cambio sin costo.
- Si no: explicación escrita del motivo.

6. Limitaciones
- Cubre reparación/reemplazo de la pieza/servicio.
- No cubre remolques, traslados o daños indirectos.`
  }
];

const INITIAL_RECOMMENDED: RecommendedCourse[] = [ /* Keeps existing if empty */ ];
const INITIAL_SUPPLIERS: Supplier[] = [ /* Keeps existing if empty */ ];


// --- STORAGE SERVICE ---
export const storageService = {
  
  // --- MANUALS ---
  async getManuals(): Promise<Manual[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "manuals"));
        const querySnapshot = await getDocs(q);
        const manuals = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Manual));
        // FIX: If Cloud is empty (first run), try to seed or return fallback
        return manuals.length > 0 ? manuals : INITIAL_MANUALS;
      } catch (e) {
        handleFirebaseError(e, 'getManuals');
        return INITIAL_MANUALS;
      }
    }
    return getLocal(STORAGE_KEYS.MANUALS, INITIAL_MANUALS);
  },

  async addManual(manual: Manual): Promise<Manual> {
    if (isFirebaseConfigured && db) {
      try {
        // SMART CHECK: If the DB is empty (meaning user is seeing initial manuals),
        // we must save the initial manuals first so they don't disappear when the first custom one is added.
        const q = query(collection(db, "manuals"));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
           console.log("Inicializando base de datos con manuales por defecto...");
           const batch = writeBatch(db);
           INITIAL_MANUALS.forEach(m => {
              // Create a new doc with auto ID for initial manuals
              const docRef = doc(collection(db, "manuals"));
              const { id, ...data } = m; // Exclude static ID
              batch.set(docRef, data);
           });
           await batch.commit();
        }

        const { id, ...data } = manual; 
        const docRef = await addDoc(collection(db, "manuals"), data);
        return { ...manual, id: docRef.id };
      } catch (e) { handleFirebaseError(e, 'addManual'); }
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
    const current = getLocal<Manual[]>(STORAGE_KEYS.MANUALS, INITIAL_MANUALS);
    setLocal(STORAGE_KEYS.MANUALS, current.filter(m => m.id !== id));
  },

  // --- NEWS ---
  async getNews(): Promise<NewsItem[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "news"));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
        return items.sort((a, b) => {
           const timeA = a.timestamp || parseInt(a.id) || 0;
           const timeB = b.timestamp || parseInt(b.id) || 0;
           return timeB - timeA;
        });
      } catch (e) { handleFirebaseError(e, 'getNews'); }
    }
    const local = getLocal<NewsItem[]>(STORAGE_KEYS.NEWS, []);
    return local.sort((a, b) => {
        const timeA = a.timestamp || parseInt(a.id) || 0;
        const timeB = b.timestamp || parseInt(b.id) || 0;
        return timeB - timeA;
    });
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

  // --- FEEDBACK ---
  async getFeedback(): Promise<FeedbackItem[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "feedback"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeedbackItem));
      } catch (e) { handleFirebaseError(e, 'getFeedback'); }
    }
    return getLocal<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, []);
  },

  async addFeedback(item: FeedbackItem): Promise<FeedbackItem> {
    if (isFirebaseConfigured && db) {
      try {
        const { id, ...data } = item;
        const docRef = await addDoc(collection(db, "feedback"), data);
        return { ...item, id: docRef.id };
      } catch (e) { handleFirebaseError(e, 'addFeedback'); }
    }
    const current = getLocal<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, []);
    setLocal(STORAGE_KEYS.FEEDBACK, [item, ...current]);
    return item;
  },

  async updateFeedback(item: FeedbackItem): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const { id, ...data } = item;
        await updateDoc(doc(db, "feedback", id), data);
        return;
      } catch (e) { handleFirebaseError(e, 'updateFeedback'); }
    }
    const current = getLocal<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, []);
    const updated = current.map(f => f.id === item.id ? item : f);
    setLocal(STORAGE_KEYS.FEEDBACK, updated);
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

  // --- SUPPLIERS ---
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

  // --- VISIT COUNTER (ANALYTICS) ---
  async recordVisit(): Promise<string | null> {
    let ipAddress = 'Desconocido';
    let ispProvider = '';
    const deviceId = getOrCreateDeviceId(); // Get stable device ID

    try {
        const response = await fetch('https://ipinfo.io/json');
        if (response.ok) {
            const data = await response.json();
            ipAddress = data.ip;
            ispProvider = data.org || ''; 
        }
    } catch (error) {
        console.warn("Error fetching IP/ISP:", error);
    }

    const visitData: Omit<VisitRecord, 'id'> = {
      timestamp: Date.now(),
      dateString: new Date().toLocaleDateString('es-AR'),
      deviceInfo: navigator.userAgent,
      deviceId: deviceId, // Store the persistent ID
      ip: ipAddress,
      isp: ispProvider, 
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      sectionsVisited: ['Inicio'] 
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, "visits"), visitData);
        return docRef.id;
      } catch (e) {
        console.error("Error al registrar visita en Firebase:", e);
        return null;
      }
    }
    return null;
  },

  async trackPageNavigation(visitId: string, pageName: string): Promise<void> {
    if (!visitId || !isFirebaseConfigured || !db) return;
    try {
      const visitRef = doc(db, "visits", visitId);
      await updateDoc(visitRef, {
        sectionsVisited: arrayUnion(pageName)
      });
    } catch (e) {
      console.warn("Failed to track page view", e);
    }
  },

  async getVisits(): Promise<VisitRecord[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "visits"), orderBy("timestamp", "desc"), limit(2000));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VisitRecord));
      } catch (e) {
        handleFirebaseError(e, 'getVisits');
        return [];
      }
    }
    return [];
  },

  // NEW: CLEAR VISIT HISTORY
  async clearVisits(): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "visits"));
        const snapshot = await getDocs(q);
        
        // Firestore batch deletes are limited to 500 ops. Simple chunking for safety.
        const BATCH_SIZE = 400;
        let batch = writeBatch(db);
        let count = 0;

        for (const document of snapshot.docs) {
            batch.delete(doc(db, "visits", document.id));
            count++;
            if (count >= BATCH_SIZE) {
                await batch.commit();
                batch = writeBatch(db);
                count = 0;
            }
        }
        if (count > 0) {
            await batch.commit();
        }
        console.log("Historial de visitas eliminado correctamente.");
      } catch (e) {
        handleFirebaseError(e, 'clearVisits');
        throw e;
      }
    }
  },

  // --- HELPERS ---
  getLocal,
  setLocal
};
