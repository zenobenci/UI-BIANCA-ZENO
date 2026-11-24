/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';

type Page = 1 | 2;

export default function App() {
  const [page, setPage] = useState<Page>(1);

  return (
    <main className="wireframe-canvas min-h-dvh w-full flex items-center justify-center p-4 sm:p-6">
      {/* iPhone 11 wireframe device shell (414 x 896 screen proportion) */}
      <div
        className="relative flex items-center justify-center select-none"
        style={{
          width: 'min(414px, calc((100dvh - 48px) * 414 / 896), calc(100vw - 32px))',
        }}
      >
        {/* Left hardware buttons (mute + volume) */}
        <div
          aria-hidden="true"
          className="absolute -left-[5px] top-[13%] w-[4px] h-[3.2%] border-2 border-r-0 border-black bg-white rounded-l-sm"
        />
        <div
          aria-hidden="true"
          className="absolute -left-[5px] top-[20%] w-[4px] h-[6.2%] border-2 border-r-0 border-black bg-white rounded-l-sm"
        />
        <div
          aria-hidden="true"
          className="absolute -left-[5px] top-[28%] w-[4px] h-[6.2%] border-2 border-r-0 border-black bg-white rounded-l-sm"
        />

        {/* Right hardware button (side/power) */}
        <div
          aria-hidden="true"
          className="absolute -right-[5px] top-[22%] w-[4px] h-[9.5%] border-2 border-l-0 border-black bg-white rounded-r-sm"
        />

        {/* Outer device bezel */}
        <div className="w-full aspect-[414/896] rounded-[48px] border-2 border-black bg-white p-3 shadow-[8px_8px_0_0_#000000]">
          {/* Inner iPhone 11 screen */}
          <div className="relative w-full h-full rounded-[36px] border-2 border-black bg-white overflow-hidden flex flex-col">
            {/* iPhone 11 wireframe notch */}
            <div aria-hidden="true" className="w-full flex justify-center shrink-0">
              <div className="w-[50%] h-[28px] border-2 border-t-0 border-black rounded-b-[18px] bg-white flex items-center justify-center gap-2.5">
                <span className="w-10 h-[4px] border border-black rounded-full bg-white" />
                <span className="w-2.5 h-2.5 border border-black rounded-full bg-white" />
              </div>
            </div>

            {/* Empty page viewport containing ONLY the single navigation button */}
            <section
              aria-label={page === 1 ? 'Pagina 1' : 'Pagina 2'}
              className="flex-1 w-full flex items-center justify-center px-6"
            >
              {page === 1 ? (
                <button
                  type="button"
                  onClick={() => setPage(2)}
                  className="min-h-[48px] min-w-[148px] px-8 py-3 border-2 border-black bg-white text-black text-base font-medium tracking-wide whitespace-nowrap shrink-0 shadow-[4px_4px_0_0_#000000] transition-[background-color,color,transform,box-shadow] duration-150 ease-out hover:bg-black hover:text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#000000] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black cursor-pointer"
                >
                  avanti
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPage(1)}
                  className="min-h-[48px] min-w-[148px] px-8 py-3 border-2 border-black bg-white text-black text-base font-medium tracking-wide whitespace-nowrap shrink-0 shadow-[4px_4px_0_0_#000000] transition-[background-color,color,transform,box-shadow] duration-150 ease-out hover:bg-black hover:text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#000000] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black cursor-pointer"
                >
                  indietro
                </button>
              )}
            </section>

            {/* iPhone 11 wireframe home indicator */}
            <div aria-hidden="true" className="w-full pb-2.5 pt-1 flex justify-center shrink-0">
              <div className="w-[34%] h-[5px] border border-black rounded-full bg-white" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
