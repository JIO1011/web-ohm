# OhmRoyal — sistema de diseño

Decisiones de marca aplicadas al sitio. Cada token tiene una razón. Si vas a desviarte de algo, agrega un caso de uso documentado antes de hacerlo.

## Paleta

Toda la paleta en **OKLCH**. Se reduce el chroma cuando la luminosidad va a los extremos para evitar saturación garish.

### Brand (acento único)

El brand es un magenta cálido. Solo este color como acento de marca. **No mezclar con emerald, sky, violet, teal salvo en estados sistémicos** (success, warning, etc.).

```css
--brand-50:  oklch(0.972 0.013 0);     /* mist */
--brand-100: oklch(0.945 0.030 0);
--brand-200: oklch(0.888 0.075 0);
--brand-300: oklch(0.808 0.135 0);
--brand-400: oklch(0.708 0.195 5);
--brand-500: oklch(0.628 0.245 5);     /* primary — usar ≤15% de la superficie */
--brand-600: oklch(0.545 0.225 5);
--brand-700: oklch(0.460 0.190 5);
--brand-800: oklch(0.375 0.150 5);
--brand-900: oklch(0.290 0.110 5);
--brand-950: oklch(0.205 0.075 5);
```

### Neutros (todo tintado hacia el brand)

Nada de `#fff` ni `#000`. Cada neutro inclina su hue ligeramente hacia el brand (h=5) con chroma muy bajo. Esto evita el aspecto "tema de Word".

```css
--neutral-0:   oklch(0.995 0.004 5);   /* canvas (casi blanco) */
--neutral-50:  oklch(0.980 0.005 5);
--neutral-100: oklch(0.960 0.006 5);
--neutral-200: oklch(0.920 0.008 5);
--neutral-300: oklch(0.860 0.010 5);
--neutral-400: oklch(0.720 0.012 5);
--neutral-500: oklch(0.580 0.014 5);
--neutral-600: oklch(0.460 0.016 5);
--neutral-700: oklch(0.360 0.018 5);
--neutral-800: oklch(0.260 0.018 5);
--neutral-900: oklch(0.180 0.018 5);   /* texto principal */
--neutral-950: oklch(0.130 0.018 5);   /* footer (único oscuro intencional) */
```

### Estados sistémicos (uso restringido)

Solo aparecen cuando la información los exige. Nunca decorativos.

```css
--success: oklch(0.680 0.155 145);     /* verde para confirmaciones, métricas positivas */
--warning: oklch(0.760 0.155 75);      /* ámbar para warnings */
--info:    oklch(0.700 0.110 230);     /* azul, casi nunca usado */
```

## Tipografía

### Familias

- **Display**: Space Grotesk. Solo para titulares (H1, H2 hero) y números grandes.
- **Sans**: Inter. Cuerpo, labels, navegación.
- **Mono**: JetBrains Mono. **Solo para datos** (IDs, latencias, valores numéricos crudos). **No** como decoración de etiquetas.

### Escala (ratio 1.5x sobre 16px base)

```
xs:   12px / 18px   — labels, metadata
sm:   14px / 22px   — UI secundaria
base: 16px / 26px   — cuerpo
lg:   18px / 28px   — cuerpo destacado
xl:   24px / 32px   — H3
2xl:  36px / 42px   — H2
3xl:  54px / 60px   — H1
4xl:  82px / 86px   — hero monumental (uso restringido)
```

### Pesos

- **400 (regular)**: cuerpo, valor por defecto.
- **500 (medium)**: navegación, etiquetas activas, énfasis suave.
- **600 (semibold)**: títulos de sección y subtítulos. Default para titulares.
- **800 (extrabold)**: solo en hero principal y en métrica destacada de CTA.
- **900 (black)**: nunca por defecto. Solo si el contexto editorial lo exige (titular único de campaña).

Regla operativa: si un bloque tiene más de 3 elementos en `font-bold` o más, está mal jerarquizado.

### Tracking

- Display: `-0.02em`
- Sans: `0`
- Caps/uppercase (labels mono): `0.08em`

## Layout

- Container máximo: `max-w-7xl` (1280px). Cuerpo legible: 64-72 chars.
- Grid principal: 12 columnas con `gap-8` (32px).
- Padding vertical de sección: ritmo variable `py-16`, `py-20`, `py-28`. **No** el mismo padding en todas las secciones.
- Cards: usar solo cuando son la mejor affordance. Cards anidados están prohibidos.

## Elevación

Sombras sutiles, no decorativas. Una sola "altura" elevada por vista.

```
shadow-flat:    none
shadow-resting: 0 1px 2px oklch(0.180 0.018 5 / 0.06)
shadow-lifted:  0 10px 30px -12px oklch(0.180 0.018 5 / 0.12)
```

## Bordes

- Radio base: `12px` (`rounded-xl`). Cards grandes: `20px` (`rounded-3xl` cuando son piezas hero).
- Color borde: `--neutral-200` en superficies claras.
- **Prohibido**: `border-left` o `border-right` > 1px como acento. Si necesitas marcar algo, usa fondo tintado o ícono guía.

## Motion

Presupuesto pequeño y consistente.

- **Easing**: solo `ease-out-quart` (cubic-bezier(0.25, 1, 0.5, 1)) o `ease-out-expo` (cubic-bezier(0.16, 1, 0.3, 1)). No bounce. No elastic.
- **Duraciones**:
  - micro: 120-180ms (hover, focus)
  - estándar: 240ms (transiciones de estado)
  - largo: 480ms (entradas, fade-in)
- **Reglas**:
  - No animar `width`, `height`, `top`, `left`. Solo `transform` y `opacity`.
  - No animar más de 2 propiedades simultáneamente.
  - Toda animación que dure más de 200ms debe ser interrumpible.

## Iconografía

- Librería: `lucide-react`. Trazo fino (`stroke-width="1.5"`) para iconos > 24px.
- Tamaño por defecto: 18px en texto, 24px en botones, 32-40px en hero blocks.
- **No** decorar todo. Un icono por etiqueta máximo.

## Imágenes

- **Cero fotos genéricas de Unsplash de personas en oficinas o servidores con luces azules.** Reemplazar por:
  - Visuales abstractos generados con CSS/SVG (gradientes intencionales, formas geométricas).
  - Diagramas de arquitectura propios cuando ilustren un caso.
  - Capturas reales de producto cuando existan.

## Prohibiciones absolutas (heredadas de `impeccable` + estas)

1. Side-stripe `border-l-4` como acento de card o callout.
2. Texto con `background-clip: text` + gradiente.
3. Glassmorphism decorativo.
4. Hero-metric template (big number + small label) en grid de 4.
5. Cards idénticos en grid > 6 elementos.
6. Modales como primera respuesta.
7. Em-dashes en copy (`—` o `--`).
8. **`// LABEL` en mono uppercase como decoración**. Mono se reserva para datos.
9. Console logs falsos, simulators fake, "DISPARAR REMOTO" botón sin función.
10. Más de un acento de color además del brand en una misma vista.

## Test de slop

Al terminar una pantalla, leer y responder:

1. ¿Alguien podría adivinar la categoría del producto solo viendo la paleta y tema? Si sí, revisar.
2. ¿Hay más de 3 etiquetas `font-mono uppercase` decorativas? Si sí, eliminar.
3. ¿El copy contiene alguna palabra del bloqueo (PRODUCT.md)? Si sí, reescribir.
4. ¿La página dice algo verificable (números, casos, herramientas) o solo adjetivos? Si solo adjetivos, reescribir.
