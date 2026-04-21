import { ReactNode } from 'react';

type Props = {
  number: string;            // '01'
  title: string;
  question: string;
  lastRevision: string;
  children: ReactNode;
};

export function SectionCard({ number, title, question, lastRevision, children }: Props) {
  return (
    <section className="bg-white border border-gray-100 rounded-2xl p-5 mb-3">
      <header className="flex justify-between items-center gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[13px] font-bold shrink-0"
            style={{ backgroundColor: '#EEEDFE', color: '#7C3AED' }}
          >
            {number}
          </div>
          <div>
            <p className="text-[15px] font-bold text-gray-900 m-0">{title}</p>
            <p className="text-xs text-gray-500 m-0 mt-0.5 italic">{question}</p>
          </div>
        </div>
        <span
          className="text-[11px] px-2.5 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: '#ECFDF5', color: '#065F46' }}
        >
          {lastRevision}
        </span>
      </header>
      {children}
    </section>
  );
}
