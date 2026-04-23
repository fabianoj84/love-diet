import { Code2, Trash2 } from 'lucide-react';

export function HeaderPlanejador({ onGerarJson, onLimpar }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-[32px] font-semibold text-[#EF5170] leading-none">
          Planejador de Dieta
        </h1>
        <p className="text-[14px] text-[#0D1164]/70 mt-2">
          Monte as refeições, acompanhe os macros em tempo real e gere o JSON da dieta do usuário.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onGerarJson}
          className="inline-flex items-center gap-2 rounded-xl bg-[#EF5170] px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
        >
          <Code2 className="h-4 w-4" />
          Gerar JSON da dieta
        </button>

        <button
          type="button"
          onClick={onLimpar}
          className="inline-flex items-center gap-2 rounded-xl border border-[#D9D9D9] bg-white px-4 py-3 text-sm font-medium text-[#0D1164] transition hover:bg-[#F7F4F8]"
        >
          <Trash2 className="h-4 w-4" />
          Limpar tudo
        </button>
      </div>
    </div>
  );
}