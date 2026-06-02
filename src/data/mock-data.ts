import type {
  Service,
  CaseStudy,
  BlogPost,
  CareerOpportunity,
} from "@/types";

export const servicesData: Service[] = [
  {
    id: "frontend",
    title: "Frontend moderno",
    subtitle: "Interfaces rápidas, accesibles y mantenibles.",
    description:
      "Construimos interfaces web en React, Next.js y TypeScript. Priorizamos tiempos de carga reales, accesibilidad y un código que tu equipo pueda mantener cuando ya no estemos.",
    icon: "LayoutGrid",
    category: "Desarrollo",
    detailedDescription:
      "El frontend es donde se gana o se pierde la primera impresión. Trabajamos con la App Router de Next.js, Server Components cuando aportan, y un sistema de diseño en Tailwind. Medimos Core Web Vitals con datos reales y dejamos el proyecto con linting, testing y reglas de accesibilidad integradas en CI.",
    technologies: ["React 19", "Next.js 15", "TypeScript", "Tailwind CSS v4", "Framer Motion", "Playwright"],
    benefits: [
      "Tiempos de carga LCP por debajo de 1.5 s en condiciones reales.",
      "Accesibilidad WCAG 2.1 AA verificada con herramientas automatizadas.",
      "Server Components y rutas dinámicas donde aportan, no por moda.",
      "Repositorio con linting, testing y CI listos para que tu equipo continúe.",
    ],
    problemsSolved: [
      "Páginas lentas que pierden tráfico orgánico por mala puntuación de Web Vitals.",
      "Frontends legacy que cuesta evolucionar sin romper otras partes.",
      "Mala experiencia móvil en formularios, navegación o carga inicial.",
    ],
  },
  {
    id: "backend",
    title: "Backend y APIs",
    subtitle: "Servicios escalables sobre Node, Python o Go.",
    description:
      "Diseñamos APIs REST o GraphQL y los servicios que las sostienen. Pensamos en operación desde el inicio: logs útiles, métricas, despliegues sin downtime y costos visibles.",
    icon: "Server",
    category: "Desarrollo",
    detailedDescription:
      "Decidimos la tecnología por el caso, no por preferencia. Trabajamos con Node, Python o Go según el equipo y el problema. Cada API queda con autenticación, validación de esquemas, observabilidad básica y pruebas de integración que se ejecutan en CI.",
    technologies: ["Node.js", "NestJS", "Python", "PostgreSQL", "Redis", "OpenAPI", "Sentry"],
    benefits: [
      "Latencias y errores monitoreados desde el primer día.",
      "Validación de entrada con Zod o equivalentes, no a mano.",
      "Patrón de cola para tareas pesadas que liberan el hilo HTTP.",
      "Documentación OpenAPI generada del código, no escrita aparte.",
    ],
    problemsSolved: [
      "APIs internas indocumentadas que nadie en el equipo sabe operar.",
      "Cuellos de botella en consultas que escalan mal a partir de cierto volumen.",
      "Datos corruptos por concurrencia mal manejada en transacciones.",
    ],
  },
  {
    id: "ai-ml",
    title: "Integración de IA",
    subtitle: "Agentes y RAG sobre LLMs comerciales.",
    description:
      "Conectamos modelos como Gemini o GPT a tus datos con flujos RAG, agentes funcionales y validación de salida. Empezamos con un caso de uso concreto, no con un proyecto de investigación.",
    icon: "BrainCircuit",
    category: "Innovación",
    detailedDescription:
      "La IA generativa rinde cuando hay un caso claro: contestar consultas internas con tu documentación, clasificar tickets, redactar borradores, extraer datos de PDFs. Empezamos por uno, medimos precisión y costo, y crecemos solo si el resultado lo justifica.",
    technologies: ["Gemini 2.0 Flash", "OpenAI API", "LangChain", "pgvector", "Pinecone", "Python"],
    benefits: [
      "Pipeline RAG con métricas de precisión por consulta, no estimaciones.",
      "Control de costos por token con caché y reranking cuando aplica.",
      "Salida estructurada validada con Zod o pydantic.",
      "Plan claro de qué hace falta en datos antes de pasar a producción.",
    ],
    problemsSolved: [
      "Equipos saturados de consultas repetitivas que un agente puede resolver.",
      "Documentación interna que nadie consulta porque está en cinco lugares.",
      "Procesos manuales de extracción de datos desde PDFs o correos.",
    ],
  },
  {
    id: "mobile",
    title: "Aplicaciones móviles",
    subtitle: "iOS y Android con React Native o Flutter.",
    description:
      "Construimos apps móviles con una base de código compartida y la cuota de nativo que el caso requiera. Publicamos en App Store y Google Play y dejamos el pipeline funcionando.",
    icon: "Smartphone",
    category: "Desarrollo",
    detailedDescription:
      "Elegimos React Native o Flutter según el equipo y los requisitos de hardware (cámara, sensores, biometría). Diseñamos para uso offline cuando importa, optimizamos consumo de batería y dejamos los flujos de publicación documentados.",
    technologies: ["React Native", "Expo", "Flutter", "Swift", "Kotlin", "EAS Build", "Sentry"],
    benefits: [
      "Una base de código para iOS y Android, con módulos nativos cuando aplica.",
      "Modo offline con sincronización cuando vuelve la conexión.",
      "Publicación en stores con perfiles, certificados y release notes.",
      "Crash reporting y telemetría integrados desde la versión 1.0.",
    ],
    problemsSolved: [
      "Mantener dos equipos separados para iOS y Android cuando no es necesario.",
      "Apps que se sienten lentas en gama media o baja por sobreoptimizar visualmente.",
      "Falta de visibilidad sobre crashes reales en producción.",
    ],
  },
  {
    id: "ui-ux",
    title: "Diseño de producto",
    subtitle: "Interfaces que tu equipo puede mantener.",
    description:
      "Diseñamos interfaces y flujos pensando en cómo se construirán. Entregamos un sistema de diseño usable por desarrolladores, no un PDF estático que se quede en Figma.",
    icon: "Cpu",
    category: "Diseño",
    detailedDescription:
      "Trabajamos en Figma con componentes que mapean a los del código: si el botón tiene cuatro variantes en el sistema, son cuatro en el repo. Investigamos con usuarios reales cuando el alcance lo permite y validamos decisiones con prototipos clicables antes de programar.",
    technologies: ["Figma", "Auto Layout", "Variables", "Tokens Studio", "Tailwind", "Storybook"],
    benefits: [
      "Sistema de diseño con tokens compartidos entre Figma y el código.",
      "Prototipos clicables con flujos completos antes del desarrollo.",
      "Documentación de uso para cada componente, no solo el render.",
      "Auditoría de accesibilidad incluida en cada componente.",
    ],
    problemsSolved: [
      "Inconsistencia entre lo diseñado en Figma y lo que termina en producción.",
      "Sistemas de diseño que envejecen porque diseño y código se desincronizan.",
      "Flujos confusos descubiertos tarde, cuando ya están programados.",
    ],
  },
  {
    id: "qa-testing",
    title: "QA automatizado",
    subtitle: "Pruebas que se ejecutan solas en cada commit.",
    description:
      "Reemplazamos pruebas manuales repetitivas por pipelines de Playwright o Cypress que se ejecutan en CI. Dejamos a tu equipo con cobertura razonable y reportes legibles.",
    icon: "ShieldAlert",
    category: "Seguridad",
    detailedDescription:
      "Identificamos los flujos críticos (registro, pago, exportación de datos) y los cubrimos con pruebas end-to-end. Agregamos pruebas unitarias donde aportan más que las e2e. Integramos los reportes en GitHub Actions o GitLab CI para que cada PR muestre el estado.",
    technologies: ["Playwright", "Cypress", "Vitest", "Jest", "GitHub Actions", "Sentry"],
    benefits: [
      "Cobertura de flujos críticos automatizada y visible en cada PR.",
      "Reportes de fallos con video y trace de Playwright para reproducir.",
      "Pipelines rápidos: bajo 10 minutos en proyectos medianos.",
      "Estrategia clara de qué probar a mano y qué automatizar.",
    ],
    problemsSolved: [
      "Miedo a desplegar viernes por la tarde porque nadie sabe qué se rompió.",
      "Tickets repetidos por bugs en flujos que ya fueron arreglados.",
      "QA manual saturado revisando regresiones en lugar de explorar.",
    ],
  },
  {
    id: "cloud-devops",
    title: "Cloud y DevOps",
    subtitle: "Infraestructura como código en AWS o GCP.",
    description:
      "Diseñamos y operamos infraestructura en AWS o GCP. Todo en Terraform, con pipelines de despliegue versionados y métricas de costo visibles desde el primer mes.",
    icon: "Cloud",
    category: "Innovación",
    detailedDescription:
      "Pasamos infraestructura manual a código revisable. Configuramos pipelines de CI/CD que despliegan sin downtime, monitoreo con Prometheus o CloudWatch y alertas que avisan algo accionable, no ruido.",
    technologies: ["AWS", "Google Cloud", "Terraform", "Docker", "Kubernetes", "GitHub Actions", "Prometheus"],
    benefits: [
      "Infraestructura versionada, revisable y replicable entre entornos.",
      "Despliegues sin downtime con rollback automático ante fallos.",
      "Alertas con SLO claros, no umbrales arbitrarios.",
      "Reporte de costos por servicio y entorno desde el primer mes.",
    ],
    problemsSolved: [
      "Despliegues manuales que solo una persona del equipo sabe ejecutar.",
      "Cuentas cloud con costos descontrolados sin visibilidad por servicio.",
      "Entornos de staging que no se parecen a producción.",
    ],
  },
  {
    id: "cybersecurity",
    title: "Ciberseguridad y DevSecOps",
    subtitle: "Auditorías OWASP y endurecimiento práctico.",
    description:
      "Hacemos auditorías de código y endurecimiento de APIs siguiendo OWASP. Integramos análisis estático y de dependencias en CI, y dejamos un plan de remediación priorizado.",
    icon: "Shield",
    category: "Seguridad",
    detailedDescription:
      "Empezamos con un alcance acotado (una API, un microservicio, una integración). Documentamos hallazgos con CVSS, sugerimos mitigación concreta y validamos la corrección con un retest. Incluimos buenas prácticas para que el equipo evite el patrón en el futuro.",
    technologies: ["OWASP Top 10", "Burp Suite", "Semgrep", "Trivy", "HashiCorp Vault", "AWS IAM"],
    benefits: [
      "Reporte de vulnerabilidades con severidad CVSS y pasos de mitigación.",
      "Retest incluido para validar correcciones aplicadas.",
      "Análisis estático integrado en CI para detectar regresiones.",
      "Rotación de secretos automatizada con Vault o servicios equivalentes.",
    ],
    problemsSolved: [
      "APIs internas expuestas sin saberlo por configuración heredada.",
      "Secretos hardcodeados en repositorios viejos sin política de rotación.",
      "Dependencias con CVEs conocidas en producción sin proceso de actualización.",
    ],
  },
];

export const caseStudies: CaseStudy[] = [
  {
    id: "mozaico-interactivo",
    title: "Visualizador interactivo para Mozaico",
    category: "Plataforma de datos",
    description:
      "Reescribimos el core de una plataforma de visualización de datos que colapsaba bajo carga concurrente. Bajamos la latencia de consulta y movimos la infraestructura a AWS gestionada por Terraform.",
    client: "Mozaico S.A.S.",
    results: [
      "Latencia de consulta: de 4.8 s a 220 ms con caché Redis y consultas optimizadas.",
      "Soporte estable de 15.000 sesiones concurrentes en pruebas de carga.",
      "Infraestructura AWS gestionada por Terraform, con entornos de staging y producción idénticos.",
      "Reducción del 30 % en el costo mensual de cómputo gracias al autoescalado por métricas reales.",
    ],
    technologies: ["Next.js", "D3.js", "Express", "Redis", "AWS ECS", "Terraform", "PostgreSQL"],
    imageUrl: "/mozaico_preview",
    challenge:
      "El visualizador previo se construyó hace años sobre una stack que ya no escalaba. A partir de 300 analistas concurrentes, las consultas tardaban más de 4 segundos y la CPU de la base de datos quedaba en 100 %. El equipo interno tenía que reiniciar servicios manualmente varias veces por semana.",
    solution:
      "Movimos el renderizado interactivo al cliente con D3 sobre Next.js. Introdujimos una capa de caché Redis para las consultas más frecuentes y reescribimos las queries más pesadas con índices compuestos. La infraestructura pasó a contenedores Docker sobre AWS ECS detrás de un Application Load Balancer, todo descrito en Terraform.",
  },
  {
    id: "securevault-enterprise",
    title: "SecureVault: auditoría y endurecimiento",
    category: "Ciberseguridad y DevOps",
    description:
      "Auditoría OWASP, migración a Kubernetes y gestión de secretos para una fintech de pagos móviles. Acortamos el ciclo de parches de seguridad de días a minutos.",
    client: "SecureVault Ltd",
    results: [
      "Cero vulnerabilidades críticas tras la auditoría OWASP y el retest.",
      "Capacidad de pico verificada de 850 TPS en pruebas de carga sobre Kubernetes EKS.",
      "Reducción del tiempo de despliegue de parches de seguridad de 3 días a 12 minutos.",
      "Reporte de hallazgos con severidad CVSS y plan de remediación priorizado.",
    ],
    technologies: ["Kubernetes EKS", "GitHub Actions", "HashiCorp Vault", "Go", "AWS IAM", "Trivy"],
    imageUrl: "/securevault_preview",
    challenge:
      "La infraestructura de SecureVault corría sobre servidores manuales sin redundancia ni rotación automatizada de secretos. Cada parche de seguridad implicaba downtime, y la siguiente auditoría externa de cumplimiento estaba a tres meses.",
    solution:
      "Migramos los servicios críticos a Kubernetes EKS con redes privadas y políticas de pod restringidas. Los secretos pasaron a HashiCorp Vault con rotación automática. Integramos análisis estático con Semgrep y escaneo de imágenes con Trivy en GitHub Actions, de modo que cada PR muestra el estado de seguridad antes del merge.",
  },
  {
    id: "aura-ai-analytics",
    title: "Aura: predicción de stock con RAG y modelos propios",
    category: "Integración de IA",
    description:
      "Construimos un sistema que predice stock estacional para una cadena de retail y lo combina con un agente conversacional sobre datos internos para que los operadores consulten sin escribir SQL.",
    client: "Aura Retail Group",
    results: [
      "Precisión del 93 % en predicción de stock estacional a 60 días, validada contra el histórico real.",
      "Reducción del inventario excedente equivalente a USD 1.2 M anuales en los primeros 12 meses.",
      "Latencia del agente conversacional bajo 500 ms en el percentil 95.",
      "Integración con el ERP existente en 4 semanas, sin cambios en sus tablas operativas.",
    ],
    technologies: ["Python", "FastAPI", "PyTorch", "Pinecone", "LangChain", "Gemini 2.0", "Next.js"],
    imageUrl: "/aura_ai_preview",
    challenge:
      "Aura pronosticaba inventario con hojas de cálculo actualizadas una vez al mes. El error promedio dejaba millones inmovilizados en bodega. Además, el equipo de operaciones dependía del área de datos para responder cualquier consulta histórica.",
    solution:
      "Entrenamos un modelo en PyTorch con cuatro años de ventas y movimientos de inventario, expuesto vía FastAPI. Montamos un agente RAG sobre Gemini con Pinecone para que el equipo de operaciones consulte el histórico en lenguaje natural. Todo conectado al ERP por una capa de adaptación de solo lectura, sin tocar las tablas operativas.",
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
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
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
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
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
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
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
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
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
