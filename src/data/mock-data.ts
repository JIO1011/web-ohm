import type {
  Service,
  CaseStudy,
  BlogPost,
  CareerOpportunity,
} from "@/types";

export const servicesData: Service[] = [
  {
    id: "software",
    title: "Desarrollo de software",
    subtitle: "Plataformas web y aplicaciones full-stack.",
    description:
      "Construimos plataformas web y aplicaciones a medida con React, TypeScript y Node. Priorizamos que el sistema sea fácil de operar y mantener, no solo de entregar.",
    icon: "Code",
    category: "Software",
    detailedDescription:
      "Trabajamos full-stack: frontend con React y Next.js, backend en Node y bases de datos como PostgreSQL o Firebase. Integramos pasarelas de pago locales (PayPhone), autenticación y reportes. Ejemplo real: ReactiLab, una plataforma de gestión de laboratorio químico hoy en producción.",
    technologies: ["React", "TypeScript", "Next.js", "Node.js", "Tailwind CSS", "Firebase", "PostgreSQL"],
    benefits: [
      "Interfaces rápidas y mantenibles, no solo presentables.",
      "Backend con autenticación, validación y reportes desde el inicio.",
      "Integración de pasarelas de pago locales como PayPhone.",
      "Código ordenado que tu equipo puede continuar.",
    ],
    problemsSolved: [
      "Procesos que todavía se llevan en papel o en hojas de cálculo.",
      "Sistemas internos lentos o difíciles de mantener.",
      "Falta de trazabilidad y reportes en la operación diaria.",
    ],
  },
  {
    id: "ai",
    title: "IA aplicada e investigación",
    subtitle: "Modelos, agentes y análisis de datos para casos reales.",
    description:
      "Aplicamos IA donde aporta valor: agentes, RAG, automatización y análisis. Empezamos por un caso concreto, medimos resultados y crecemos solo si lo justifican.",
    icon: "BrainCircuit",
    category: "Software",
    detailedDescription:
      "Tenemos experiencia en investigación aplicada en biomedicina: IA para análisis de tejidos histopatológicos y procesamiento de señales EEG. Llevamos ese rigor a casos de empresa: asistentes sobre tu documentación, clasificación y extracción de datos.",
    technologies: ["Python", "PyTorch", "OpenAI", "Gemini", "RAG", "OpenBCI", "Pandas"],
    benefits: [
      "Casos acotados con métricas, no proyectos de investigación abiertos.",
      "Experiencia real en señales biomédicas (EEG) e histopatología.",
      "Salida validada y control de costos por uso.",
      "Plan claro de qué datos hacen falta antes de producción.",
    ],
    problemsSolved: [
      "Tareas repetitivas que un agente puede resolver.",
      "Datos sin explotar que podrían guiar decisiones.",
      "Procesos manuales de clasificación o extracción de información.",
    ],
  },
  {
    id: "cybersecurity",
    title: "Ciberseguridad y DevSecOps",
    subtitle: "Auditorías, GRC y endurecimiento práctico.",
    description:
      "Auditamos y endurecemos aplicaciones e infraestructura siguiendo marcos reconocidos. Convertimos riesgos en controles medibles, sin frenar al equipo.",
    icon: "Shield",
    category: "Software",
    detailedDescription:
      "Lideramos esta área con criterio formal: Máster en Ciberseguridad e ISO/IEC 27001 (TÜV Rheinland), aplicando NIST, OWASP y MITRE ATT&CK. Integramos prácticas DevSecOps en el ciclo de desarrollo y auditamos configuraciones en la nube.",
    technologies: ["OWASP", "NIST", "MITRE ATT&CK", "ISO/IEC 27001", "DevSecOps", "Defender for Cloud"],
    benefits: [
      "Riesgos convertidos en controles medibles y priorizados.",
      "Marcos reconocidos (NIST, OWASP, MITRE), no recetas genéricas.",
      "Seguridad integrada en el desarrollo, no al final.",
      "Criterio certificado: ISO/IEC 27001 (TÜV Rheinland).",
    ],
    problemsSolved: [
      "Aplicaciones expuestas por configuraciones heredadas.",
      "Falta de criterio formal para cumplir normativa.",
      "Vulnerabilidades que pasan desapercibidas sin auditoría.",
    ],
  },
  {
    id: "electronics",
    title: "Electrónica, embebidos e IoT",
    subtitle: "Circuitos, microcontroladores y dispositivos conectados.",
    description:
      "Diseñamos electrónica a medida y sistemas embebidos: desde el circuito hasta el firmware y la conexión con apps o la nube.",
    icon: "CircuitBoard",
    category: "Hardware",
    detailedDescription:
      "Trabajamos con microcontroladores (STM32, Arduino, ESP32) para control, sensado y comunicación. Ejemplos reales: control inalámbrico por Bluetooth con app móvil, librerías de pantalla para STM32 y monitoreo con Node-RED y ESP32.",
    technologies: ["STM32", "Arduino", "ESP32", "Bluetooth", "Node-RED", "C/C++", "IoT"],
    benefits: [
      "Del circuito al firmware y la app, con un solo equipo.",
      "Control y monitoreo remoto cuando el caso lo pide.",
      "Hardware pensado para uso real, no solo prototipo.",
      "Integración con sistemas y dashboards existentes.",
    ],
    problemsSolved: [
      "Equipos sin control remoto ni telemetría.",
      "Necesidad de electrónica a medida que no existe en el mercado.",
      "Prototipos que no resisten el uso en campo.",
    ],
  },
  {
    id: "automation",
    title: "Automatización y robótica",
    subtitle: "Control, sensado y actuación para procesos.",
    description:
      "Automatizamos procesos técnicos e industriales integrando control, sensores y actuadores con criterio de ingeniería.",
    icon: "Cog",
    category: "Hardware",
    detailedDescription:
      "Diseñamos soluciones de automatización y robótica aplicada para proyectos industriales y de eventos. Ejemplo real: la Máquina 360 de alta estabilidad, con sistema de control, motor y operación desde app móvil.",
    technologies: ["PLC", "Arduino", "Sensores", "Actuadores", "Control", "Robótica"],
    benefits: [
      "Procesos manuales convertidos en operación controlada.",
      "Diseño mecánico, electrónico y de control integrado.",
      "Validación funcional en campo, no solo en banco.",
      "Operación simple para quien lo usa a diario.",
    ],
    problemsSolved: [
      "Procesos repetitivos que dependen de operación manual.",
      "Equipos inestables o inseguros bajo uso intensivo.",
      "Falta de integración entre mecánica, electrónica y control.",
    ],
  },
  {
    id: "maintenance",
    title: "Mantenimiento industrial y biomédico",
    subtitle: "Diagnóstico, reparación y disponibilidad de equipos.",
    description:
      "Mantenemos equipos electromecánicos, industriales y biomédicos para sostener su continuidad operativa, con enfoque preventivo, correctivo y predictivo.",
    icon: "Wrench",
    category: "Mantenimiento",
    detailedDescription:
      "Inspección, limpieza, ajuste y reparación con criterio técnico. Ejemplos reales: inspección y mantenimiento de una mesa quirúrgica y reparación integral de un caldero de agua caliente. Trabajamos para maximizar la disponibilidad y reducir paradas.",
    technologies: ["Electromecánica", "Instrumentación", "Equipos biomédicos", "Mantenimiento predictivo"],
    benefits: [
      "Diagnóstico técnico antes de intervenir, no a ciegas.",
      "Mantenimiento preventivo, correctivo y predictivo.",
      "Experiencia en equipos médicos e industriales.",
      "Foco en disponibilidad y reducción de paradas.",
    ],
    problemsSolved: [
      "Equipos críticos con fallas recurrentes o paradas.",
      "Falta de mantenimiento preventivo planificado.",
      "Equipos biomédicos fuera de parámetros de operación segura.",
    ],
  },
  {
    id: "design-3d",
    title: "Diseño 3D y fabricación digital",
    subtitle: "Modelado, escaneo e impresión 3D con fidelidad.",
    description:
      "Diseñamos y reconstruimos piezas en 3D con precisión dimensional, listas para impresión o fabricación.",
    icon: "Boxes",
    category: "Diseño",
    detailedDescription:
      "Escaneo de modelos físicos, refinamiento en Blender y preparación de archivos STL. Ejemplos reales: placas dentales para laboratorio odontológico y modelos anatómicos a escala 1:1 publicados en Cults3D.",
    technologies: ["Blender", "Escaneo 3D", "Impresión 3D", "STL", "CAD"],
    benefits: [
      "Reconstrucción digital con precisión 1:1.",
      "Optimización estructural antes de imprimir.",
      "Archivos STL listos para fabricación.",
      "Experiencia en piezas técnicas y anatómicas.",
    ],
    problemsSolved: [
      "Piezas sin repuesto que hay que reconstruir.",
      "Modelos físicos que se necesitan en digital.",
      "Prototipos que requieren precisión dimensional.",
    ],
  },
  {
    id: "mechanical-design",
    title: "Diseño y fabricación mecánica",
    subtitle: "De planos industriales a piezas listas para fabricar.",
    description:
      "Llevamos conceptos a planos mecánicos y eléctricos, ensamblajes 3D y soluciones metalmecánicas listas para fabricar, validar e iterar.",
    icon: "Hammer",
    category: "Diseño",
    detailedDescription:
      "Diseño mecánico y eléctrico con criterio industrial: planos, ensamblajes y fabricación de estructuras, soportes y soluciones a medida con soldadura y mecánica aplicada en taller.",
    technologies: ["CAD", "Diseño mecánico", "Metalmecánica", "Soldadura", "Planos eléctricos"],
    benefits: [
      "Del concepto al plano listo para fabricar.",
      "Diseño mecánico y eléctrico bajo un mismo criterio.",
      "Fabricación de estructuras y soportes a medida.",
      "Validación e iteración antes de producir en serie.",
    ],
    problemsSolved: [
      "Ideas sin planos formales para fabricar.",
      "Necesidad de estructuras o soportes a medida.",
      "Soluciones mecánicas que no existen en catálogo.",
    ],
  },
];

// Casos reales de OhmRoyal (extraídos del portafolio original ohmroyal.org).
// Selección curada que muestra el rango multidisciplinar: software, control
// electrónico, mantenimiento biomédico y diseño 3D.
export const caseStudies: CaseStudy[] = [
  {
    id: "reactilab",
    title: "ReactiLab: gestión digital de laboratorio químico",
    category: "Desarrollo FullStack",
    description:
      "Plataforma web para digitalizar el inventario químico, la aprobación de movimientos de sustancias controladas y el cumplimiento normativo de un laboratorio que operaba en papel.",
    client: "Laboratorio químico (Ecuador)",
    results: [
      "Procesos que antes se llevaban en papel, ahora digitales y auditables.",
      "Trazabilidad completa del uso de reactivos y alertas automáticas de caducidad.",
      "Gestión integrada de residuos y reportes para auditoría en un clic.",
      "Sitio en producción y público en reacti-lab.com, con pasarela de pagos PayPhone.",
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Firebase", "PayPhone"],
    imageUrl: "/work/reactilab.webp",
    challenge:
      "El laboratorio gestionaba el inventario de reactivos, los movimientos de sustancias controladas y el cumplimiento normativo en papel. El proceso era lento, difícil de auditar y propenso a errores en fechas de caducidad y trazabilidad.",
    solution:
      "Construimos una plataforma web con React, TypeScript y Tailwind en el frontend, Node.js en el backend y Firebase como base de datos. Incluye trazabilidad del uso de reactivos, alertas de caducidad, gestión de residuos, reportes de auditoría en un clic y planes de servicio con pasarela de pagos PayPhone (Ecuador).",
  },
  {
    id: "maquina-360",
    title: "Máquina 360 de alta estabilidad para eventos",
    category: "Mecánica, electrónica y control",
    description:
      "Diseño y fabricación de una plataforma giratoria 360° reforzada para uso recreativo intensivo, orientada a la seguridad de los usuarios y a la estabilidad de grabación durante saltos y baile.",
    client: "Productora de eventos (Trébol Plus)",
    results: [
      "Equipo 360 reforzado y operativo, apto para uso recreativo con cargas dinámicas.",
      "Mejora notable de la estabilidad de grabación frente a configuraciones convencionales.",
      "Control integral desde app móvil para operación rápida durante el evento.",
      "Entrega final validada en campo con el cliente.",
    ],
    technologies: ["Diseño CAD", "Arduino Nano", "Bluetooth", "App móvil", "Electrónica AC-DC"],
    imageUrl: "/work/maquina-360.webp",
    challenge:
      "Las máquinas 360 del mercado fallan en estabilidad y seguridad bajo cargas dinámicas (saltos, baile), lo que compromete tanto la integridad del usuario como la calidad de la grabación.",
    solution:
      "Proyecto integral de ingeniería mecánica, electrónica y control: desde el análisis de fallas comunes del mercado hasta el diseño CAD, la construcción reforzada, el control inalámbrico y la validación en campo. Integra un sistema eléctrico AC-DC para el motor y control con Arduino Nano + Bluetooth, con una app móvil para encendido, velocidad, luces LED neón y máquina de humo.",
  },
  {
    id: "mesa-quirurgica",
    title: "Inspección y mantenimiento de mesa quirúrgica",
    category: "Mantenimiento biomédico",
    description:
      "Servicio técnico de inspección, limpieza profunda y ajuste mecánico-eléctrico para restablecer la operación segura y precisa de una mesa quirúrgica.",
    client: "Área biomédica / clínica",
    results: [
      "Mesa quirúrgica operativa dentro de parámetros funcionales para uso clínico.",
      "Mecanismos móviles críticos limpiados y lubricados.",
      "Desplazamientos y posicionamientos verificados desde el panel de mando.",
    ],
    technologies: ["Inspección técnica", "Electromecánica", "Mantenimiento biomédico"],
    imageUrl: "/work/mesa-quirurgica.webp",
    challenge:
      "Una mesa quirúrgica presentaba desplazamientos y posicionamientos imprecisos, con riesgo para un uso clínico seguro.",
    solution:
      "Inspección técnica completa de componentes mecánicos y eléctricos, limpieza profunda y lubricación de los mecanismos móviles críticos, y verificación de los desplazamientos y posicionamientos desde el panel de mando hasta dejar el equipo operativo.",
  },
  {
    id: "placas-dentales-3d",
    title: "Placas dentales para modelos de trabajo (diseño 3D)",
    category: "Diseño 3D y fabricación digital",
    description:
      "Diseño y reconstrucción digital de placas dentales para moldes y modelos de laboratorio odontológico, con fidelidad dimensional y mejoras mecánicas, listas para impresión 3D.",
    client: "Laboratorio odontológico",
    results: [
      "Placas reconstruidas con precisión dimensional 1:1.",
      "Resistencia estructural optimizada respecto a los modelos originales.",
      "Archivos STL listos para impresión 3D.",
      "Publicadas y disponibles en Cults3D.",
    ],
    technologies: ["Blender", "Escaneo 3D", "Impresión 3D", "STL"],
    imageUrl: "/work/placas-dentales.webp",
    challenge:
      "El laboratorio necesitaba placas dentales (N° 1, 2, 3 y 5) con fidelidad dimensional 1:1 y mayor resistencia estructural, partiendo de modelos físicos existentes.",
    solution:
      "Digitalizamos las piezas mediante escaneo de los modelos originales y las refinamos en Blender para optimizar la resistencia estructural, mantener la precisión 1:1 y prepararlas para impresión 3D en formato STL.",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "kubernetes-scaling",
    title: "HPA en Kubernetes: más allá de la CPU como única métrica de escala",
    slug: "como-escalar-aplicaciones-kubernetes",
    category: "Cloud & DevOps",
    author: {
      name: "Alejandro Ruiz",
      role: "DevOps Engineer",
    },
    date: "2026-05-18",
    readTime: "6 min",
    excerpt:
      "Escalar por CPU funciona hasta cierto punto. Cuando la latencia sube y la CPU no, el autoscaler no reacciona. Cómo configurar métricas personalizadas en HPA para cubrir esos casos.",
    content:
      "Escalar una aplicación no consiste simplemente en instanciar más servidores. En este artículo detallamos cómo configurar el Horizontal Pod Autoscaler de Kubernetes basándonos no solo en uso de CPU, sino en métricas personalizadas como latencia de consulta, conexiones activas en Redis e hilos activos de HTTP. Veremos cómo estructurar los límites de recursos de CPU y Memoria (Limits y Requests) para evitar interrupciones por OOMKilled, y qué herramientas de observabilidad ayudan a tomar esas decisiones con datos reales...",
    tags: ["Kubernetes", "CI/CD", "AWS", "Docker"],
    likes: 124,
  },
  {
    id: "ia-trends-2026",
    title: "Lo que aprendimos construyendo agentes RAG en producción durante 2025",
    slug: "tendencias-ia-2026-agentes-autonomos",
    category: "IA y Machine Learning",
    author: {
      name: "Sofía Castillo",
      role: "ML Engineer",
    },
    date: "2026-04-30",
    readTime: "8 min",
    excerpt:
      "Los primeros prototipos RAG eran rápidos de construir y difíciles de mantener. Estas son las decisiones de diseño que más impacto tuvieron en proyectos reales.",
    content:
      "Construir un prototipo RAG es relativamente rápido. Llevarlo a producción con latencia aceptable, costos predecibles y resultados verificables es otra historia. En este artículo repasamos las decisiones que más cambiaron los resultados en proyectos reales: cómo estructurar el chunking, qué estrategias de reranking valen la pena, cuándo conviene caching de embeddings, y cómo medir precisión sin necesitar un equipo de evaluación dedicado...",
    tags: ["IA Generativa", "LLMs", "Pinecone", "Machine Learning"],
    likes: 247,
  },
  {
    id: "nextjs-architectures",
    title: "Server Components en Next.js 15: cuándo aportan y cuándo complican",
    slug: "arquitecturas-modernas-nextjs-15-tailwind-v4",
    category: "Desarrollo Web",
    author: {
      name: "Mauricio Fernández",
      role: "Frontend Engineer",
    },
    date: "2026-03-12",
    readTime: "5 min",
    excerpt:
      "Server Components resuelven problemas reales de carga inicial y SEO. También introducen restricciones que no siempre valen el tradeoff. Cuándo usarlos y cuándo no.",
    content:
      "Next.js 15 estabilizó la renderización asíncrona de layouts con React 19. En la práctica, Server Components reducen el bundle del cliente y mejoran el tiempo a primer byte, pero agregan fricción cuando necesitas estado interactivo o contexto compartido. En este artículo mostramos los patrones que más usamos, los errores de hidratación más frecuentes que encontramos, y cómo estructuramos la frontera entre server y client para mantener el código manejable...",
    tags: ["Next.js", "Tailwind CSS", "React", "Frontend"],
    likes: 189,
  },
  {
    id: "api-security-hardening",
    title: "BOLA en APIs: el fallo de autorización que más encontramos en auditorías",
    slug: "guia-seguridad-apis-modernas",
    category: "Ciberseguridad",
    author: {
      name: "Carlos Mendoza",
      role: "Security Engineer",
    },
    date: "2026-02-25",
    readTime: "7 min",
    excerpt:
      "Broken Object Level Authorization aparece en casi todas las APIs que auditamos. No es un bug exótico: es un patrón que se instala solo cuando la autorización se añade después del diseño.",
    content:
      "BOLA (Broken Object Level Authorization) es el fallo más común que encontramos en auditorías de APIs internas. El problema no es técnico en el sentido clásico: el código funciona, los tests pasan, pero cualquier usuario autenticado puede acceder a recursos de otro usuario cambiando un ID en la URL. En este artículo explicamos por qué ocurre, cómo detectarlo con pruebas automatizadas, y cómo estructurar la validación de autorización a nivel de objeto para que el patrón sea difícil de omitir...",
    tags: ["Ciberseguridad", "OWASP", "APIs", "Seguridad"],
    likes: 156,
  },
];

export const careerJobs: CareerOpportunity[] = [
  {
    id: "frontend-engineer",
    title: "Frontend Engineer (React / Next.js)",
    department: "Frontend",
    type: "Remoto / Tiempo Completo",
    location: "Sedes Globales (Latam Friendly)",
    experience: "4+ años",
    salaryRange: "4,000 - 6,000 USD / mes",
    requirements: [
      "Dominio excepcional de React (React 18/19), Next.js, y TypeScript.",
      "Experiencia avanzada implementando animaciones interactivas fluidas con GSAP o Framer Motion.",
      "Comprensión exhaustiva de Core Web Vitals, renderizado parcial hidratado (hydration models) e inyección CSS óptima.",
      "Manejo avanzado de herramientas de modelaje visual (Figma) y transformaciones de diseño a código con precisión de pixel.",
    ],
    responsibilities: [
      "Diseñar y construir components reutilizables, escalables y optimizados para múltiples plataformas web OhmRoyal.",
      "Colaborar con el equipo de UI/UX para concebir e iterar interacciones web excepcionales y elegantes.",
      "Auditar, refinar y corregir problemas de rendimiento y carga en interfaces de clientes empresariales.",
      "Contribuir activamente a nuestros estándares internos de diseño de movimiento y guías estéticas.",
    ],
  },
];

export const clientCertifications = [
  { id: "aws", name: "AWS Certified Partner", category: "Nube & Infraestructura" },
  { id: "gcp", name: "Google Cloud Partner", category: "Nube & Datos" },
  { id: "iso", name: "ISO/IEC 27001", category: "Ciberseguridad Empresarial" },
  { id: "scrum", name: "Scrum Alliance Certified", category: "Gestión Agil & Soluciones" },
  { id: "cisco", name: "Cisco Security Certified", category: "Redes & Fortificación" },
  { id: "k8s", name: "Kubernetes Certified Admin", category: "DevOps & Contenedores" },
] as const;

export const companyDifferentiators = [
  {
    title: "Arquitectura Elástica de Nivel Premium",
    description:
      "Cada línea de código que escribimos está optimizada para responder instantáneamente, utilizando layouts modernos desacoplados y autoescalado inteligente que reduce tus costos operativos.",
  },
  {
    title: "Inteligencia Artificial Pragmática",
    description:
      "No realizamos desarrollos experimentales ineficientes. Incorporamos agentes de lenguaje, análisis de tendencias y RAG en tus sistemas empresariales de manera lógica para disparar el retorno de inversión (ROI).",
  },
  {
    title: "Seguridad Militar de Ingeniería",
    description:
      "Integramos tests automáticos frente a vectores de ataque OWASP y encriptación de claves y secretos como un estándar obligatorio en todas nuestras entregas desde el primer día.",
  },
  {
    title: "Enfoque Corporativo Centrado en UX",
    description:
      "Un software excelente es inútil si tus analistas o clientes finales no saben utilizarlo. Estudiamos con analíticas reales para ofrecer interfaces limpias, sobrias y sofisticadamente intuitivas.",
  },
] as const;
