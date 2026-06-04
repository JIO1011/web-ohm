"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  FileText,
  Info,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type WizardTab = "planificador" | "agenda" | "contacto";

interface ProjectType {
  id: string;
  name: string;
  basePrice: number;
  baseWeeks: number;
}

interface FeatureOption {
  id: string;
  name: string;
  price: number;
  weeks: number;
}

interface BudgetTier {
  id: "lean" | "mid" | "premium";
  label: string;
  mult: number;
  note: string;
}

const PROJECT_TYPES: readonly ProjectType[] = [
  { id: "webapp", name: "Aplicación web (Next.js)", basePrice: 2500, baseWeeks: 5 },
  { id: "mobile", name: "Aplicación móvil (iOS y Android)", basePrice: 3500, baseWeeks: 6 },
  { id: "ai", name: "Integración de IA o agente RAG", basePrice: 4200, baseWeeks: 4 },
  { id: "cybersecurity", name: "Auditoría de seguridad", basePrice: 1500, baseWeeks: 2 },
  { id: "devops", name: "Migración cloud o IaC", basePrice: 2000, baseWeeks: 3 },
] as const;

const FEATURES: readonly FeatureOption[] = [
  { id: "dashboard", name: "Panel analítico", price: 600, weeks: 1 },
  { id: "payments", name: "Integración de pagos (Stripe)", price: 450, weeks: 1 },
  { id: "realtime", name: "Mensajería o sincronización en tiempo real", price: 750, weeks: 2 },
  { id: "db_custom", name: "Arquitectura Postgres y Redis", price: 700, weeks: 1 },
  { id: "i18n", name: "Multilenguaje", price: 300, weeks: 0.5 },
  { id: "sentry", name: "Monitoreo con Sentry y alertas", price: 350, weeks: 0.5 },
] as const;

const BUDGET_TIERS: Record<BudgetTier["id"], BudgetTier> = {
  lean: { id: "lean", label: "Estándar", mult: 1.0, note: "Para MVPs y proyectos compactos." },
  mid: {
    id: "mid",
    label: "Crecimiento",
    mult: 1.35,
    note: "Incluye QA reforzado y observabilidad.",
  },
  premium: {
    id: "premium",
    label: "Enterprise",
    mult: 1.8,
    note: "Incluye DevSecOps y SLA por escrito.",
  },
};

interface DayOption {
  id: string;
  label: string;
  number: string;
  month: string;
  full: string;
}

function nextBusinessDays(count = 5, from: Date = new Date()): DayOption[] {
  const MONTHS_SHORT = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  const WEEKDAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const MONTHS_FULL = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const result: DayOption[] = [];
  const cursor = new Date(from);
  let i = 0;
  while (result.length < count) {
    cursor.setDate(cursor.getDate() + 1);
    const dow = cursor.getDay();
    if (dow === 0 || dow === 6) continue;
    const day = cursor.getDate();
    const month = cursor.getMonth();
    const monthName = MONTHS_SHORT[month] ?? "";
    const fullMonth = MONTHS_FULL[month] ?? "";
    result.push({
      id: `day${i++}`,
      label: WEEKDAYS[dow] ?? "",
      number: day.toString().padStart(2, "0"),
      month: monthName,
      full: `${WEEKDAYS[dow]} ${day} de ${fullMonth}`,
    });
  }
  return result;
}

const HOUR_SLOTS = [
  { id: "h1", time: "09:00 - 09:30 AM", availability: "disponible" },
  { id: "h2", time: "11:00 - 11:30 AM", availability: "casi-lleno" },
  { id: "h3", time: "02:00 - 02:30 PM", availability: "casi-lleno" },
  { id: "h4", time: "04:30 - 05:00 PM", availability: "disponible" },
] as const;

const SERVICE_TYPES = [
  "Aún no lo tengo claro",
  "Frontend (Next.js, React)",
  "Backend o APIs",
  "Integración de IA",
  "Auditoría de ciberseguridad",
  "Cloud o DevOps",
] as const;

const STEPS: ReadonlyArray<{ id: WizardTab; label: string; number: string }> = [
  { id: "planificador", label: "Diseñar", number: "01" },
  { id: "agenda", label: "Agendar", number: "02" },
  { id: "contacto", label: "Enviar", number: "03" },
];

/* ── Cobalto + Coral palette (scoped to this standalone tool, not OhmRoyal tokens) ──
   primary  cobalt   #2f6bff   hover #2457e6   soft #eaf0ff
   extra    coral    #ff7a59   soft  #fff1ec
   warn     amber    #f59e0b   soft  #fff3d6
   ink      slate    #0f172a   muted #64748b   faint #94a3b8   line #e7eaf3 */

/* shared option-button base */
const optBase =
  "rounded-2xl border text-left transition-all duration-200 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6bff]/40";
const optIdle =
  "border-[#e7eaf3] bg-white text-[#0f172a] hover:border-[#2f6bff]/45 hover:bg-[#f6f8fd]";

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2f6bff] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#2f6bff]/25 transition-all hover:bg-[#2457e6] active:scale-[0.98]";
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-[#e7eaf3] bg-white px-4 py-2.5 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#f6f8fd]";

export default function ContactSection() {
  const searchParams = useSearchParams();
  const presetService = searchParams.get("service");
  // The /servicios catalog deep-links with the full service title, which may not
  // be one of SERVICE_TYPES (it covers hardware/mechanical too). Surface it as a
  // valid option so the <select> reflects the real choice instead of a stale value.
  const serviceOptions: readonly string[] =
    presetService && !(SERVICE_TYPES as readonly string[]).includes(presetService)
      ? [...SERVICE_TYPES, presetService]
      : SERVICE_TYPES;
  const presetTab = searchParams.get("tab") as WizardTab | null;
  const validTabs: ReadonlySet<WizardTab> = new Set(["planificador", "agenda", "contacto"]);
  const initialTab: WizardTab = presetTab && validTabs.has(presetTab) ? presetTab : "planificador";

  const [activeTab, setActiveTab] = useState<WizardTab>(initialTab);

  // STEP 1
  const [projectType, setProjectType] = useState<string>("webapp");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["dashboard"]);
  const [budgetTier, setBudgetTier] = useState<BudgetTier["id"]>("lean");

  // STEP 2
  const [availableDays] = useState<DayOption[]>(() => nextBusinessDays(5));
  const firstDay = availableDays[0];
  const [selectedDay, setSelectedDay] = useState<string>(firstDay?.id ?? "day0");
  const [selectedHour, setSelectedHour] = useState<string>(HOUR_SLOTS[1]?.time ?? "");

  // STEP 3
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [serviceType, setServiceType] = useState<string>(presetService ?? "Aún no lo tengo claro");
  const [userEditedBrief, setUserEditedBrief] = useState<boolean>(Boolean(presetService));
  const [projectBrief, setProjectBrief] = useState<string>(() => {
    if (presetService) {
      return `Quisiera una estimación para el servicio: "${presetService}".`;
    }
    return "";
  });

  // Honeypot — invisible bot trap.
  const [hpField, setHpField] = useState<string>("");

  // Submission state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseMsg, setResponseMsg] = useState<string>("");
  const [successLeadId, setSuccessLeadId] = useState<string | null>(null);

  const selectedTypeObj = useMemo<ProjectType>(
    () => PROJECT_TYPES.find((t) => t.id === projectType) ?? PROJECT_TYPES[0]!,
    [projectType]
  );

  const calc = useMemo(() => {
    const featuresPrice = FEATURES.filter((f) => selectedFeatures.includes(f.id)).reduce(
      (sum, f) => sum + f.price,
      0
    );
    const featuresWeeks = FEATURES.filter((f) => selectedFeatures.includes(f.id)).reduce(
      (sum, f) => sum + f.weeks,
      0
    );
    const tier = BUDGET_TIERS[budgetTier];
    const rawPrice = (selectedTypeObj.basePrice + featuresPrice) * tier.mult;
    const minWeeks = Math.ceil(selectedTypeObj.baseWeeks + featuresWeeks);
    const maxWeeks = Math.ceil(minWeeks * 1.3);
    const costMin = Math.round(rawPrice * 0.9);
    const costMax = Math.round(rawPrice * 1.155);
    return { featuresPrice, featuresWeeks, minWeeks, maxWeeks, costMin, costMax, tier };
  }, [selectedFeatures, selectedTypeObj, budgetTier]);

  const formattedBudget = `USD ${calc.costMin.toLocaleString()} - ${calc.costMax.toLocaleString()} (${calc.tier.label})`;
  const chosenDay =
    availableDays.find((d) => d.id === selectedDay) ?? firstDay ?? availableDays[0]!;
  const formattedMeeting = `${chosenDay.full} a las ${selectedHour}`;

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNextStep = () => {
    if (activeTab === "planificador") setActiveTab("agenda");
    else if (activeTab === "agenda") setActiveTab("contacto");
  };

  const handlePrevStep = () => {
    if (activeTab === "contacto") setActiveTab("agenda");
    else if (activeTab === "agenda") setActiveTab("planificador");
  };

  const regenerateBrief = () => {
    const selectedFeatsText = FEATURES.filter((f) => selectedFeatures.includes(f.id))
      .map((f) => f.name)
      .join(", ");

    const template = `Resumen del proyecto

Producto: ${selectedTypeObj.name}
Módulos adicionales: ${selectedFeatsText || "Ninguno"}
Nivel: ${calc.tier.label}
Rango de inversión: ${formattedBudget}
Tiempo estimado: ${calc.minWeeks} a ${calc.maxWeeks} semanas
Sesión propuesta: ${formattedMeeting}

Notas y contexto adicional: `;

    setProjectBrief(template);
    setUserEditedBrief(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResponseMsg("");

    if (hpField.trim().length > 0) {
      setResponseMsg("No fue posible procesar la solicitud.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name,
        email,
        company,
        serviceType,
        projectBudget: formattedBudget,
        projectBrief,
        hpField,
        customAnswers: {
          selectedMeeting: formattedMeeting,
          coreProduct: selectedTypeObj.name,
          minEstimatedWeeks: calc.minWeeks,
          maxEstimatedWeeks: calc.maxWeeks,
        },
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        leadId?: string;
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "No pudimos guardar tu solicitud.");
      }

      setSuccessLeadId(data.leadId ?? null);
      setResponseMsg(data.message ?? "Solicitud registrada.");

      setName("");
      setEmail("");
      setCompany("");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error temporal al registrar tu solicitud.";
      console.error("Submission error:", err);
      setResponseMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f6f7fb] pb-28 text-[#0f172a]">
      {/* HERO */}
      <section id="contact-hero" className="relative overflow-hidden pt-10 pb-10 sm:pt-14 sm:pb-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 right-4 h-72 w-72 rounded-full bg-[#2f6bff]/15 blur-[90px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 right-44 h-56 w-56 rounded-full bg-[#ff7a59]/15 blur-[90px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf0ff] px-3 py-1 text-xs font-semibold text-[#2f6bff]">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              Presupuestador de software
            </span>
            <h1 className="font-outfit text-4xl font-bold tracking-tight text-[#0f172a] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
              Diseña tu presupuesto en tres pasos.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-[#64748b]">
              Configura el alcance, elige un horario para la primera videollamada y envíanos tus
              datos. Si te falta información, escríbenos lo que tengas y lo afinamos juntos.
            </p>
          </div>
        </div>
      </section>

      {/* WIZARD */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="rounded-3xl border border-[#e7eaf3] bg-white p-6 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.25)] sm:p-8 lg:col-span-7">
            {/* Stepper */}
            <nav
              aria-label="Pasos del formulario"
              className="mb-8 flex flex-wrap items-center gap-2 border-b border-[#eef1f7] pb-6"
            >
              {STEPS.map((step) => {
                const isActiveStep: boolean = activeTab === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveTab(step.id)}
                    aria-current={isActiveStep ? "step" : undefined}
                    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all active:scale-[0.98] ${
                      isActiveStep
                        ? "bg-[#2f6bff] text-white shadow-sm shadow-[#2f6bff]/30"
                        : "bg-[#f1f4fb] text-[#64748b] hover:bg-[#e7ebf5]"
                    }`}
                  >
                    <span
                      className={`font-mono text-xs ${
                        isActiveStep ? "text-white/70" : "text-[#94a3b8]"
                      }`}
                    >
                      {step.number}
                    </span>
                    <span>{step.label}</span>
                  </button>
                );
              })}
            </nav>

            {successLeadId ? (
              <div className="animate-fade-in space-y-6 py-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf0ff] text-[#2f6bff]">
                  <CheckCircle2 className="h-8 w-8" strokeWidth={1.75} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-outfit text-2xl font-bold tracking-tight text-[#0f172a]">
                    Recibimos tu solicitud.
                  </h3>
                  <p className="mx-auto max-w-xl text-base leading-relaxed text-[#64748b]">
                    Te enviamos un correo con el resumen y la invitación para la videollamada del{" "}
                    <strong className="text-[#0f172a]">{formattedMeeting}</strong>.
                  </p>
                </div>

                <div className="mx-auto max-w-lg rounded-2xl border border-[#e7eaf3] bg-[#f6f8fd] p-5 text-left">
                  <p className="text-xs font-semibold tracking-wide text-[#94a3b8] uppercase">
                    Identificador de tu solicitud
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold text-[#2f6bff]">
                    {successLeadId}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4 border-t border-[#e7eaf3] pt-4 text-sm">
                    <div>
                      <p className="text-xs font-semibold tracking-wide text-[#94a3b8] uppercase">
                        Inversión
                      </p>
                      <p className="mt-0.5 text-[#334155]">{formattedBudget}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-wide text-[#94a3b8] uppercase">
                        Sesión
                      </p>
                      <p className="mt-0.5 text-[#334155]">{formattedMeeting}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessLeadId(null);
                      setActiveTab("planificador");
                    }}
                    className={btnGhost}
                  >
                    Diseñar otra propuesta
                  </button>
                  <a href="mailto:hola@ohmroyal.com" className={btnPrimary}>
                    Escribirnos por correo
                  </a>
                </div>
              </div>
            ) : (
              <div>
                {activeTab === "planificador" && (
                  <div className="animate-fade-in space-y-8 text-left">
                    <header className="space-y-1.5">
                      <h2 className="font-outfit text-2xl font-bold tracking-tight text-[#0f172a]">
                        Diseña el alcance.
                      </h2>
                      <p className="text-sm text-[#64748b]">
                        Elige el tipo de producto, los módulos opcionales y el nivel de
                        infraestructura.
                      </p>
                    </header>

                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#0f172a]">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eaf0ff] text-[11px] font-bold text-[#2f6bff]">
                          1
                        </span>
                        Producto principal
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {PROJECT_TYPES.map((type) => {
                          const isActiveType: boolean = projectType === type.id;
                          return (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setProjectType(type.id)}
                              aria-pressed={isActiveType}
                              className={`flex flex-col gap-3 px-4 py-4 ${optBase} ${
                                isActiveType
                                  ? "border-[#2f6bff] bg-[#eaf0ff] ring-2 ring-[#2f6bff]/30"
                                  : optIdle
                              }`}
                            >
                              <span className="text-sm font-semibold">{type.name}</span>
                              <span
                                className={`flex items-center justify-between font-mono text-xs ${
                                  isActiveType ? "text-[#2f6bff]" : "text-[#94a3b8]"
                                }`}
                              >
                                <span>{type.baseWeeks} sem · base</span>
                                <span className="font-semibold">
                                  USD {type.basePrice.toLocaleString()}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#0f172a]">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fff1ec] text-[11px] font-bold text-[#ff7a59]">
                          2
                        </span>
                        Módulos opcionales
                      </h3>
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                        {FEATURES.map((f) => {
                          const isChecked: boolean = selectedFeatures.includes(f.id);
                          return (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => toggleFeature(f.id)}
                              aria-pressed={isChecked}
                              className={`flex flex-col gap-2 px-4 py-3.5 ${optBase} ${
                                isChecked ? "border-[#ff7a59] bg-[#fff1ec]" : optIdle
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-sm leading-snug font-semibold">{f.name}</span>
                                <span
                                  className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md transition-colors ${
                                    isChecked
                                      ? "bg-[#ff7a59] text-white"
                                      : "bg-[#eef1f7] text-[#cbd5e1]"
                                  }`}
                                  aria-hidden="true"
                                >
                                  <Check className="h-3 w-3" strokeWidth={3} />
                                </span>
                              </div>
                              <span
                                className={`flex items-center justify-between font-mono text-xs ${
                                  isChecked ? "text-[#e8623f]" : "text-[#94a3b8]"
                                }`}
                              >
                                <span>+{f.weeks} sem</span>
                                <span className="font-semibold">
                                  +USD {f.price.toLocaleString()}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#0f172a]">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eaf0ff] text-[11px] font-bold text-[#2f6bff]">
                          3
                        </span>
                        Nivel de infraestructura
                      </h3>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        {(Object.keys(BUDGET_TIERS) as Array<BudgetTier["id"]>).map((tierKey) => {
                          const isActiveTier: boolean = budgetTier === tierKey;
                          const conf = BUDGET_TIERS[tierKey];
                          return (
                            <button
                              key={tierKey}
                              type="button"
                              onClick={() => setBudgetTier(tierKey)}
                              aria-pressed={isActiveTier}
                              className={`flex flex-col gap-3 px-4 py-4 ${optBase} ${
                                isActiveTier
                                  ? "border-[#2f6bff] bg-[#eaf0ff] ring-2 ring-[#2f6bff]/30"
                                  : optIdle
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-base font-bold">{conf.label}</span>
                                <span
                                  className={`rounded-full px-2 py-0.5 font-mono text-xs font-semibold ${
                                    isActiveTier
                                      ? "bg-[#2f6bff] text-white"
                                      : "bg-[#eef1f7] text-[#64748b]"
                                  }`}
                                >
                                  ×{conf.mult}
                                </span>
                              </div>
                              <p
                                className={`text-xs leading-relaxed ${
                                  isActiveTier ? "text-[#334155]" : "text-[#94a3b8]"
                                }`}
                              >
                                {conf.note}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col items-stretch justify-between gap-3 border-t border-[#eef1f7] pt-6 sm:flex-row sm:items-center">
                      <p className="inline-flex items-center gap-1.5 text-xs text-[#94a3b8]">
                        <Info className="h-3.5 w-3.5" strokeWidth={1.75} />
                        El resumen solo se inyecta cuando lo pidas.
                      </p>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={regenerateBrief} className={btnGhost}>
                          Generar resumen
                        </button>
                        <button type="button" onClick={handleNextStep} className={btnPrimary}>
                          Continuar a agenda
                          <ArrowRight className="h-4 w-4" strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "agenda" && (
                  <div className="animate-fade-in space-y-8 text-left">
                    <header className="space-y-1.5">
                      <h2 className="font-outfit text-2xl font-bold tracking-tight text-[#0f172a]">
                        Agenda la primera videollamada.
                      </h2>
                      <p className="text-sm text-[#64748b]">
                        30 minutos por Google Meet con la persona técnica responsable.
                      </p>
                    </header>

                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-[#0f172a]">Día</h3>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                        {availableDays.map((day) => {
                          const isActiveDay: boolean = selectedDay === day.id;
                          return (
                            <button
                              key={day.id}
                              type="button"
                              onClick={() => setSelectedDay(day.id)}
                              aria-pressed={isActiveDay}
                              className={`flex flex-col items-center gap-1.5 px-3 py-3 text-center ${optBase} ${
                                isActiveDay
                                  ? "border-[#2f6bff] bg-[#2f6bff] text-white shadow-md shadow-[#2f6bff]/25"
                                  : optIdle
                              }`}
                            >
                              <span
                                className={`font-mono text-[10px] tracking-wide uppercase ${
                                  isActiveDay ? "text-white/70" : "text-[#94a3b8]"
                                }`}
                              >
                                {day.label}
                              </span>
                              <span className="font-outfit text-xl leading-none font-bold">
                                {day.number}
                              </span>
                              <span
                                className={`font-mono text-[10px] ${
                                  isActiveDay ? "text-white/70" : "text-[#94a3b8]"
                                }`}
                              >
                                {day.month}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-[#0f172a]">Horario</h3>
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {HOUR_SLOTS.map((slot) => {
                          const isActiveSlot: boolean = selectedHour === slot.time;
                          const isAlmostFull: boolean = slot.availability === "casi-lleno";
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => setSelectedHour(slot.time)}
                              aria-pressed={isActiveSlot}
                              className={`flex items-center justify-between px-4 py-3.5 ${optBase} ${
                                isActiveSlot
                                  ? "border-[#2f6bff] bg-[#2f6bff] text-white shadow-md shadow-[#2f6bff]/25"
                                  : optIdle
                              }`}
                            >
                              <div className="space-y-0.5">
                                <p className="text-sm font-semibold">{slot.time}</p>
                                <p
                                  className={`text-xs ${
                                    isActiveSlot ? "text-white/70" : "text-[#94a3b8]"
                                  }`}
                                >
                                  Google Meet · 30 min
                                </p>
                              </div>
                              <span
                                className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide uppercase ${
                                  isActiveSlot
                                    ? "bg-white/20 text-white"
                                    : isAlmostFull
                                      ? "bg-[#fff3d6] text-[#b45309]"
                                      : "bg-[#eef1f7] text-[#64748b]"
                                }`}
                              >
                                {isAlmostFull ? "Casi lleno" : "Disponible"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#dbe6ff] bg-[#eaf0ff] p-4 text-sm text-[#334155]">
                      <p>
                        <span className="font-semibold text-[#0f172a]">Sesión propuesta:</span>{" "}
                        {formattedMeeting}.
                      </p>
                      <p className="mt-1 text-[#64748b]">
                        Sin depósito ni compromiso. Si no funciona, te proponemos otro horario por
                        correo.
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-[#eef1f7] pt-6">
                      <button type="button" onClick={handlePrevStep} className={btnGhost}>
                        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                        Volver
                      </button>
                      <button type="button" onClick={handleNextStep} className={btnPrimary}>
                        Continuar a datos
                        <ArrowRight className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "contacto" && (
                  <form onSubmit={handleSubmit} className="animate-fade-in space-y-6 text-left">
                    <header className="space-y-1.5">
                      <h2 className="font-outfit text-2xl font-bold tracking-tight text-[#0f172a]">
                        Tus datos y un resumen del proyecto.
                      </h2>
                      <p className="text-sm text-[#64748b]">
                        Te respondemos en menos de 48 horas hábiles desde un correo @ohmroyal.com.
                      </p>
                    </header>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-name"
                          className="block text-sm font-semibold text-[#334155]"
                        >
                          Nombre <span className="text-[#ff7a59]">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          placeholder="Diana Mendoza"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-2xl border border-[#e7eaf3] bg-white px-3.5 py-2.5 text-sm text-[#0f172a] transition-colors placeholder:text-[#94a3b8] focus:border-[#2f6bff] focus:ring-2 focus:ring-[#2f6bff]/20 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-email"
                          className="block text-sm font-semibold text-[#334155]"
                        >
                          Correo <span className="text-[#ff7a59]">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          placeholder="diana@empresa.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-2xl border border-[#e7eaf3] bg-white px-3.5 py-2.5 text-sm text-[#0f172a] transition-colors placeholder:text-[#94a3b8] focus:border-[#2f6bff] focus:ring-2 focus:ring-[#2f6bff]/20 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-company"
                          className="block text-sm font-semibold text-[#334155]"
                        >
                          Empresa
                        </label>
                        <input
                          id="contact-company"
                          type="text"
                          placeholder="Acme S.A."
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full rounded-2xl border border-[#e7eaf3] bg-white px-3.5 py-2.5 text-sm text-[#0f172a] transition-colors placeholder:text-[#94a3b8] focus:border-[#2f6bff] focus:ring-2 focus:ring-[#2f6bff]/20 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-service"
                          className="block text-sm font-semibold text-[#334155]"
                        >
                          Tipo de servicio
                        </label>
                        <select
                          id="contact-service"
                          value={serviceType}
                          onChange={(e) => setServiceType(e.target.value)}
                          className="w-full cursor-pointer rounded-2xl border border-[#e7eaf3] bg-white px-3.5 py-2.5 text-sm text-[#0f172a] transition-colors focus:border-[#2f6bff] focus:ring-2 focus:ring-[#2f6bff]/20 focus:outline-none"
                        >
                          {serviceOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between gap-3">
                        <label
                          htmlFor="contact-brief"
                          className="block text-sm font-semibold text-[#334155]"
                        >
                          Contexto del proyecto <span className="text-[#ff7a59]">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={regenerateBrief}
                          className="text-xs font-semibold text-[#2f6bff] hover:text-[#2457e6]"
                        >
                          Generar resumen desde el paso 1
                        </button>
                      </div>
                      <textarea
                        id="contact-brief"
                        required
                        rows={7}
                        value={projectBrief}
                        onChange={(e) => {
                          setProjectBrief(e.target.value);
                          setUserEditedBrief(true);
                        }}
                        placeholder="Describe el problema que quieres resolver, el equipo actual y cualquier restricción de plazo o presupuesto."
                        className="w-full rounded-2xl border border-[#e7eaf3] bg-white p-3.5 font-sans text-sm leading-relaxed text-[#0f172a] transition-colors placeholder:text-[#94a3b8] focus:border-[#2f6bff] focus:ring-2 focus:ring-[#2f6bff]/20 focus:outline-none"
                      />
                      {userEditedBrief && (
                        <p className="text-xs text-[#94a3b8]">
                          Has editado el contexto a mano. El botón de “generar resumen” lo
                          sobrescribe si lo presionas otra vez.
                        </p>
                      )}
                    </div>

                    <div className="flex items-start gap-2.5 rounded-2xl border border-[#e7eaf3] bg-[#f6f8fd] p-4 text-sm text-[#64748b]">
                      <ShieldCheck
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#2f6bff]"
                        strokeWidth={1.75}
                      />
                      <p>
                        Tus datos se guardan cifrados y no se comparten con terceros. Usamos un
                        campo oculto para detectar bots.
                      </p>
                    </div>

                    {/* Honeypot — keep exactly as is for anti-spam contract */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: "-10000px",
                        width: "1px",
                        height: "1px",
                        overflow: "hidden",
                      }}
                    >
                      <label htmlFor="company-website">No completar este campo</label>
                      <input
                        id="company-website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={hpField}
                        onChange={(e) => setHpField(e.target.value)}
                      />
                    </div>

                    {responseMsg && !successLeadId && (
                      <div className="rounded-2xl border border-[#ffd9cd] bg-[#fff1ec] px-4 py-3 text-sm text-[#c2410c]">
                        {responseMsg}
                      </div>
                    )}

                    <div className="flex flex-col items-stretch justify-between gap-3 border-t border-[#eef1f7] pt-6 sm:flex-row sm:items-center">
                      <button type="button" onClick={handlePrevStep} className={btnGhost}>
                        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                        Volver
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading || projectBrief.length < 10}
                        className={`${btnPrimary} px-6 py-3 disabled:opacity-50`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                            Enviando…
                          </>
                        ) : (
                          <>
                            Enviar solicitud
                            <ArrowRight className="h-4 w-4" strokeWidth={2} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* SIDEBAR DE RESUMEN */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:col-span-5">
            <div className="rounded-3xl border border-[#e7eaf3] bg-white p-6 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.25)] sm:p-8">
              <span className="text-xs font-semibold tracking-wide text-[#2f6bff] uppercase">
                Resumen en vivo
              </span>
              <h3 className="font-outfit mt-1 text-2xl font-bold tracking-tight text-[#0f172a]">
                Lo que llevas hasta ahora.
              </h3>

              {/* Featured estimate */}
              <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#eaf0ff] to-[#dbe7ff] p-5">
                <p className="text-xs font-semibold tracking-wide text-[#2f6bff] uppercase">
                  Inversión estimada
                </p>
                <p className="font-outfit mt-1 text-3xl font-bold tracking-tight text-[#1e40af]">
                  USD {calc.costMin.toLocaleString()} - {calc.costMax.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-[#64748b]">
                  {calc.tier.label} · {calc.minWeeks} a {calc.maxWeeks} semanas
                </p>
              </div>

              <dl className="mt-5 space-y-3.5">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-[#94a3b8]">Producto</dt>
                  <dd className="text-right text-sm font-semibold text-[#0f172a]">
                    {selectedTypeObj.name}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-[#94a3b8]">Nivel</dt>
                  <dd className="text-right text-sm font-semibold text-[#0f172a]">
                    {calc.tier.label}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-[#eef1f7] pt-3.5">
                  <dt className="text-sm text-[#94a3b8]">Sesión</dt>
                  <dd className="text-right text-sm font-semibold text-[#0f172a]">
                    {formattedMeeting}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="space-y-4 rounded-3xl border border-[#e7eaf3] bg-white p-6 sm:p-8">
              <span className="text-xs font-semibold tracking-wide text-[#2f6bff] uppercase">
                Lo que firmamos
              </span>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm leading-relaxed text-[#64748b]">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#eaf0ff] text-[#2f6bff]">
                    <FileText className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span>
                    <strong className="font-semibold text-[#0f172a]">
                      Alcance y precio por escrito
                    </strong>{" "}
                    antes de empezar. Si algo cambia, te avisamos antes de facturarlo.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm leading-relaxed text-[#64748b]">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#fff1ec] text-[#ff7a59]">
                    <Calendar className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span>
                    <strong className="font-semibold text-[#0f172a]">Sprints semanales</strong> con
                    demo en vivo. Cancelas con dos semanas de aviso.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm leading-relaxed text-[#64748b]">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#fff3d6] text-[#d97706]">
                    <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span>
                    <strong className="font-semibold text-[#0f172a]">
                      Código en tu repositorio
                    </strong>{" "}
                    desde el primer commit. Sin licencias ni dependencia hacia nosotros.
                  </span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
