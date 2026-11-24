import { FormEvent, useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Luogo } from '../types';

interface MappaScreenProps {
  luoghi: Luogo[];
  onSelectLuogo: (luogoId: string) => void;
  onSearch: (query: string) => void;
}

export function MappaScreen({
  luoghi,
  onSelectLuogo,
  onSearch,
}: MappaScreenProps) {
  const [searchText, setSearchText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchText.trim());
  };

  return (
    <div className="relative flex-1 w-full h-full flex flex-col bg-neutral-100 overflow-hidden">
      {/* Barra Cerca fissa in alto */}
      <div className="relative z-20 p-3 bg-white/95 border-b-2 border-black">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Cerca piatto (es. Carbonara, Pizza)..."
              aria-label="Cerca"
              className="w-full h-[42px] pl-8 pr-3 border border-black bg-white text-xs text-black placeholder:text-neutral-500 focus:outline-2 focus:outline-black"
            />
          </div>
          <button
            type="submit"
            className="h-[42px] px-3.5 border border-black bg-black text-white text-xs font-semibold whitespace-nowrap shrink-0 hover:bg-neutral-800 active:bg-neutral-900 cursor-pointer"
          >
            Cerca
          </button>
        </form>
      </div>

      {/* Mappa libera da esplorare (wireframe interattivo B/N) */}
      <div
        aria-label="Mappa libera da esplorare"
        className="relative flex-1 w-full overflow-hidden bg-neutral-50"
      >
        {/* Griglia wireframe geografica + sagoma stilizzata Italia in B/N */}
        <svg
          aria-hidden="true"
          viewBox="0 0 400 620"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {/* Reticolo cartografico */}
          <defs>
            <pattern
              id="map-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#e5e5e5"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="400" height="620" fill="url(#map-grid)" />

          {/* Linee topografiche wireframe */}
          <path
            d="M 95 100 L 185 88 L 245 130 L 220 185 L 250 265 L 295 360 L 330 435 L 290 480 L 265 535 L 200 570 L 160 520 L 205 450 L 180 355 L 135 280 L 125 205 L 85 160 Z"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          {/* Strade / collegamenti wireframe */}
          <path
            d="M 136 160 Q 175 215 188 212 T 208 360 T 256 428"
            fill="none"
            stroke="#a3a3a3"
            strokeWidth="1.2"
          />
          <circle
            cx="200"
            cy="310"
            r="140"
            fill="none"
            stroke="#d4d4d4"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
        </svg>

        {/* Etichetta titolo mappa */}
        <div className="relative z-10 m-3 inline-block bg-white border border-black px-2.5 py-1">
          <p className="text-[11px] font-bold uppercase tracking-wide text-black">
            Mappa libera da esplorare
          </p>
          <p className="text-[10px] text-neutral-600">
            Tocca una città, regione o paese
          </p>
        </div>

        {/* Segnaposto cliccabili: Città, Regioni, Paese */}
        {luoghi.map((luogo) => (
          <button
            key={luogo.id}
            type="button"
            onClick={() => onSelectLuogo(luogo.id)}
            style={{ left: `${luogo.x}%`, top: `${luogo.y}%` }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 min-h-[40px] px-2.5 py-1 border-2 border-black bg-white text-black shadow-[2px_2px_0_0_#000000] hover:bg-black hover:text-white active:translate-x-[calc(-50%+1px)] active:translate-y-[calc(-50%+1px)] transition-colors flex items-center gap-1 cursor-pointer group"
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="text-left leading-tight">
              <span className="block text-[11px] font-bold whitespace-nowrap">
                {luogo.nome}
              </span>
              <span className="block text-[9px] text-neutral-500 group-hover:text-neutral-300 font-mono-wf">
                {luogo.tipo}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
