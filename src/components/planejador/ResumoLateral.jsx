import { Copy, FileJson, Flame, Beef, Wheat, Droplets } from 'lucide-react';

function LinhaResumo({ icon: Icon, label, atual, meta, cor = '#0D1164' }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#F2E5E9] last:border-b-0">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color: cor }} />
        <span className="text-[14px] text-[#0D1164]/75">{label}</span>
      </div>

      <div className="text-right">
        <span className="text-[20px] font-semibold" style={{ color: cor }}>
          {atual}
        </span>
        <span className="text-[14px] text-[#0D1164]/55"> / {meta}</span>
      </div>
    </div>
  );
}

function GrupoRow({ grupo, atual, meta }) {
  const mapa = {
    Proteína: {
      cor: '#4C97F2',
      bg: 'bg-[#E7F1FF]',
      text: 'text-[#4C97F2]',
      label: 'P',
    },
    Carboidrato: {
      cor: '#58B65F',
      bg: 'bg-[#EAF7EA]',
      text: 'text-[#58B65F]',
      label: 'C',
    },
    Gordura: {
      cor: '#F39C37',
      bg: 'bg-[#FFF1E3]',
      text: 'text-[#F39C37]',
      label: 'G',
    },
  };

  const config = mapa[grupo] || {
    cor: '#0D1164',
    bg: 'bg-[#F3F3F3]',
    text: 'text-[#0D1164]',
    label: '?',
  };

  return (
    <div className="flex items-center justify-between rounded-lg bg-[#FFF7F9] px-3 py-2">
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex h-6 min-w-[24px] items-center justify-center rounded-full text-[11px] font-semibold ${config.bg} ${config.text}`}
        >
          {config.label}
        </span>

        <span className="text-[13px] text-[#0D1164]">{grupo}</span>
      </div>

      <span className="text-[16px] font-semibold text-[#0D1164]">
        {atual}
        <span className="text-[12px] font-medium text-[#0D1164]/45"> / {meta}</span>
      </span>
    </div>
  );
}

export function ResumoLateral({
  totais = { kcal: 0, carb: 0, prot: 0, gord: 0 },
  metas = { kcal: 0, carboidratosG: 0, proteinasG: 0, gordurasG: 0 },
  grupoTotais = {},
  grupoMetas = {},
  jsonGerado = '',
  onCopiarJson = () => {},
}) {
  return (
    <div className="sticky top-6 space-y-4">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-[14px] font-semibold uppercase tracking-wide text-[#EF5170]">
          Resumo do dia
        </h2>

        <div className="rounded-xl border border-[#F3D2DB] bg-[#FFF7F9] px-4 py-3">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-[#EF5170] mb-2">
            Totais
          </p>

          <LinhaResumo
            icon={Flame}
            label="Kcal"
            atual={totais.kcal}
            meta={metas.kcal}
            cor="#EF5170"
          />

          <LinhaResumo
            icon={Wheat}
            label="Carboidratos"
            atual={`${totais.carb}g`}
            meta={`${metas.carboidratosG}g`}
            cor="#58B65F"
          />

          <LinhaResumo
            icon={Beef}
            label="Proteínas"
            atual={`${totais.prot}g`}
            meta={`${metas.proteinasG}g`}
            cor="#4C97F2"
          />

          <LinhaResumo
            icon={Droplets}
            label="Gorduras"
            atual={`${totais.gord}g`}
            meta={`${metas.gordurasG}g`}
            cor="#F39C37"
          />
        </div>

        <div className="mt-5">
          <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#EF5170]">
            Porções totais por grupo
          </h3>

          <div className="space-y-2">
            {Object.keys(grupoMetas).map((grupo) => (
              <GrupoRow
                key={grupo}
                grupo={grupo}
                atual={grupoTotais[grupo] || 0}
                meta={grupoMetas[grupo]}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-[14px] font-semibold uppercase tracking-wide text-[#EF5170]">
          Gerar JSON da dieta
        </h2>

        <div className="rounded-xl border border-[#F3D2DB] bg-[#FFF7F9] p-4">
          <p className="text-[13px] leading-relaxed text-[#0D1164]/70">
            Gere o JSON da dieta deste usuário com base nas porções por grupo de cada refeição.
          </p>

          <button
            type="button"
            onClick={onCopiarJson}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#EF5170] px-4 py-3 text-sm font-medium text-white transition hover:opacity-95"
          >
            <Copy className="h-4 w-4" />
            Copiar JSON
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-[#F3D2DB] bg-[#FFF7F9] p-3">
          <div className="mb-2 flex items-center gap-2 text-[#EF5170]">
            <FileJson className="h-4 w-4" />
            <p className="text-[12px] font-semibold uppercase tracking-wide">
              Prévia
            </p>
          </div>

          <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap break-words rounded-lg bg-white p-3 text-[11px] leading-relaxed text-[#0D1164] border border-[#F1E2E7]">
            {jsonGerado}
          </pre>
        </div>
      </div>
    </div>
  );
}