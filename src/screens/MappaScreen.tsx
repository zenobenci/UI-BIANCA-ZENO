import {
  FormEvent,
  PointerEvent,
  WheelEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MapPin, Minus, Plus, RotateCcw, Search, X } from 'lucide-react';
import { Luogo } from '../types';

interface MappaScreenProps {
  luoghi: Luogo[];
  onSelectLuogo: (luogoId: string) => void;
  onSearch: (query: string) => void;
}

const ZOOM_THRESHOLD = 1.55;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3.2;

export function MappaScreen({
  luoghi,
  onSelectLuogo,
  onSearch,
}: MappaScreenProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    origPanX: number;
    origPanY: number;
    moved: boolean;
  }>({
    active: false,
    startX: 0,
    startY: 0,
    origPanX: 0,
    origPanY: 0,
    moved: false,
  });

  const regioni = useMemo(
    () => luoghi.filter((l) => l.tipo === 'Regione'),
    [luoghi]
  );
  const citta = useMemo(
    () => luoghi.filter((l) => l.tipo === 'Città'),
    [luoghi]
  );

  const isZoomed = zoom >= ZOOM_THRESHOLD;

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isSearchOpen]);

  const clampPan = (nx: number, ny: number, targetZoom: number) => {
    if (targetZoom <= 1) return { x: 0, y: 0 };
    const el = containerRef.current;
    const w = el ? el.clientWidth : 380;
    const h = el ? el.clientHeight : 600;
    const maxX = ((targetZoom - 1) * w) / 2 + 40;
    const maxY = ((targetZoom - 1) * h) / 2 + 40;
    return {
      x: Math.max(-maxX, Math.min(maxX, nx)),
      y: Math.max(-maxY, Math.min(maxY, ny)),
    };
  };

  const applyZoom = (nextZoom: number) => {
    const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom));
    setZoom(clamped);
    setPan((prev) => clampPan(prev.x, prev.y, clamped));
  };

  const handleZoomIn = () => {
    if (zoom < ZOOM_THRESHOLD) {
      applyZoom(1.85);
    } else {
      applyZoom(Number((zoom + 0.5).toFixed(2)));
    }
  };

  const handleZoomOut = () => {
    const next = zoom - 0.55;
    applyZoom(next <= 1.15 ? 1 : Number(next.toFixed(2)));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    applyZoom(Number((zoom + delta).toFixed(2)));
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, input, form')) {
      return;
    }
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origPanX: pan.x,
      origPanY: pan.y,
      moved: false,
    };
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      dragRef.current.moved = true;
    }
    if (zoom > 1 && dragRef.current.moved) {
      setPan(
        clampPan(
          dragRef.current.origPanX + dx,
          dragRef.current.origPanY + dy,
          zoom
        )
      );
    }
  };

  const handlePointerUp = () => {
    dragRef.current.active = false;
  };

  const handleRegionClick = (regioneId: string) => {
    if (dragRef.current.moved) return;
    onSelectLuogo(regioneId);
  };

  const handleSubmitSearch = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchText.trim());
  };

  return (
    <div className="relative flex-1 w-full h-full flex flex-col bg-neutral-100 overflow-hidden select-none">
      {/* Lente di ricerca in alto a destra */}
      <div className="absolute top-3 left-3 right-3 z-30 flex justify-end pointer-events-none">
        {!isSearchOpen ? (
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Apri ricerca"
            className="w-[42px] h-[42px] border-2 border-black bg-white text-black flex items-center justify-center shadow-[3px_3px_0_0_#000000] hover:bg-black hover:text-white transition-colors pointer-events-auto cursor-pointer shrink-0"
          >
            <Search className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-full bg-white border-2 border-black p-2 shadow-[4px_4px_0_0_#000000] pointer-events-auto">
            <form onSubmit={handleSubmitSearch} className="flex items-center gap-1.5">
              <Search className="w-4 h-4 text-neutral-500 shrink-0 ml-1" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Cerca piatto (es. Carbonara, Pizza)..."
                aria-label="Cerca piatto"
                className="flex-1 min-w-0 h-[38px] px-2 bg-white text-xs text-black placeholder:text-neutral-500 focus:outline-none"
              />
              <button
                type="submit"
                className="h-[38px] px-3 border border-black bg-black text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                Cerca
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Chiudi ricerca"
                className="w-[38px] h-[38px] border border-black bg-white text-black flex items-center justify-center hover:bg-neutral-100 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Viewport Mappa Italia */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        aria-label="Mappa dell'Italia divisa per regioni"
        className={`relative flex-1 w-full h-full flex items-center justify-center overflow-hidden bg-neutral-100 ${
          zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        }`}
      >
        {/* Reticolo sfondo fisso wireframe */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(to right, #d4d4d4 1px, transparent 1px), linear-gradient(to bottom, #d4d4d4 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Stage trasformabile Italia (400x500) */}
        <div
          className="relative w-[92%] max-w-[360px] aspect-[400/500] transition-transform duration-150 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Italia divisa in 20 regioni SVG + sagome paesi limitrofi */}
          <svg
            viewBox="0 0 400 500"
            className="w-full h-full overflow-visible"
            role="img"
            aria-label="Cartina dell'Italia divisa per regioni con sagome dei paesi limitrofi"
          >
            {/* Sagome dei paesi limitrofi (non cliccabili, senza etichette) */}
            <g
              aria-hidden="true"
              className="pointer-events-none"
              fill="#e5e5e5"
              stroke="#a3a3a3"
              strokeWidth={isZoomed ? 0.9 / Math.sqrt(zoom) : 1}
              strokeDasharray="3 2"
              strokeLinejoin="round"
            >
              {/* Francia */}
              <path d="M -140 -80 L 72 -80 L 66 15 L 84 56 L 48 64 L 38 92 L 44 126 L 42 150 L 18 164 L -35 175 L -140 198 Z" />
              {/* Svizzera */}
              <path d="M 72 -80 L 165 -80 L 162 28 L 142 40 L 106 54 L 84 56 L 66 15 Z" />
              {/* Austria */}
              <path d="M 165 -80 L 350 -80 L 330 22 L 260 40 L 220 34 L 186 20 L 142 40 L 162 28 Z" />
              {/* Slovenia */}
              <path d="M 260 40 L 330 22 L 354 68 L 308 98 L 258 102 L 274 78 Z" />
              {/* Croazia / fascia adriatica orientale */}
              <path d="M 258 102 L 308 98 L 354 68 L 520 55 L 520 315 L 442 285 L 385 225 L 336 164 L 292 128 L 272 114 Z" />
              {/* Corsica */}
              <path d="M 66 226 L 76 238 L 78 266 L 68 282 L 54 274 L 54 244 Z" />
              {/* Costa nordafricana (Tunisia) */}
              <path d="M -100 488 L 48 482 L 92 508 L 116 565 L -100 565 Z" />
            </g>

            {regioni.map((regione) => {
              const isHovered = hoveredRegionId === regione.id;
              return (
                <path
                  key={regione.id}
                  d={regione.svgPath}
                  onMouseEnter={() => setHoveredRegionId(regione.id)}
                  onMouseLeave={() => setHoveredRegionId(null)}
                  onClick={() => handleRegionClick(regione.id)}
                  className="cursor-pointer transition-colors duration-100"
                  fill={isHovered ? '#e5e5e5' : '#ffffff'}
                  stroke="#000000"
                  strokeWidth={isZoomed ? 1.1 / Math.sqrt(zoom) : 1.4}
                  strokeLinejoin="round"
                />
              );
            })}
          </svg>

          {/* NON ZOOMATA: mostra solo i nomi delle regioni */}
          {!isZoomed &&
            regioni.map((regione) => (
              <button
                key={`label-${regione.id}`}
                type="button"
                onClick={() => handleRegionClick(regione.id)}
                style={{
                  left: `${(regione.x / 400) * 100}%`,
                  top: `${(regione.y / 500) * 100}%`,
                }}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-white/95 border border-black text-[8.5px] font-bold text-black leading-none whitespace-nowrap hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                {regione.nome}
              </button>
            ))}

          {/* ZOOMATA: compaiono le città cliccabili */}
          {isZoomed &&
            citta.map((city) => {
              const invScale = 1 / Math.pow(zoom, 0.72);
              return (
                <button
                  key={`city-${city.id}`}
                  type="button"
                  onClick={() => {
                    if (!dragRef.current.moved) {
                      onSelectLuogo(city.id);
                    }
                  }}
                  style={{
                    left: `${(city.x / 400) * 100}%`,
                    top: `${(city.y / 500) * 100}%`,
                    transform: `translate(-50%, -50%) scale(${invScale})`,
                  }}
                  className="absolute z-20 min-h-[34px] px-2 py-1 border-2 border-black bg-white text-black shadow-[2px_2px_0_0_#000000] hover:bg-black hover:text-white transition-colors flex items-center gap-1 cursor-pointer group"
                >
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="text-[11px] font-bold whitespace-nowrap leading-none">
                    {city.nome}
                  </span>
                </button>
              );
            })}
        </div>

        {/* Controlli zoom in basso a destra */}
        <div className="absolute bottom-3 right-3 z-30 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom avanti"
            className="w-[42px] h-[42px] border-2 border-black bg-white text-black flex items-center justify-center shadow-[3px_3px_0_0_#000000] hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom indietro"
            disabled={zoom <= MIN_ZOOM}
            className="w-[42px] h-[42px] border-2 border-black bg-white text-black flex items-center justify-center shadow-[3px_3px_0_0_#000000] hover:bg-black hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black transition-colors cursor-pointer"
          >
            <Minus className="w-5 h-5" />
          </button>
          {zoom > 1 && (
            <button
              type="button"
              onClick={handleResetZoom}
              aria-label="Ripristina zoom"
              className="w-[42px] h-[42px] border-2 border-black bg-black text-white text-[10px] font-mono-wf font-bold flex flex-col items-center justify-center shadow-[3px_3px_0_0_#000000] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="leading-none mt-0.5">1x</span>
            </button>
          )}
        </div>

        {/* Indicatore livello zoom in basso a sinistra */}
        <div className="absolute bottom-3 left-3 z-20 border border-black bg-white/95 px-2 py-1 text-[10px] font-mono-wf text-black pointer-events-none">
          Zoom {zoom.toFixed(1)}x · {isZoomed ? 'Città' : 'Regioni'}
        </div>
      </div>
    </div>
  );
}
