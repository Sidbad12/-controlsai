import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Drawer } from 'vaul';

interface Props {
  pdfUrl: string;
  initialPage: number;
  onClose: () => void;
}

export default function PdfViewerModal({ pdfUrl, initialPage, onClose }: Props) {
  // Memoize the plugin instance to prevent infinite re-render loops in React 18 Strict Mode
  const defaultLayoutPluginInstance = React.useMemo(() => defaultLayoutPlugin(), []);

  return (
    <Drawer.Root open={true} onOpenChange={(open) => { if (!open) onClose(); }} direction="bottom" shouldScaleBackground>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-[9999]" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[20px] h-[90vh] mt-24 fixed bottom-0 left-0 right-0 z-[10000] focus:outline-none shadow-2xl">
          <div className="p-4 bg-white rounded-t-[20px] flex-1 overflow-hidden flex flex-col">
            <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300 mb-6 cursor-grab active:cursor-grabbing" />
            <div className="w-full max-w-[1200px] mx-auto flex justify-between items-center mb-4 px-2">
              <h3 className="font-industrial uppercase font-bold text-[#0050C0] tracking-widest text-lg flex items-center gap-2">
                <span className="material-symbols-outlined">library_books</span> Referenced Document
              </h3>
              <button
                onClick={onClose}
                className="bg-[#EAEAEA] text-[#001540] border border-black/5 px-4 py-2 rounded-sm cursor-pointer font-industrial font-medium text-xs flex items-center gap-1.5 hover:bg-[#C8D8F0] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">close</span> Close PDF
              </button>
            </div>
            
            <div className="w-full max-w-[1200px] mx-auto h-full bg-[#EAEAEA] flex-1 overflow-hidden border border-[#C8D8F0]/30 shadow-inner relative rounded-sm">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={pdfUrl}
                  plugins={[defaultLayoutPluginInstance]}
                  initialPage={initialPage}
                />
              </Worker>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
