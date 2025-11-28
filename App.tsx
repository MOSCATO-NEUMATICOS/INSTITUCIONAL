
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Manuals } from './pages/Manuals';
import { Tools } from './pages/Tools';
import { Feedback } from './pages/Feedback';
import { Admin } from './pages/Admin';
import { Page, Manual, ManualCategory, NewsItem, FeedbackItem } from './types';

// Initial Data with Real Content
const INITIAL_MANUALS: Manual[] = [
  {
    id: '1',
    title: 'Reparación de Ruedas (Pinchadura Sin Cámara)',
    category: ManualCategory.TALLER,
    description: 'Procedimiento estándar para reparación de neumáticos sin cámara, asegurando seguridad y calidad.',
    lastUpdated: '20/05/2024',
    readTime: '5 min',
    textContent: `REPARACIÓN DE RUEDAS MOSCATO (PINCHADURA, SIN CÁMARA)

1. Objetivo
Estandarizar la reparación de neumáticos sin cámara, asegurando seguridad, durabilidad y calidad en el servicio.

2. Alcance
Aplica únicamente a neumáticos sin cámara de autos, utilitarios y SUV. No incluye neumáticos con cámara, camiones ni motocicletas.

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
5. Inspeccionar interior y exterior. Si la rotura está en el lateral: el técnico evalúa si es reparable con seguridad; en caso de duda, consulta al jefe de taller.
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
    title: 'Protocolo de Balanceo de Ruedas',
    category: ManualCategory.TALLER,
    description: 'Estandarización del balanceo para garantizar un rodado seguro y sin vibraciones.',
    lastUpdated: '20/05/2024',
    readTime: '8 min',
    textContent: `BALANCEO DE RUEDAS

1. Objetivo
Estandarizar el procedimiento de balanceo de ruedas para garantizar un rodado seguro, sin vibraciones y con mayor durabilidad de neumáticos y suspensión.

2. Alcance
Aplica a ruedas de autos, utilitarios y SUV. No incluye vehículos pesados ni motocicletas.

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
    id: '3',
    title: 'Procedimiento de Cambio de Neumáticos',
    category: ManualCategory.TALLER,
    description: 'Guía paso a paso para el recambio de cubiertas asegurando rapidez y calidad.',
    lastUpdated: '20/05/2024',
    readTime: '10 min',
    textContent: `CAMBIO DE NEUMÁTICOS

1. Objetivo
Estandarizar el procedimiento de cambio de neumáticos para asegurar seguridad, rapidez y calidad del servicio.

2. Alcance
Aplica a autos, utilitarios y SUV. No incluye camiones ni motocicletas.

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
    id: '4',
    title: 'Cambio de Válvulas TPMS (Chevrolet y Ford)',
    category: ManualCategory.TALLER,
    description: 'Procedimiento específico para sensores TPMS y su reaprendizaje.',
    lastUpdated: '20/05/2024',
    readTime: '20 min',
    textContent: `CAMBIO DE VÁLVULAS TPMS (CHEVROLET Y FORD)

1. Objetivo
Estandarizar el procedimiento de cambio de válvulas TPMS de goma en vehículos Chevrolet y Ford, asegurando el correcto reaprendizaje del sistema y el funcionamiento de los sensores.

2. Alcance
Aplica a vehículos Chevrolet y Ford equipados con sensores TPMS de válvula de goma. No aplica a sensores de banda interna ni sistemas TPMS externos.

3. Herramientas necesarias
- Aparato/programador TPMS para reaprendizaje
- Herramienta para retirar e instalar óvulo (núcleo de la válvula)
- Desarmadora de neumáticos
- Inflador y manómetro
- EPP obligatorio: Zapatos de seguridad, Faja lumbar (si se manipulan ruedas pesadas)

4. Pasos del procedimiento

Chequeo inicial – Identificación del sensor defectuoso
1. Siempre realizar un reaprendizaje inicial para confirmar qué sensor no está reconociendo. Esto evita cambiar una válvula que no corresponde.
2. Una vez identificado el sensor defectuoso → proceder al cambio.

Procedimiento de reaprendizaje

CHEVROLET:
- Poner el auto en marcha, en Parking o Neutro, con freno de mano colocado.
- Usar el comando del volante para ir a la pantalla de presiones de neumáticos.
- Mantener presionado el botón OK / tilde unos 10 segundos hasta que aparezca el mensaje de inicio de reaprendizaje (o suenen 2 bocinas).
- El sistema pedirá sensar en este orden: 1) Delantera izquierda 2) Delantera derecha 3) Trasera derecha 4) Trasera izquierda. (La baliza encendida indica qué rueda corresponde).
- Para activar: acercar el aparato TPMS al pico y presionar el botón.
- Cada sensor reconocido hace sonar 1 bocina.
- Al finalizar el reaprendizaje suenan 2 bocinas como confirmación.

FORD:
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

⚠ En algunos casos, ciertos modelos Ford no permiten realizar este aprendizaje de manera manual y es necesario conectar el scanner por OBD2. En ese caso, consultar con el jefe de taller.

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
    id: '5',
    title: 'Normas de Seguridad en Taller',
    category: ManualCategory.SEGURIDAD,
    description: 'Uso obligatorio de EPP y protocolos de emergencia.',
    lastUpdated: '01/01/2024',
    readTime: '15 min',
    textContent: `NORMAS DE SEGURIDAD EN TALLER

1. Elementos de Protección Personal (EPP)
El uso de EPP es obligatorio dentro de las áreas de servicio:
- Calzado de seguridad con puntera de acero.
- Ropa de trabajo adecuada (evitar ropa suelta).
- Guantes de protección para manipulación de materiales cortantes o calientes.
- Protección auditiva en zonas de alto ruido.
- Gafas de seguridad al utilizar amoladoras o herramientas de impacto.

2. Orden y Limpieza
- Mantener el área de trabajo limpia y libre de obstáculos (herramientas en el piso, cables, derrames de aceite).
- Limpiar inmediatamente cualquier derrame de lubricantes o fluidos.
- Guardar las herramientas en su lugar correspondiente al finalizar cada tarea.

3. Uso de Maquinaria y Herramientas
- Solo personal autorizado y capacitado debe operar elevadores, balanceadoras y desarmadoras.
- Verificar el estado de las herramientas antes de su uso. Reportar cualquier falla al supervisor.
- Asegurar correctamente los vehículos en los elevadores antes de trabajar debajo de ellos.
- No anular dispositivos de seguridad de las máquinas.`
  },
];

const INITIAL_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Nueva máquina de alineación 3D Hunter',
    category: 'Taller',
    description: 'Capacitación obligatoria: Viernes 14:00hs',
    date: 'Hace 2 días'
  },
  {
    id: '2',
    title: 'Actualización lista de precios Goodyear',
    category: 'Ventas',
    description: 'Vigencia inmediata para toda la red.',
    date: 'Hace 4 horas'
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  
  // Lifted State for Data Persistence during session
  const [manuals, setManuals] = useState<Manual[]>(INITIAL_MANUALS);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);

  // Handlers for Admin
  const handleAddManual = (newManual: Manual) => {
    setManuals([newManual, ...manuals]);
  };

  const handleDeleteManual = (id: string) => {
    setManuals(manuals.filter(m => m.id !== id));
  };

  const handleAddNews = (newItem: NewsItem) => {
    setNews([newItem, ...news]);
  };

  const handleDeleteNews = (id: string) => {
    setNews(news.filter(n => n.id !== id));
  };

  const handleAddFeedback = (newItem: FeedbackItem) => {
    setFeedbackItems([newItem, ...feedbackItems]);
  };

  const handleDeleteFeedback = (id: string) => {
    setFeedbackItems(feedbackItems.filter(f => f.id !== id));
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return <Home news={news} />;
      case Page.MANUALS:
        return <Manuals manuals={manuals} />;
      case Page.TOOLS:
        return <Tools onNavigate={setCurrentPage} />;
      case Page.FEEDBACK:
        return <Feedback onFeedbackSubmit={handleAddFeedback} />;
      case Page.ADMIN:
        return (
          <Admin 
            manuals={manuals} 
            news={news}
            feedbackItems={feedbackItems}
            onAddManual={handleAddManual}
            onDeleteManual={handleDeleteManual}
            onAddNews={handleAddNews}
            onDeleteNews={handleDeleteNews}
            onDeleteFeedback={handleDeleteFeedback}
          />
        );
      default:
        return <Home news={news} />;
    }
  };

  return (
    <div className="min-h-screen bg-tire-pattern font-sans text-gray-900 flex flex-col">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="flex-grow">
        {renderPage()}
      </main>

      <footer className="bg-brand-900 border-t border-brand-800 mt-auto text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start space-x-6 md:order-2">
              <span className="text-brand-200 hover:text-white text-sm transition-colors">
                Soporte IT: <a href="mailto:diego@moscato.com.ar" className="text-gold-400 hover:underline">diego@moscato.com.ar</a>
              </span>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-sm text-brand-200">
                &copy; {new Date().getFullYear()} <span className="font-bold text-white">Moscato Neumáticos</span>. Uso interno exclusivo.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
