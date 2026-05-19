import { createFileRoute } from "@tanstack/react-router";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Orientation = "landscape" | "portrait";

export const Route = createFileRoute("/photo/")({
  component: PhotoPage,
});

interface Photo {
  id: string;
  title: string;
  src: string;
}

const cameraModules = import.meta.glob(
  "../../assets/img/camera/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

const photos: Photo[] = (() => {
  const grouped = new Map<string, [string, string][]>();
  for (const [path, src] of Object.entries(cameraModules)) {
    const segments = path.split("/");
    const category = segments[segments.length - 2] ?? "camera";
    if (!grouped.has(category)) grouped.set(category, []);
    grouped.get(category)!.push([path, src]);
  }

  const result: Photo[] = [];
  for (const category of [...grouped.keys()].sort()) {
    const list = grouped.get(category)!.sort(([a], [b]) => a.localeCompare(b));
    list.forEach(([, src], i) => {
      const num = String(i + 1).padStart(2, "0");
      result.push({
        id: `${category}-${num}`,
        title: `${category} — ${num}`,
        src,
      });
    });
  }
  return result;
})();

function PhotoPage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const itemsRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const [orientations, setOrientations] = useState<Record<string, Orientation>>(
    {},
  );

  const allDetected =
    Object.keys(orientations).length === photos.length && photos.length > 0;

  const [columns, setColumns] = useState(3);
  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 767px)");
    const mqTablet = window.matchMedia("(max-width: 1024px)");
    const update = () => {
      if (mqMobile.matches) setColumns(1);
      else if (mqTablet.matches) setColumns(2);
      else setColumns(3);
    };
    update();
    mqMobile.addEventListener("change", update);
    mqTablet.addEventListener("change", update);
    return () => {
      mqMobile.removeEventListener("change", update);
      mqTablet.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    photos.forEach((p) => {
      const img = new Image();
      img.src = p.src;
      img.onload = () => {
        if (cancelled) return;
        setOrientations((prev) => ({
          ...prev,
          [p.id]:
            img.naturalWidth >= img.naturalHeight ? "landscape" : "portrait",
        }));
      };
      img.onerror = () => {
        if (cancelled) return;
        setOrientations((prev) => ({ ...prev, [p.id]: "landscape" }));
      };
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "auto";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    if (!allDetected) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".photo-card").forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 120,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
      ScrollTrigger.refresh();
    }, wrapperRef);
    return () => {
      ctx.revert();
    };
  }, [allDetected]);

  return (
    <div
      ref={wrapperRef}
      style={{
        ...pageStyle,
        paddingBlock: columns < 3 ? "24px" : "56px",
      }}
    >
      <header style={headerStyle}>
        <h1 style={titleStyle}>Photographs</h1>
      </header>
      <div
        style={{
          ...gridStyle,
          masonryTemplateTracks: `repeat(${columns}, 1fr)`,
          columns,
        } as CSSProperties}
      >
        {photos.map((photo) => (
          <figure key={photo.id} className="photo-card" style={cardStyle}>
            <img
              ref={(el) => {
                if (el) itemsRef.current.set(photo.id, el);
                else itemsRef.current.delete(photo.id);
              }}
              src={photo.src}
              alt={photo.title}
              loading="lazy"
              decoding="async"
              style={rectStyle}
            />
            <figcaption style={captionStyle}>{photo.title}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}


const colors = {
  white: "#FFFFFB",
  black: "#3A3226",
  gray: "#ddd",
  lightGray: "#e0e0e0",
  darkGray: "#888",
}

const pageStyle: CSSProperties = {
  paddingInline: "16px",
  color: colors.black,
  fontFamily: "monospace",
  backgroundColor: colors.white,
}

const headerStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
  maxWidth: "1200px",
  margin: "0 auto 3rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
};

const titleStyle: CSSProperties = {
  fontSize: "1.4rem",
  fontWeight: 400,
  letterSpacing: "0.05em",
};

const subtitleStyle: CSSProperties = {
  color: colors.lightGray,
  fontSize: "0.85rem",
};

const gridStyle = {
  position: "relative",
  zIndex: 2,
  display: "masonry",
  masonryDirection: "column",
  masonryAutoFlow: "pack",
  gap: "0.5rem",
  columnGap: "0.5rem",
  maxWidth: "1200px",
  margin: "0 auto",
} as CSSProperties;

const cardStyle: CSSProperties = {
  margin: 0,
  marginBottom: "0.5rem",
  breakInside: "avoid",
};

const rectStyle: CSSProperties = {
  maxWidth: "100%",
  height: "auto",
  display: "block",
};

const captionStyle: CSSProperties = {
  marginTop: "0.6rem",
  fontSize: "0.78rem",
  color: "#888",
  letterSpacing: "0.05em",
};
