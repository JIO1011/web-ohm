import Link from "next/link";
import { ArrowRight, Calendar, FileCheck2, GitBranch, MessagesSquare, ShieldCheck } from "lucide-react";
import { clientCertifications } from "@/data/mock-data";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  focus: string;
  initials: string;
  color: string;
}

const TEAM_MEMBERS: readonly TeamMember[] = [
  { id: "diego-royal",   name: "Diego Ohm-Royal",  role: "Co-founder y dirección técnica", focus: "Arquitectura, seguridad y relación directa con clientes nuevos.", initials: "DO", color: "bg-brand-500" },
  { id: "sofia-castillo",name: "Sofía Castillo",    role: "Dirección de IA",                focus: "Pipelines RAG, evaluación de modelos y proyectos de NLP.",           initials: "SC", color: "bg-ink-700" },
  { id: "alejandro-ruiz",name: "Alejandro Ruiz",    role: "Principal Cloud y DevOps",       focus: "Terraform en AWS y GCP, observabilidad y reducción de costos.",      initials: "AR", color: "bg-ink-600" },
  { id: "isabella-velez",name: "Isabella Vélez",    role: "Diseño de producto",             focus: "Sistemas de diseño, prototipado y handoff a desarrollo.",             initials: "IV", color: "bg-brand-700" },
] as const;

const PRINCIPLES = [
  { Icon: GitBranch,      title: "Trabajamos en tu repositorio.", body: "Desde el primer commit el código vive en tu cuenta de GitHub o GitLab." },
  { Icon: Calendar,       title: "Sprints semanales con demo.",   body: "Cada semana mostramos lo construido. Tú decides si seguimos o ajustamos." },
  { Icon: MessagesSquare, title: "Sin capas de PMs.",             body: "La persona técnica responsable está en las llamadas. Hablas con quien escribe el código." },
  { Icon: FileCheck2,     title: "Documentación al cierre.",      body: "Runbooks, diagramas y sesión de handoff. No dejamos un repo y un correo de despedida." },
] as const;

const CERT_DISPLAY: Record<string, string> = {
  aws: "AWS Partner", gcp: "Google Cloud Partner", iso: "ISO/IEC 27001",
  scrum: "Scrum Alliance", cisco: "Cisco Security", k8s: "Kubernetes Certified Admin",
};

export default function AboutSection() {
  return (
    <div className="text-ink-900">
      {/* HERO — dark navy */}
      <section id="about-hero" className="relative overflow-hidden bg-ink-900 pb-24 pt-32 sm:pb-28 sm:pt-36">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, oklch(0.963 0.013 145) 1px, transparent 1px)", backgroundSize: "36px 36px" }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <p className="font-mono text-xs tracking-[0.08em] text-brand-400">Nosotros</p>
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink-0 sm:text-5xl lg:text-6xl">
              Somos un equipo pequeño con criterio propio.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-ink-400">
              OhmRoyal nació para hacer software con la rigurosidad de un equipo interno y la
              velocidad de una agencia. Trabajamos remoto desde LATAM con clientes en LATAM y
              España.
            </p>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section id="about-philosophy" className="bg-ink-0 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-5">
              <p className="font-mono text-xs tracking-[0.08em] text-brand-600">Cómo lo entendemos</p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
                Software que tu equipo pueda mantener.
              </h2>
            </div>
            <div className="space-y-5 lg:col-span-7">
              <p className="text-lg leading-relaxed text-ink-700">
                Cuando arrancamos OhmRoyal, los proyectos que veíamos morir tenían en común
                una cosa: los habían entregado y nadie sabía cómo seguir. Repos sin README,
                infraestructura configurada a mano, secretos en un correo.
              </p>
              <p className="text-lg leading-relaxed text-ink-700">
                Decidimos hacer lo opuesto. Cada decisión técnica la tomamos imaginando al
                desarrollador que va a abrir el repo seis meses después de que terminemos. Si
                esa persona no podría continuar, lo que hicimos no estuvo bien.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLES — white */}
      <section id="about-principles" className="border-y border-ink-100 bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="mb-12 max-w-2xl space-y-3">
            <p className="font-mono text-xs tracking-[0.08em] text-brand-600">Principios</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              Cuatro reglas que ningún cliente ha tenido que pedirnos.
            </h2>
          </header>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {PRINCIPLES.map(({ Icon, title, body }, idx) => (
              <li key={idx} className="space-y-4 overflow-hidden rounded-2xl border border-ink-200 bg-ink-0">
                <div className="h-1 bg-brand-500" />
                <div className="space-y-3 px-6 pb-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-display text-xl font-semibold text-ink-900">{title}</h3>
                  <p className="text-sm leading-relaxed text-ink-600">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TEAM — dark navy */}
      <section id="about-team" className="bg-ink-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="mb-12 max-w-2xl space-y-3">
            <p className="font-mono text-xs tracking-[0.08em] text-brand-400">Equipo</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-0 sm:text-4xl">
              Las cuatro personas que verás en las llamadas.
            </h2>
            <p className="text-base leading-relaxed text-ink-400">
              Tu proyecto pasa por uno o dos de nosotros directamente, según el alcance. No
              subcontratamos.
            </p>
          </header>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_MEMBERS.map((member) => (
              <li key={member.id} className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-800 transition-colors hover:border-ink-600">
                <div className={`h-2 ${member.color}`} />
                <div className="flex flex-col gap-4 p-6">
                  <div
                    aria-hidden="true"
                    className={`flex h-14 w-14 items-center justify-center rounded-xl ${member.color} font-display text-xl font-bold text-white shadow-md`}
                  >
                    {member.initials}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-ink-0">{member.name}</h3>
                    <p className="text-sm text-ink-400">{member.role}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-500">{member.focus}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section id="about-certifications" className="bg-ink-0 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-5">
              <p className="font-mono text-xs tracking-[0.08em] text-brand-600">Certificaciones</p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                Lo que aprobamos formalmente.
              </h2>
              <p className="text-base leading-relaxed text-ink-600">
                Verificables con cada proveedor. Las renovamos cuando expiran o las sacamos del
                listado.
              </p>
            </div>
            <ul className="space-y-px overflow-hidden rounded-2xl border border-ink-200 bg-ink-200 lg:col-span-7">
              {clientCertifications.map((cert) => (
                <li key={cert.id} className="flex items-center justify-between gap-4 bg-white px-6 py-5">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 flex-shrink-0 text-brand-500" strokeWidth={1.5} />
                    <div>
                      <p className="text-base font-medium text-ink-900">{CERT_DISPLAY[cert.id] ?? cert.name}</p>
                      <p className="text-sm text-ink-500">{cert.category}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about-cta" className="bg-ink-0 px-4 pb-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-ink-200 bg-white px-6 py-14 sm:px-12 sm:py-16">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="space-y-3 lg:col-span-7">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                  ¿Conversamos sobre tu proyecto?
                </h2>
                <p className="text-base leading-relaxed text-ink-600">
                  30 minutos para entender qué necesitas. Sin presión y sin presentación
                  corporativa.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-end">
                <Link
                  href="/calcular-proyecto"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-md shadow-brand-500/25 transition-all hover:bg-brand-600 active:scale-95"
                >
                  Agendar diagnóstico
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </Link>
                <Link
                  href="/trabajo"
                  className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-ink-0 px-6 py-3 text-sm font-medium text-ink-800 transition-colors hover:border-ink-300 hover:bg-ink-50"
                >
                  Ver casos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
