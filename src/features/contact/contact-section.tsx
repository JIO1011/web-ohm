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
  { id: "webapp", name: "Aplicación web (Next.js)", basePrice: 6500, baseWeeks: 5 },
  { id: "mobile", name: "Aplicación móvil (iOS y Android)", basePrice: 8500, baseWeeks: 6 },
  { id: "ai", name: "Integración de IA o agente RAG", basePrice: 11000, baseWeeks: 4 },
  { id: "cybersecurity", name: "Auditoría de seguridad", basePrice: 5000, baseWeeks: 2 },
  { id: "devops", name: "Migración cloud o IaC", basePrice: 6000, baseWeeks: 3 },
] as const;

const FEATURES: readonly FeatureOption[] = [
  { id: "dashboard", name: "Panel analítico", price: 1800, weeks: 1 },
  { id: "payments", name: "Integración de pagos (Stripe)", price: 1200, weeks: 1 },
  { id: "realtime", name: "Mensajería o sincronización en tiempo real", price: 2000, weeks: 2 },
  { id: "db_custom", name: "Arquitectura Postgres y Redis", price: 2500, weeks: 1 },
  { id: "i18n", name: "Multilenguaje", price: 800, weeks: 0.5 },
  { id: "sentry", name: "Monitoreo con Sentry y alertas", price: 1000, weeks: 0.5 },
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
  const MONTHS_SHORT = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const WEEKDAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const MONTHS_FULL = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
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

export default function ContactSection() {
  const searchParams = useSearchParams();
  const presetService = searchParams.get("service");
  const presetTab = searchParams.get("tab") as WizardTab | null;
  const validTabs: ReadonlySet<WizardTab> = new Set(["planificador", "agenda", "contacto"]);
  const initialTab: WizardTab =
    presetTab && validTabs.has(presetTab) ? presetTab : "planificador";

  const [activeTab, setActiveTab] = useState<WizardTab>(initialTab);

  // STEP 1
  const [projectType, setProjectType] = useState<string>("webapp");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["dashboard"]);
  const [budgetTier, setBudgetTier] = useState<BudgetTier["id"]>("mid");

  // STEP 2
  const [availableDays] = useState<DayOption[]>(() => nextBusinessDays(5));
  const firstDay = availableDays[0];
  const [selectedDay, setSelectedDay] = useState<string>(firstDay?.id ?? "day0");
  const [selectedHour, setSelectedHour] = useState<string>(HOUR_SLOTS[1]?.time ?? "");

  // STEP 3
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [serviceType, setServiceType] = useState<string>(
    presetService ?? "Aún no lo tengo claro"
  );
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

  const formattedBudget = `USD ${calc.costMin.toLocaleString()} – ${calc.costMax.toLocaleString()} (${calc.tier.label})`;
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
    <div className="bg-ink-0 pb-28 text-ink-900">
      {/* HERO */}
      <section
        id="contact-hero"
        className="relative border-b border-ink-100 pb-16 pt-32 sm:pb-20 sm:pt-36"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <p className="font-mono text-xs tracking-[0.08em] text-brand-600">Calcular proyecto</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
              Tres pasos. Te respondemos en menos de 48 horas hábiles.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-ink-600">
              Configura el alcance, elige un horario para la primera videollamada y envíanos tus
              datos. Si te falta información, escríbenos lo que tengas y lo afinamos juntos.
            </p>
          </div>
        </div>
      </section>

      {/* WIZARD */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="rounded-2xl border border-ink-200 bg-ink-0 p-6 sm:p-10 lg:col-span-7">
            {/* Stepper */}
            <nav
              aria-label="Pasos del formulario"
              className="mb-8 flex flex-wrap items-center gap-2 border-b border-ink-100 pb-6"
            >
              {STEPS.map((step) => {
                const isActiveStep: boolean = activeTab === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveTab(step.id)}
                    aria-current={isActiveStep ? "step" : undefined}
                    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      isActiveStep
                        ? "bg-ink-900 text-ink-0"
                        : "bg-ink-50 text-ink-600 hover:bg-ink-100"
                    }`}
                  >
                    <span
                      className={`font-mono text-xs ${
                        isActiveStep ? "text-brand-300" : "text-ink-400"
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
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink-50 text-brand-600">
                  <CheckCircle2 className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
                    Recibimos tu solicitud.
                  </h3>
                  <p className="mx-auto max-w-xl text-base leading-relaxed text-ink-600">
                    Te enviamos un correo con el resumen y la invitación para la videollamada del{" "}
                    <strong className="text-ink-900">{formattedMeeting}</strong>.
                  </p>
                </div>

                <div className="mx-auto max-w-lg rounded-xl border border-ink-200 bg-ink-50 p-5 text-left">
                  <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-500">
                    Identificador de tu solicitud
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold text-brand-600">
                    {successLeadId}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4 border-t border-ink-200 pt-4 text-sm">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-500">
                        Inversión
                      </p>
                      <p className="mt-0.5 text-ink-800">{formattedBudget}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-500">
                        Sesión
                      </p>
                      <p className="mt-0.5 text-ink-800">{formattedMeeting}</p>
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
                    className="rounded-xl border border-ink-200 bg-ink-0 px-5 py-3 text-sm font-medium text-ink-800 transition-colors hover:bg-ink-50"
                  >
                    Diseñar otra propuesta
                  </button>
                  <a
                    href="mailto:hola@ohmroyal.com"
                    className="rounded-xl bg-ink-900 px-5 py-3 text-sm font-medium text-ink-0 transition-colors hover:bg-ink-800"
                  >
                    Escribirnos por correo
                  </a>
                </div>
              </div>
            ) : (
              <div>
                {activeTab === "planificador" && (
                  <div className="animate-fade-in space-y-8 text-left">
                    <header className="space-y-1.5">
                      <h2 className="font-display text-2xl font-semibold text-ink-900">
                        Diseñar el alcance.
                      </h2>
                      <p className="text-sm text-ink-600">
                        Selecciona el tipo de producto, los módulos opcionales y el nivel de
                        infraestructura.
                      </p>
                    </header>

                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-ink-500">
                        1. Producto principal
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
                              className={`flex flex-col gap-3 rounded-xl border px-4 py-4 text-left transition-colors duration-200 ${
                                isActiveType
                                  ? "border-ink-900 bg-ink-900 text-ink-0"
                                  : "border-ink-200 bg-ink-0 text-ink-800 hover:border-ink-300 hover:bg-ink-50"
                              }`}
                            >
                              <span className="text-sm font-medium">{type.name}</span>
                              <span
                                className={`flex items-center justify-between font-mono text-xs ${
                                  isActiveType ? "text-ink-300" : "text-ink-500"
                                }`}
                              >
                                <span>{type.baseWeeks} sem · base</span>
                                <span>USD {type.basePrice.toLocaleString()}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-ink-500">
                        2. Módulos opcionales
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
                              className={`flex flex-col gap-2 rounded-xl border px-4 py-3.5 text-left transition-colors duration-200 ${
                                isChecked
                                  ? "border-brand-500 bg-brand-50 text-ink-900"
                                  : "border-ink-200 bg-ink-0 text-ink-800 hover:border-ink-300 hover:bg-ink-50"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-sm font-medium leading-snug">{f.name}</span>
                                <span
                                  className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md transition-colors ${
                                    isChecked
                                      ? "bg-brand-500 text-ink-0"
                                      : "bg-ink-100 text-ink-300"
                                  }`}
                                  aria-hidden="true"
                                >
                                  <Check className="h-3 w-3" strokeWidth={2.5} />
                                </span>
                              </div>
                              <span
                                className={`flex items-center justify-between font-mono text-xs ${
                                  isChecked ? "text-brand-700" : "text-ink-500"
                                }`}
                              >
                                <span>+{f.weeks} sem</span>
                                <span>+USD {f.price.toLocaleString()}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-ink-500">
                        3. Nivel de infraestructura
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
                              className={`flex flex-col gap-3 rounded-xl border px-4 py-4 text-left transition-colors duration-200 ${
                                isActiveTier
                                  ? "border-ink-900 bg-ink-900 text-ink-0"
                                  : "border-ink-200 bg-ink-0 text-ink-800 hover:border-ink-300 hover:bg-ink-50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-base font-semibold">{conf.label}</span>
                                <span
                                  className={`font-mono text-xs ${
                                    isActiveTier ? "text-brand-300" : "text-ink-500"
                                  }`}
                                >
                                  ×{conf.mult}
                                </span>
                              </div>
                              <p
                                className={`text-xs leading-relaxed ${
                                  isActiveTier ? "text-ink-300" : "text-ink-500"
                                }`}
                              >
                                {conf.note}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col items-stretch justify-between gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center">
                      <p className="inline-flex items-center gap-1.5 text-xs text-ink-500">
                        <Info className="h-3.5 w-3.5" strokeWidth={1.75} />
                        El resumen solo se inyecta cuando lo pidas.
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={regenerateBrief}
                          className="rounded-xl border border-ink-200 bg-ink-0 px-4 py-2.5 text-sm font-medium text-ink-800 transition-colors hover:bg-ink-50"
                        >
                          Generar resumen
                        </button>
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-medium text-ink-0 transition-colors hover:bg-ink-800"
                        >
                          Continuar a agenda
                          <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "agenda" && (
                  <div className="animate-fade-in space-y-8 text-left">
                    <header className="space-y-1.5">
                      <h2 className="font-display text-2xl font-semibold text-ink-900">
                        Agendar la primera videollamada.
                      </h2>
                      <p className="text-sm text-ink-600">
                        30 minutos por Google Meet con la persona técnica responsable.
                      </p>
                    </header>

                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-ink-500">
                        Día
                      </h3>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                        {availableDays.map((day) => {
                          const isActiveDay: boolean = selectedDay === day.id;
                          return (
                            <button
                              key={day.id}
                              type="button"
                              onClick={() => setSelectedDay(day.id)}
                              aria-pressed={isActiveDay}
                              className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-center transition-colors duration-200 ${
                                isActiveDay
                                  ? "border-ink-900 bg-ink-900 text-ink-0"
                                  : "border-ink-200 bg-ink-0 text-ink-800 hover:border-ink-300 hover:bg-ink-50"
                              }`}
                            >
                              <span
                                className={`font-mono text-[10px] uppercase tracking-[0.08em] ${
                                  isActiveDay ? "text-brand-300" : "text-ink-500"
                                }`}
                              >
                                {day.label}
                              </span>
                              <span className="font-display text-xl font-semibold leading-none">
                                {day.number}
                              </span>
                              <span
                                className={`font-mono text-[10px] ${
                                  isActiveDay ? "text-ink-300" : "text-ink-500"
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
                      <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-ink-500">
                        Horario
                      </h3>
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
                              className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-colors duration-200 ${
                                isActiveSlot
                                  ? "border-ink-900 bg-ink-900 text-ink-0"
                                  : "border-ink-200 bg-ink-0 text-ink-800 hover:border-ink-300 hover:bg-ink-50"
                              }`}
                            >
                              <div className="space-y-0.5">
                                <p className="text-sm font-medium">{slot.time}</p>
                                <p
                                  className={`text-xs ${
                                    isActiveSlot ? "text-ink-300" : "text-ink-500"
                                  }`}
                                >
                                  Google Meet · 30 min
                                </p>
                              </div>
                              <span
                                className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] ${
                                  isAlmostFull
                                    ? isActiveSlot
                                      ? "border-ink-700 text-brand-300"
                                      : "border-ink-200 text-ink-500"
                                    : isActiveSlot
                                      ? "border-ink-700 text-ink-300"
                                      : "border-ink-200 text-ink-600"
                                }`}
                              >
                                {isAlmostFull ? "Casi lleno" : "Disponible"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-xl border border-ink-200 bg-ink-50 p-4 text-sm text-ink-700">
                      <p>
                        <span className="font-medium text-ink-900">Sesión propuesta:</span>{" "}
                        {formattedMeeting}.
                      </p>
                      <p className="mt-1 text-ink-600">
                        Sin depósito ni compromiso. Si no funciona, te proponemos otro horario por
                        correo.
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-ink-100 pt-6">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-ink-0 px-4 py-2.5 text-sm font-medium text-ink-800 transition-colors hover:bg-ink-50"
                      >
                        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                        Volver
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-medium text-ink-0 transition-colors hover:bg-ink-800"
                      >
                        Continuar a datos
                        <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "contacto" && (
                  <form onSubmit={handleSubmit} className="animate-fade-in space-y-6 text-left">
                    <header className="space-y-1.5">
                      <h2 className="font-display text-2xl font-semibold text-ink-900">
                        Tus datos y un resumen del proyecto.
                      </h2>
                      <p className="text-sm text-ink-600">
                        Te respondemos en menos de 48 horas hábiles desde un correo
                        @ohmroyal.com.
                      </p>
                    </header>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-name"
                          className="block text-sm font-medium text-ink-700"
                        >
                          Nombre <span className="text-brand-500">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          placeholder="Diana Mendoza"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-xl border border-ink-200 bg-ink-0 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-email"
                          className="block text-sm font-medium text-ink-700"
                        >
                          Correo <span className="text-brand-500">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          placeholder="diana@empresa.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-ink-200 bg-ink-0 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-company"
                          className="block text-sm font-medium text-ink-700"
                        >
                          Empresa
                        </label>
                        <input
                          id="contact-company"
                          type="text"
                          placeholder="Acme S.A."
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full rounded-xl border border-ink-200 bg-ink-0 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-service"
                          className="block text-sm font-medium text-ink-700"
                        >
                          Tipo de servicio
                        </label>
                        <select
                          id="contact-service"
                          value={serviceType}
                          onChange={(e) => setServiceType(e.target.value)}
                          className="w-full cursor-pointer rounded-xl border border-ink-200 bg-ink-0 px-3.5 py-2.5 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        >
                          {SERVICE_TYPES.map((opt) => (
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
                          className="block text-sm font-medium text-ink-700"
                        >
                          Contexto del proyecto <span className="text-brand-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={regenerateBrief}
                          className="text-xs font-medium text-brand-600 hover:text-brand-700"
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
                        className="w-full rounded-xl border border-ink-200 bg-ink-0 p-3.5 font-sans text-sm leading-relaxed text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      {userEditedBrief && (
                        <p className="text-xs text-ink-500">
                          Has editado el contexto a mano. El botón de “generar resumen” lo
                          sobrescribe si lo presionas otra vez.
                        </p>
                      )}
                    </div>

                    <div className="flex items-start gap-2.5 rounded-xl border border-ink-200 bg-ink-50 p-4 text-sm text-ink-600">
                      <ShieldCheck
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600"
                        strokeWidth={1.5}
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
                      <div className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
                        {responseMsg}
                      </div>
                    )}

                    <div className="flex flex-col items-stretch justify-between gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-ink-0 px-4 py-2.5 text-sm font-medium text-ink-800 transition-colors hover:bg-ink-50"
                      >
                        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                        Volver
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading || projectBrief.length < 10}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-medium text-ink-0 transition-colors hover:bg-brand-600 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                            Enviando…
                          </>
                        ) : (
                          <>
                            Enviar solicitud
                            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
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
            <div className="rounded-2xl border border-ink-200 bg-ink-0 p-6 sm:p-8">
              <p className="font-mono text-xs tracking-[0.08em] text-brand-600">Resumen</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-ink-900">
                Lo que llevas hasta ahora.
              </h3>

              <dl className="mt-6 space-y-4 border-t border-ink-100 pt-6">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-ink-500">Producto</dt>
                  <dd className="text-right text-sm font-medium text-ink-900">
                    {selectedTypeObj.name}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-ink-500">Nivel</dt>
                  <dd className="text-right text-sm font-medium text-ink-900">
                    {calc.tier.label}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-ink-100 pt-4">
                  <dt className="text-sm text-ink-500">Inversión estimada</dt>
                  <dd className="text-right font-mono text-sm font-semibold text-brand-600">
                    USD {calc.costMin.toLocaleString()} – {calc.costMax.toLocaleString()}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-ink-500">Tiempo</dt>
                  <dd className="text-right font-mono text-sm font-medium text-ink-900">
                    {calc.minWeeks} a {calc.maxWeeks} semanas
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-ink-100 pt-4">
                  <dt className="text-sm text-ink-500">Sesión</dt>
                  <dd className="text-right text-sm font-medium text-ink-900">
                    {formattedMeeting}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="space-y-4 rounded-2xl border border-ink-200 bg-ink-50 p-6 sm:p-8">
              <p className="font-mono text-xs tracking-[0.08em] text-brand-600">Lo que firmamos</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700">
                  <FileText
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-500"
                    strokeWidth={1.5}
                  />
                  <span>
                    <strong className="font-medium text-ink-900">Alcance y precio por escrito</strong>{" "}
                    antes de empezar. Si algo cambia, te avisamos antes de facturarlo.
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700">
                  <Calendar
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-500"
                    strokeWidth={1.5}
                  />
                  <span>
                    <strong className="font-medium text-ink-900">Sprints semanales</strong> con demo
                    en vivo. Cancelas con dos semanas de aviso.
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700">
                  <ShieldCheck
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-500"
                    strokeWidth={1.5}
                  />
                  <span>
                    <strong className="font-medium text-ink-900">Código en tu repositorio</strong>{" "}
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
