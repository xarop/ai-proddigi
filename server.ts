import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type CategoryKey = "commercial" | "corporate" | "events" | "documentary";

interface LocalizedText {
  ca: string;
  es: string;
  en: string;
}

interface PortfolioMetaOverride {
  category: CategoryKey;
  client: string;
  title?: LocalizedText;
  synopsis?: LocalizedText;
  credits: {
    director: string;
    dop: string;
    post: string;
  };
}

interface PortfolioEntry {
  slug: string;
  vimeoId: string;
  thumbnail: string;
  vimeoThumbnail: string;
  vimeoTitle: string;
  vimeoAuthor: string;
  category: CategoryKey;
  client: string;
  year: string;
  duration: string;
  title: LocalizedText;
  synopsis: LocalizedText;
  credits: {
    director: string;
    dop: string;
    post: string;
  };
  source: string;
}

interface VimeoV2Video {
  id: number;
  title: string;
  description: string;
  url: string;
  upload_date: string;
  thumbnail_large: string;
  user_name: string;
  duration: number;
  width: number;
  height: number;
  tags: string;
  embed_privacy: string;
}

interface VimeoApiVideo {
  uri?: string;
  name?: string;
  description?: string | null;
  duration?: number;
  created_time?: string;
  tags?: Array<{ name?: string; canonical?: string }>;
  pictures?: {
    sizes?: Array<{ width?: number; link?: string }>;
  };
}

const SHOWREEL_VIMEO_ID = "106273274";

const EXCLUDED_DUPLICATE_IDS = new Set([
  "100221410",
  "95487898",
  "88870384",
  "88346196",
  "88154242",
  "88150473",
  "88148447",
  "84214019",
  "100884555",
  "117600690",
  SHOWREEL_VIMEO_ID,
]);

const LOCAL_CACHED_IDS = new Set([
  "835157059",
  "181189230",
  "177059543",
  "106177315",
  "100886957",
  "100886157",
  "100884500",
  "100819117",
  "100815742",
  "98530330",
]);

const PRODDIGI_VIDEO_META: Record<string, PortfolioMetaOverride> = {
  "835157059": {
    category: "commercial",
    client: "PRODDIGI · Jos Man",
    title: {
      ca: "PRIMACY — Teaser 4K",
      es: "PRIMACY — Teaser 4K",
      en: "PRIMACY — 4K Teaser",
    },
    synopsis: {
      ca: "Teaser en 4K anamòrfic produït per PRODDIGI i dirigit per Jos Man. Robert Preston i Julia Desmond s’enfronten a la lògica d’Arion, la intel·ligència artificial militar més avançada.",
      es: "Teaser en 4K anamórfico producido por PRODDIGI y dirigido por Jos Man. Robert Preston y Julia Desmond se enfrentan a la lógica de Arion, la IA militar más avanzada.",
      en: "4K anamorphic sci-fi teaser produced by PRODDIGI and directed by Jos Man. Robert Preston and Julia Desmond struggle against Arion’s military AI logic.",
    },
    credits: { director: "Jos Man", dop: "proddigi", post: "proddigi VFX Lab" },
  },
  "181189230": {
    category: "documentary",
    client: "Documental Internacional",
    title: {
      ca: "HEP C: From Hell to Hope",
      es: "HEP C: From Hell to Hope",
      en: "HEP C: From Hell to Hope",
    },
    synopsis: {
      ca: "Llargmetratge documental sobre l’evolució científica i humana entorn de l’hepatitis C, amb testimonis de pacients i investigadors.",
      es: "Largometraje documental sobre la evolución científica y humana en torno a la hepatitis C, con testimonios de pacientes e investigadores.",
      en: "Feature documentary chronicling the scientific breakthroughs and human stories behind the fight against Hepatitis C.",
    },
    credits: { director: "proddigi", dop: "proddigi", post: "proddigi" },
  },
  "177059543": {
    category: "corporate",
    client: "AbbVie",
    title: {
      ca: "OCC AbbVie Visit",
      es: "OCC AbbVie Visit",
      en: "OCC AbbVie Visit",
    },
    synopsis: {
      ca: "Peça corporativa i científica produïda per a AbbVie centrada en recerca biomèdica i processos de laboratori d’alta precisió.",
      es: "Pieza corporativa y científica producida para AbbVie centrada en investigación biomédica y procesos de laboratorio de alta precisión.",
      en: "Corporate and biomedical film produced for AbbVie highlighting laboratory precision and clinical innovation.",
    },
    credits: { director: "proddigi", dop: "proddigi", post: "proddigi" },
  },
  "106177315": {
    category: "events",
    client: "The Cabriolets",
    title: {
      ca: "Diamonds — The Cabriolets",
      es: "Diamonds — The Cabriolets",
      en: "Diamonds — The Cabriolets",
    },
    synopsis: {
      ca: "Videoclip en blanc i negre d’alta energia rodat per a The Cabriolets, combinant estètica crua de directe i fotografia cinematogràfica.",
      es: "Videoclip en blanco y negro de alta energía rodado para The Cabriolets, combinando estética cruda de directo y fotografía cinematográfica.",
      en: "High-contrast monochrome music video directed for The Cabriolets, blending live performance energy with cinema framing.",
    },
    credits: { director: "proddigi", dop: "proddigi", post: "proddigi" },
  },
  "100886957": {
    category: "corporate",
    client: "Grupo COPISA",
    title: {
      ca: "COPISA Group — Pel·lícula Corporativa",
      es: "COPISA Group — Película Corporativa",
      en: "COPISA Group — Corporate Film",
    },
    synopsis: {
      ca: "Pel·lícula institucional per al grup d’enginyeria i construcció COPISA a Barcelona, documentant grans infraestructures i equips tècnics.",
      es: "Película institucional para el grupo de ingeniería y construcción COPISA en Barcelona, documentando grandes infraestructuras y equipos técnicos.",
      en: "Institutional film for Barcelona-based engineering and construction group COPISA showcasing major civil infrastructure.",
    },
    credits: { director: "proddigi", dop: "proddigi", post: "proddigi" },
  },
  "100886157": {
    category: "documentary",
    client: "AbbVie · IBD Campaign",
    title: {
      ca: "Join The Fight Against IBD",
      es: "Join The Fight Against IBD",
      en: "Join The Fight Against IBD",
    },
    synopsis: {
      ca: "Campanya audiovisual de sensibilització internacional amb una posada en escena intimista i cinematogràfica rodada a Barcelona.",
      es: "Campaña audiovisual de sensibilización internacional con una puesta en escena intimista y cinematográfica rodada en Barcelona.",
      en: "International awareness film shot in Barcelona with an intimate architectural mise-en-scène.",
    },
    credits: { director: "proddigi", dop: "proddigi", post: "proddigi" },
  },
  "100884500": {
    category: "commercial",
    client: "UIC Barcelona",
    title: {
      ca: "UIC — Grau en Comunicació Audiovisual",
      es: "UIC — Grado en Comunicación Audiovisual",
      en: "UIC — Audiovisual Communication",
    },
    synopsis: {
      ca: "Spot cinematogràfic per a la Universitat Internacional de Catalunya sobre la mirada creativa i la narrativa visual contemporània.",
      es: "Spot cinematográfico para la Universitat Internacional de Catalunya sobre la mirada creativa y la narrativa visual contemporánea.",
      en: "Commercial spot for UIC Barcelona celebrating visual storytelling and contemporary filmmaking.",
    },
    credits: { director: "proddigi", dop: "proddigi", post: "proddigi" },
  },
  "100819117": {
    category: "events",
    client: "Amaral · Discos Antártida",
    title: {
      ca: "Amaral — Hoy es el principio del final",
      es: "Amaral — Hoy es el principio del final",
      en: "Amaral — Hoy es el principio del final",
    },
    synopsis: {
      ca: "Videoclip narratiu en format panoràmic per a Amaral, seguint una travessia urbana en moviment continu i llum natural.",
      es: "Videoclip narrativo en formato panorámico para Amaral, siguiendo una travesía urbana en movimiento continuo y luz natural.",
      en: "Widescreen narrative music film for Amaral following a relentless urban journey in natural daylight.",
    },
    credits: { director: "proddigi", dop: "proddigi", post: "proddigi" },
  },
  "100815742": {
    category: "commercial",
    client: "UIC Barcelona",
    title: {
      ca: "UIC — Grau en Publicitat",
      es: "UIC — Grado en Publicidad",
      en: "UIC — Advertising Degree",
    },
    synopsis: {
      ca: "Peça publicitària per a UIC Barcelona que juga amb els codis de la comunicació quotidiana i la direcció d’art minimalista.",
      es: "Pieza publicitaria para UIC Barcelona que juega con los códigos de la comunicación cotidiana y la dirección de arte minimalista.",
      en: "Commercial film for UIC Barcelona playing with everyday brand tropes and restrained art direction.",
    },
    credits: { director: "proddigi", dop: "proddigi", post: "proddigi" },
  },
  "98530330": {
    category: "commercial",
    client: "PRODDIGI · Jos Man",
    title: {
      ca: "The Only Man — Tràiler Oficial",
      es: "The Only Man — Tráiler Oficial",
      en: "The Only Man — Official Trailer",
    },
    synopsis: {
      ca: "Tràiler oficial del curtmetratge fantàstic protagonitzat per Timothy Gibbs i produït per PRODDIGI en format panoràmic.",
      es: "Tráiler oficial del cortometraje fantástico protagonizado por Timothy Gibbs y producido por PRODDIGI en formato panorámico.",
      en: "Official widescreen trailer for the sci-fi short film starring Timothy Gibbs, produced by PRODDIGI.",
    },
    credits: { director: "Jos Man", dop: "proddigi", post: "proddigi" },
  },
};

function formatDuration(seconds?: number): string {
  if (!seconds || !Number.isFinite(seconds) || seconds <= 0) return "01:30";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function upgradeVimeoThumb(url: string): string {
  return url.replace(/_640(\?|$)/, "_1280$1");
}

function inferCategory(title: string, tags?: string): CategoryKey {
  const text = `${title} ${tags ?? ""}`.toLowerCase();
  if (text.includes("doc")) return "documentary";
  if (text.includes("copisa") || text.includes("abbvie") || text.includes("corp")) return "corporate";
  if (text.includes("amaral") || text.includes("cabriolets") || text.includes("event") || text.includes("live")) {
    return "events";
  }
  return "commercial";
}

function parseVimeoIdFromUri(uri?: string): string {
  if (!uri) return SHOWREEL_VIMEO_ID;
  const parts = uri.split("/");
  return parts[parts.length - 1] || SHOWREEL_VIMEO_ID;
}

let cachedPortfolio: { expiresAt: number; payload: unknown } | null = null;
let cachedShowreel: { expiresAt: number; payload: unknown } | null = null;

async function fetchProddigiChannelV2(): Promise<VimeoV2Video[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch("https://vimeo.com/api/v2/proddigi/videos.json", {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return [];
    const data = (await res.json()) as unknown;
    return Array.isArray(data) ? (data as VimeoV2Video[]) : [];
  } catch {
    return [];
  }
}

async function buildPortfolioPayload(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedPortfolio && cachedPortfolio.expiresAt > now) {
    return cachedPortfolio.payload;
  }

  const accessToken = process.env.VIMEO_ACCESS_TOKEN?.trim();
  const showcaseId = process.env.VIMEO_SHOWCASE_ID?.trim();

  // 1. Authenticated Vimeo REST API v3 (optional)
  if (accessToken) {
    try {
      const endpoint = showcaseId
        ? `https://api.vimeo.com/me/albums/${encodeURIComponent(showcaseId)}/videos?per_page=15`
        : "https://api.vimeo.com/me/videos?per_page=15";

      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.vimeo.*+json;version=3.4",
        },
      });

      if (res.ok) {
        const json = (await res.json()) as { data?: VimeoApiVideo[] };
        const items: PortfolioEntry[] = (json.data ?? [])
          .filter((v) => parseVimeoIdFromUri(v.uri) !== SHOWREEL_VIMEO_ID)
          .map((video) => {
            const vimeoId = parseVimeoIdFromUri(video.uri);
            const meta = PRODDIGI_VIDEO_META[vimeoId];
            const pictures = video.pictures?.sizes ?? [];
            const vimeoThumb = pictures[pictures.length - 1]?.link ?? `./images/vimeo/${vimeoId}.jpg`;
            const localThumb = LOCAL_CACHED_IDS.has(vimeoId) ? `./images/vimeo/${vimeoId}.jpg` : vimeoThumb;
            const year = video.created_time ? video.created_time.slice(0, 4) : "2024";
            const rawTitle = video.name?.trim() || `Project ${vimeoId}`;
            const rawDesc = video.description?.trim() || "";

            return {
              slug: `vimeo-${vimeoId}`,
              vimeoId,
              thumbnail: localThumb,
              vimeoThumbnail: vimeoThumb,
              vimeoTitle: rawTitle,
              vimeoAuthor: "PRODDIGI",
              category: meta?.category ?? inferCategory(rawTitle),
              client: meta?.client ?? "PRODDIGI",
              year,
              duration: formatDuration(video.duration),
              title: meta?.title ?? { ca: rawTitle, es: rawTitle, en: rawTitle },
              synopsis: meta?.synopsis ?? { ca: rawDesc, es: rawDesc, en: rawDesc },
              credits: meta?.credits ?? { director: "proddigi", dop: "proddigi", post: "proddigi" },
              source: "vimeo-api-v3",
            };
          });

        if (items.length > 0) {
          const payload = { source: "vimeo-api-v3", count: items.length, projects: items };
          cachedPortfolio = { expiresAt: now + 600_000, payload };
          return payload;
        }
      }
    } catch {
      // Fall through to live public channel feed
    }
  }

  // 2. Live public Vimeo channel feed for https://vimeo.com/proddigi
  const v2Videos = await fetchProddigiChannelV2();
  if (v2Videos.length > 0) {
    const projects: PortfolioEntry[] = v2Videos
      .filter((v) => v.embed_privacy === "anywhere" && !EXCLUDED_DUPLICATE_IDS.has(String(v.id)))
      .map((v) => {
        const vimeoId = String(v.id);
        const meta = PRODDIGI_VIDEO_META[vimeoId];
        const vimeoThumb = upgradeVimeoThumb(v.thumbnail_large);
        const localThumb = LOCAL_CACHED_IDS.has(vimeoId) ? `./images/vimeo/${vimeoId}.jpg` : vimeoThumb;
        const year = v.upload_date ? v.upload_date.slice(0, 4) : "2024";
        const desc = v.description?.trim() || "";

        return {
          slug: `proddigi-${vimeoId}`,
          vimeoId,
          thumbnail: localThumb,
          vimeoThumbnail: vimeoThumb,
          vimeoTitle: v.title,
          vimeoAuthor: v.user_name || "PRODDIGI",
          category: meta?.category ?? inferCategory(v.title, v.tags),
          client: meta?.client ?? "PRODDIGI",
          year,
          duration: formatDuration(v.duration),
          title: meta?.title ?? { ca: v.title, es: v.title, en: v.title },
          synopsis: meta?.synopsis ?? { ca: desc, es: desc, en: desc },
          credits: meta?.credits ?? { director: "proddigi", dop: "proddigi", post: "proddigi" },
          source: "vimeo-proddigi-channel",
        };
      });

    const payload = { source: "vimeo-proddigi-channel", count: projects.length, projects };
    cachedPortfolio = { expiresAt: now + 600_000, payload };
    return payload;
  }

  // 3. Offline fallback from local Proddigi metadata
  const fallbackProjects: PortfolioEntry[] = Object.entries(PRODDIGI_VIDEO_META).map(([vimeoId, meta]) => ({
    slug: `proddigi-${vimeoId}`,
    vimeoId,
    thumbnail: `./images/vimeo/${vimeoId}.jpg`,
    vimeoThumbnail: `./images/vimeo/${vimeoId}.jpg`,
    vimeoTitle: meta.title?.en || vimeoId,
    vimeoAuthor: "PRODDIGI",
    category: meta.category,
    client: meta.client,
    year: vimeoId === "835157059" ? "2023" : vimeoId === "181189230" || vimeoId === "177059543" ? "2016" : "2014",
    duration: "02:00",
    title: meta.title || { ca: vimeoId, es: vimeoId, en: vimeoId },
    synopsis: meta.synopsis || { ca: "", es: "", en: "" },
    credits: meta.credits,
    source: "cms-fallback",
  }));

  const payload = { source: "cms-fallback", count: fallbackProjects.length, projects: fallbackProjects };
  cachedPortfolio = { expiresAt: now + 60_000, payload };
  return payload;
}

async function buildShowreelPayload() {
  const now = Date.now();
  if (cachedShowreel && cachedShowreel.expiresAt > now) {
    return cachedShowreel.payload;
  }

  const videos = await fetchProddigiChannelV2();
  const reel = videos.find((v) => String(v.id) === SHOWREEL_VIMEO_ID);
  const payload = {
    vimeoId: SHOWREEL_VIMEO_ID,
    duration: reel ? formatDuration(reel.duration) : "02:47",
    vimeoTitle: reel?.title ?? "Proddigi - Reel",
    vimeoAuthor: reel?.user_name ?? "PRODDIGI",
    thumbnail: "./images/vimeo/100886157.jpg",
    source: reel ? "vimeo-proddigi-channel" : "cms-fallback",
  };
  cachedShowreel = { expiresAt: now + 600_000, payload };
  return payload;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === "production";

  app.get("/api/vimeo/portfolio", async (req, res) => {
    const forceRefresh = req.query.refresh === "1";
    const payload = await buildPortfolioPayload(forceRefresh);
    res.json(payload);
  });

  app.get("/api/vimeo/showreel", async (_req, res) => {
    const payload = await buildShowreelPayload();
    res.json(payload);
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`proddigi server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
