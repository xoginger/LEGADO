# Guía de decisión: equipo local para LEGADO

LEGADO es **local-first**: memorias y modelo viven en el equipo privado del legador. Esta guía orienta la compra (o validación) de una máquina para **chat + RAG ligero** con modelos ~**7B–14B** (cuantización habitual Q4/Q5).

## Situación actual del usuario

| Dato | Valor |
| --- | --- |
| Moneda | **Pesos mexicanos (MXN)** |
| Máquina | **Parte de cero** (no tiene equipo aún) |
| Presupuesto | **Sin tope fijo asignado** |

Los precios de abajo son **rangos aproximados de mercado en México** (retail / ensamble habitual, nueva o reacondicionada razonable). **No son cotizaciones de tienda** ni precios exactos: varían por marca, IVA, tipo de cambio, stock y si compras Mac vs ensamblas PC. Úsalos para encuadrar, no para ordenar sin cotizar.

**Consejo por defecto para un legado a largo plazo:** el rango **Recomendado**.

---

## Qué tiene que aguantar el equipo

| Carga | Qué implica |
| --- | --- |
| App LEGADO | Poco: Node/navegador. |
| LLM 7B–14B (chat texto) | Lo pesado base: RAM unificada (Mac) o RAM + VRAM NVIDIA (PC). |
| RAG sobre memorias | Al inicio: ranking por texto en CPU. Luego: embeddings locales (holgura de RAM). |
| Export/backup | Disco SSD y disciplina de copias; no pide GPU. |
| Voz clonada + avatar (fase siguiente) | **Extra** respecto al solo texto: más VRAM/RAM y disco (modelo TTS + assets + posible lip-sync). No es requisito del MVP. |

### Nota: voz y avatar vs solo chat texto

El MVP es **solo texto**. Cuando lleguen voz clonada y avatar:

| Escenario | Impacto orientativo |
| --- | --- |
| Solo chat 7B–14B | Cubierto por rangos Entrada→Recomendado. |
| Chat + TTS voz clonada local | Suele pedir **más holgura** (ideal borde alto de Recomendado: 32 GB unificados o 12 GB+ VRAM libres además del LLM, o TTS en CPU más lento). |
| Chat + voz + avatar parlante local | Empuja a **Holgado** o a no correr todo a la máxima calidad a la vez (p. ej. avatar ligero / retrato animado primero). |

**Conclusión de compra hoy:** elige hardware por el chat local (rango **Recomendado**). Si sabes que quieres voz+avatar en el mismo aparato a medio plazo, favorece **32 GB+** (Mac) o **12–16 GB VRAM + 32 GB RAM** (PC) y SSD grande para audio/foto/vídeo de captura.

**Captura (no es hardware de PC):** audio limpio (minutos de habla), fotos de rostro, vídeo corto opcional — pendiente confirmar si el usuario ya los tiene.

---

## Mínimos técnicos (chat + RAG ligero)

| Modelo | Mac (RAM unificada) | PC NVIDIA (VRAM + RAM sistema) | Disco modelos |
| --- | --- | --- | --- |
| ~7B | **16 GB** mínimo usable (mejor 24+) | **8 GB VRAM** + **16 GB RAM** | ~5–8 GB c/u |
| ~13–14B | **32 GB** recomendado | **12 GB VRAM** + **32 GB RAM** | ~8–12 GB c/u |

- En Apple Silicon mira la **RAM total** (es unificada).
- Reserva **≥50 GB** SSD libres si vas a probar varios modelos.
- **8 GB** de RAM total no es camino serio para 7B+ local.

---

## Tres rangos en MXN (parte de cero)

### 1) Entrada — aprox. **$18,000 – $30,000 MXN**

Sirve para **empezar** con chat local 7B y el MVP. Justo para 14B. Válido si quieres probar LEGADO pronto y subir de máquina en 1–2 años.

| Vía | Qué buscar (aprox.) |
| --- | --- |
| **Mac Apple Silicon** | Mac mini / MacBook Air reacondicionado o config base con **16 GB** unificados (M1/M2/M3/M4 según oferta). Runtime: Ollama o MLX. |
| **PC + NVIDIA** | Torre o portátil gamer de entrada: **16 GB RAM** + GPU **~8 GB VRAM** (clase RTX 3060 8GB / equivalente). Runtime: Ollama. |

**Pros:** menor desembolso inicial; ya puedes guardar memorias y hablar con un 7B.  
**Contras:** poco margen a 5–10 años; en Mac no ampliarás RAM; 14B irá lento o no cabrá cómodo.

---

### 2) Recomendado — aprox. **$30,000 – $55,000 MXN** ← **consejo por defecto**

Pensado para un **legado a largo plazo**: 7B fluido, 14B usable, RAG + backups sin ahogarte. Si no hay tope fijo y partes de cero, **apunta aquí**.

| Vía | Qué buscar (aprox.) |
| --- | --- |
| **Mac Apple Silicon** | Mac mini (o laptop si la necesitas móvil) con **24–32 GB** unificados. Prioriza memoria sobre pantalla/GPU “pro”. Ollama y/o MLX. |
| **PC + NVIDIA** | Torre preferible: **32 GB RAM** + GPU **≥12 GB VRAM** (p. ej. clase RTX 3060 12GB / 4060 Ti 16GB / 4070 según precio del momento) + **SSD ≥1 TB**. Ollama. |

**Pros:** holgura real para crecer memorias y modelos; menos probabilidad de recompra temprana.  
**Contras:** inviertes más al día uno; en Mac aciertas RAM al comprar (no es ampliable).

---

### 3) Holgado — aprox. **$55,000 – $95,000+ MXN**

Cómodo si quieres **margen de años**, varios modelos en disco, 14B con soltura y posible experimentación (voz local, embeddings más grandes, algo de fine-tuning ligero más adelante).

| Vía | Qué buscar (aprox.) |
| --- | --- |
| **Mac Apple Silicon** | Mac mini / Studio (o laptop high) con **32–64 GB** unificados. |
| **PC + NVIDIA** | **32–64 GB RAM** + GPU **16 GB+ VRAM** (clase 4070 Ti / 4080 / equivalentes de generación actual) + SSD grande. |

**Pros:** legacy “tranquilo”; menos fricción técnica.  
**Contras:** más dinero del necesario solo para el MVP; no hace falta si aún estás validando el hábito de escribir memorias.

---

## Comparación rápida Mac vs PC (en cualquier rango)

| Criterio | Mac Apple Silicon | PC + NVIDIA |
| --- | --- | --- |
| Silencio / consumo | Mejor | Suele peor |
| Ampliar después | Difícil (RAM fija) | Más flexible (GPU/RAM en torre) |
| Runtime natural | MLX y Ollama | Ollama / CUDA |
| Relación MXN / VRAM alta | A menudo más caro por GB | Suele rendir más por peso en GPU |
| Setup simple | Muy bueno | Bueno (Ollama); más cables/ruido en torre |

---

## Quiosco / “solo la IA al encender”

**Requisito futuro del usuario:** al encender, los hijos solo ven LEGADO, sin escritorio/OS.

**Honestidad:** el OS **no se elimina ni se salta**. Se **oculta y bloquea** (modo quiosco / aparato). macOS sigue existiendo debajo; lo mismo en Linux.

| Camino | Sensación | Encaje |
| --- | --- | --- |
| **Mac + macOS quiosco** | Auto-login, LEGADO a pantalla completa, salir con contraseña del titular | Válido si ya eliges Mac por silencio/MLX; el lockdown es trabajo de configuración, no magia de Apple |
| **PC/mini PC + Linux kiosk** | Sesión mínima que solo abre LEGADO (+ Ollama) | Suele sentirse más “aparato” y es más fácil de endurecer |

**Alcance:** el lockdown del OS y el modo heredero (solo chat) son **fase posterior**. La decisión de producto es **primero IA usable** (memorias + chat). Al comprar hardware, no hace falta un modelo especial “sin OS”; prioriza RAM/VRAM del rango Recomendado. El quiosco se configura encima cuando toque.

---

## Empezar aquí (sin tope fijo, sin máquina)

1. **Hoy:** usa el MVP en cualquier PC/Mac prestado o actual de alguien de confianza solo para **escribir memorias** (localStorage + mock). No bloquees el legado por hardware.
2. **Compra objetivo:** rango **Recomendado ($30k–$55k MXN aprox.)**.
3. Elige ecosistema:
   - ¿Valoras silencio, poco mantenimiento y ya usas iPhone/Mac? → **Mac 24–32 GB**.
   - ¿Quieres más rendimiento por peso y poder subir GPU después? → **PC torre NVIDIA ≥12 GB VRAM + 32 GB RAM**.
4. Cotiza 2–3 opciones reales en MXN (Apple Store / importadores / ensambladores) antes de pagar; estos rangos solo encuadran.
5. Reserva en el mismo movimiento un **disco externo o NAS barato** para export/backup hacia los hijos (Fase 2 del plan).
6. **No esperes al quiosco** para empezar: escribe memorias y prueba el chat ya; el aparato se endurece después.

---

## Checklist

- [ ] ¿Me encuadro en Entrada, **Recomendado** u Holgado?
- [ ] ¿Mac (RAM unificada) o PC NVIDIA (VRAM + RAM)?
- [ ] ¿SSD con espacio para modelos + backups?
- [ ] ¿Plan de export JSON / disco de respaldo?
- [ ] ¿Quiosco después? (no bloquea la compra ni el MVP)
- [ ] ¿Planeas voz+avatar en el mismo equipo? → favorece holgura Recomendado alto / Holgado
- [ ] ¿Ya tienes audio/fotos/vídeo de captura? (pendiente respuesta del usuario)

---

## Relación con el plan

Ver [`legado-plan.md`](./legado-plan.md): arquitectura local-first, Ollama/MLX + mock, export/backup para herederos.
