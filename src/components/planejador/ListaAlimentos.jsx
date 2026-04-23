import { Search } from 'lucide-react';

const FILTROS = ['Todos', 'Proteína', 'Carboidrato', 'Gordura'];

function getGrupoStyles(grupo) {
  const mapa = {
    Proteína: {
      badge: 'bg-[#E7F1FF] text-[#4C97F2]',
      mini: 'bg-[#E7F1FF] text-[#4C97F2]',
      label: 'P',
    },
    Carboidrato: {
      badge: 'bg-[#EAF7EA] text-[#58B65F]',
      mini: 'bg-[#EAF7EA] text-[#58B65F]',
      label: 'C',
    },
    Gordura: {
      badge: 'bg-[#FFF1E3] text-[#F39C37]',
      mini: 'bg-[#FFF1E3] text-[#F39C37]',
      label: 'G',
    },
  };

  return (
    mapa[grupo] || {
      badge: 'bg-[#F3F3F3] text-[#0D1164]',
      mini: 'bg-[#F3F3F3] text-[#0D1164]',
      label: '?',
    }
  );
}

function MacroLinha({ alimento }) {
  return (
    <div className="mt-1 flex items-center gap-2 flex-wrap text-[11px] text-[#0D1164]/60">
      <span>P {alimento.proteinasG}g</span>
      <span>|</span>
      <span>C {alimento.carboidratosG}g</span>
      <span>|</span>
      <span>G {alimento.gordurasG}g</span>
    </div>
  );
}

export function ListaAlimentos({
  alimentos = [],
  busca = '',
  onBuscaChange = () => {},
  filtro = 'Todos',
  onFiltroChange = () => {},
  onAdicionarAlimento = () => {},
  nomeRefeicaoAtiva = '',
}) {
  return (
    <div className="sticky top-6 flex h-[calc(100vh-220px)] flex-col rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-[14px] font-semibold uppercase tracking-wide text-[#EF5170]">
          Alimentos
        </h2>

        <p className="mt-1 text-[12px] leading-relaxed text-[#0D1164]/65">
          {nomeRefeicaoAtiva
            ? `Clique em um alimento para adicionar em "${nomeRefeicaoAtiva}".`
            : 'Selecione uma refeição para começar.'}
        </p>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0D1164]/40" />
        <input
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          placeholder="Buscar alimento..."
          className="w-full rounded-xl border border-[#D9D9D9] bg-white py-3 pl-10 pr-4 text-[14px] text-[#0D1164] outline-none placeholder:text-[#0D1164]/35"
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTROS.map((item) => {
          const ativo = filtro === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onFiltroChange(item)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition ${
                ativo
                  ? 'bg-[#EF5170] text-white shadow-sm'
                  : 'bg-[#FFD8DF] text-[#0D1164] hover:bg-[#F9D0D8]'
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        {alimentos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#F1B8C4] bg-[#FFF8FA] px-4 py-6 text-center">
            <p className="text-[14px] font-medium text-[#0D1164]/75">
              Nenhum alimento encontrado.
            </p>
            <p className="mt-1 text-[12px] text-[#0D1164]/55">
              Tente buscar por outro nome ou alterar o filtro.
            </p>
          </div>
        ) : (
          alimentos.map((item) => {
            const grupoStyles = getGrupoStyles(item.grupo);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onAdicionarAlimento(item.id)}
                className="w-full rounded-xl border border-transparent bg-[#FAF7F8] p-3 text-left transition hover:border-[#F3C0CD] hover:bg-[#FFF3F6]"
              >
                <div className="flex items-start gap-3">
                  {item.imagem ? (
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="h-12 w-12 rounded-xl object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-[#D9D9D9]" />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="truncate text-[14px] font-medium leading-tight text-[#0D1164]">
                            {item.nome}
                          </p>

                          <span
                            className={`inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${grupoStyles.mini}`}
                          >
                            {grupoStyles.label}
                          </span>
                        </div>

                        <p className="mt-1 text-[12px] text-[#0D1164]/60">
                          {item.porcao}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-[15px] font-semibold leading-none text-[#0D1164]">
                          {item.energiaKcal}
                        </p>
                        <p className="mt-1 text-[11px] text-[#0D1164]/55">kcal</p>
                      </div>
                    </div>

                    <MacroLinha alimento={item} />

                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${grupoStyles.badge}`}
                      >
                        {item.grupo}
                      </span>

                      <span className="text-[11px] font-medium text-[#EF5170]">
                        Clique para adicionar
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="pt-4">
        <button
          type="button"
          className="w-full rounded-xl border border-[#D9D9D9] bg-white px-4 py-3 text-[14px] font-medium text-[#0D1164] transition hover:bg-[#F9F6F8]"
        >
          Ver todos os alimentos
        </button>
      </div>
    </div>
  );
}