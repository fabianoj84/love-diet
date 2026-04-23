import { Minus, Plus, Trash2, Pencil, Utensils, Apple, Sunset, Moon } from 'lucide-react';

function getMealIcon(nome) {
  const normalizado = (nome || '').toLowerCase();

  if (normalizado.includes('café')) return Utensils;
  if (normalizado.includes('almoço')) return Utensils;
  if (normalizado.includes('lanche')) return Apple;
  if (normalizado.includes('tarde')) return Sunset;
  if (normalizado.includes('janta')) return Moon;

  return Utensils;
}

function BadgeGrupo({ grupo }) {
  const mapa = {
    Proteína: 'bg-[#E7F1FF] text-[#4C97F2]',
    Carboidrato: 'bg-[#EAF7EA] text-[#58B65F]',
    Gordura: 'bg-[#FFF1E3] text-[#F39C37]',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
        mapa[grupo] || 'bg-white text-[#0D1164]'
      }`}
    >
      {grupo}
    </span>
  );
}

function GrupoResumoInline({ grupos = [], porcoesPorGrupo = {} }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {grupos.map((grupo) => {
        const label =
          grupo.categoria === 'Proteína'
            ? 'P'
            : grupo.categoria === 'Carboidrato'
            ? 'C'
            : 'G';

        const cor =
          grupo.categoria === 'Proteína'
            ? 'bg-[#E7F1FF] text-[#4C97F2]'
            : grupo.categoria === 'Carboidrato'
            ? 'bg-[#EAF7EA] text-[#58B65F]'
            : 'bg-[#FFF1E3] text-[#F39C37]';

        return (
          <div key={grupo.categoria} className="flex items-center gap-1.5">
            <span
              className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-md px-1 text-[11px] font-semibold ${cor}`}
            >
              {label}
            </span>
            <span className="text-[13px] font-medium text-[#0D1164]">
              {porcoesPorGrupo[grupo.categoria] || 0}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function CardRefeicaoEditor({
  refeicao = {
    id: '',
    nome: '',
    imagem: '',
    grupos: [],
    itemsDetalhados: [],
    totais: { kcal: 0, carb: 0, prot: 0, gord: 0 },
    porcoesPorGrupo: {},
  },
  isActive = false,
  onSelecionar = () => {},
  onAumentarPorcao = () => {},
  onDiminuirPorcao = () => {},
  onRemoverItem = () => {},
  onLimparRefeicao = () => {},
}) {
  const itensDetalhados = refeicao?.itemsDetalhados || [];
  const totais = refeicao?.totais || { kcal: 0, carb: 0, prot: 0, gord: 0 };
  const grupos = refeicao?.grupos || [];
  const porcoesPorGrupo = refeicao?.porcoesPorGrupo || {};
  const IconeRefeicao = getMealIcon(refeicao?.nome);

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white transition-all ${
        isActive
          ? 'border-[#EF5170] ring-2 ring-[#F6C6D2] shadow-sm'
          : 'border-[#E8DDE1]'
      }`}
    >
      <button
        type="button"
        onClick={() => onSelecionar(refeicao.id)}
        className="w-full bg-[#EF5170] px-4 py-4 text-left"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              {refeicao.imagem ? (
                <img
                  src={refeicao.imagem}
                  alt={refeicao.nome}
                  className="h-11 w-11 rounded-full object-cover border-2 border-white/40"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 border-2 border-white/30">
                  <IconeRefeicao className="h-5 w-5 text-white" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-[18px] font-semibold leading-none text-white">
                {refeicao.nome}
              </h3>
              <p className="mt-1 text-[12px] text-white/85">
                {isActive ? 'Refeição ativa' : 'Clique para ativar'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/90">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelecionar(refeicao.id);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
              title="Editar"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLimparRefeicao(refeicao.id);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
              title="Remover refeição"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </button>

      <div className="px-4 pb-4">
        <div className="grid grid-cols-[1fr_120px_70px_28px] gap-3 border-b border-[#F1D0D8] px-1 py-3">
          <span className="text-[12px] font-semibold uppercase tracking-wide text-[#3B3F8C]">
            Alimento
          </span>
          <span className="text-center text-[12px] font-semibold uppercase tracking-wide text-[#3B3F8C]">
            Porções
          </span>
          <span className="text-right text-[12px] font-semibold uppercase tracking-wide text-[#3B3F8C]">
            Kcal
          </span>
          <span />
        </div>

        <div className="space-y-3 pt-4 min-h-[240px]">
          {itensDetalhados.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#F1B8C4] bg-[#FFF8FA] px-4 py-7 text-center">
              <p className="text-[14px] font-medium text-[#0D1164]/75">
                Nenhum alimento adicionado.
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-[#0D1164]/50">
                Selecione esta refeição e clique em um alimento na coluna da esquerda.
              </p>
            </div>
          ) : (
            itensDetalhados.map((item) => (
              <div
                key={item.uid}
                className="rounded-xl border border-[#F5D7DF] bg-[#FFF7F9] px-3 py-3"
              >
                <div className="grid grid-cols-[1fr_120px_70px_28px] gap-3 items-start">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="truncate text-[15px] font-medium leading-tight text-[#0D1164]">
                        {item.alimento.nome}
                      </p>
                      <BadgeGrupo grupo={item.alimento.grupo} />
                    </div>

                    <p className="mt-1 text-[12px] text-[#0D1164]/60">
                      {item.alimento.porcao}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 rounded-full bg-[#F8E7EC] px-2 py-1">
                    <button
                      type="button"
                      onClick={() => onDiminuirPorcao(refeicao.id, item.uid)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[#EF5170] hover:bg-[#FFD8DF] transition"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="min-w-[18px] text-center text-[15px] font-semibold text-[#3B3F8C]">
                      {item.porcoes}
                    </span>

                    <button
                      type="button"
                      onClick={() => onAumentarPorcao(refeicao.id, item.uid)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[#EF5170] hover:bg-[#FFD8DF] transition"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-[17px] font-semibold leading-none text-[#0D1164]">
                      {item.totais.kcal}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoverItem(refeicao.id, item.uid)}
                    className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-[#EF5170] hover:bg-[#FFD8DF] transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3 border-t border-[#F0C4CF] pt-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#EF5170] font-semibold">
                      Carboidratos
                    </p>
                    <p className="mt-1 text-[13px] font-medium text-[#58B65F]">
                      {item.totais.carb}g
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#EF5170] font-semibold">
                      Proteína
                    </p>
                    <p className="mt-1 text-[13px] font-medium text-[#4C97F2]">
                      {item.totais.prot}g
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#EF5170] font-semibold">
                      Gordura
                    </p>
                    <p className="mt-1 text-[13px] font-medium text-[#F39C37]">
                      {item.totais.gord}g
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelecionar(refeicao.id)}
          className="mt-4 w-full rounded-xl border border-dashed border-[#F1B8C4] bg-[#FFF8FA] px-4 py-3 text-[14px] font-medium text-[#EF5170] hover:bg-[#FFF3F6] transition"
        >
          + Adicionar alimento
        </button>

        <div className="mt-4 rounded-xl border border-[#F3D2DB] bg-[#FFF3F6] px-4 py-4">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-[#3B3F8C] mb-3">
            Totais
          </p>

          <div className="grid grid-cols-4 gap-3 items-end">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-[#0D1164]/60">P</p>
              <p className="mt-1 text-[18px] font-semibold text-[#4C97F2]">
                {totais.prot}g
              </p>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wide text-[#0D1164]/60">C</p>
              <p className="mt-1 text-[18px] font-semibold text-[#58B65F]">
                {totais.carb}g
              </p>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wide text-[#0D1164]/60">G</p>
              <p className="mt-1 text-[18px] font-semibold text-[#F39C37]">
                {totais.gord}g
              </p>
            </div>

            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wide text-[#0D1164]/60">Kcal</p>
              <p className="mt-1 text-[20px] font-semibold text-[#0D1164]">
                {totais.kcal}
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-[#F0C4CF] pt-4">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#3B3F8C] mb-3">
              Porções por grupo
            </p>

            <GrupoResumoInline
              grupos={grupos}
              porcoesPorGrupo={porcoesPorGrupo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}