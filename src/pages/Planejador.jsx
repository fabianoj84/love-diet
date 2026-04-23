import { useMemo, useState } from 'react';
import usuarios from '../data/usuarios.json';
import dietas from '../data/dietas.json';
import alimentos from '../data/alimentos.json';
import { HeaderPlanejador } from '../components/planejador/HeaderPlanejador';
import { ResumoMetas } from '../components/planejador/ResumoMetas';
import { ListaAlimentos } from '../components/planejador/ListaAlimentos';
import { CardRefeicaoEditor } from '../components/planejador/CardRefeicaoEditor';
import { ResumoLateral } from '../components/planejador/ResumoLateral';

function criarUid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function roundValue(value) {
  return Math.round(value * 100) / 100;
}

function buildInitialMeals(usuarioId) {
  const dieta = dietas[String(usuarioId)];

  if (!dieta?.refeicoes?.length) return [];

  return dieta.refeicoes.map((refeicao) => ({
    id: refeicao.id,
    nome: refeicao.nome,
    imagem: refeicao.imagem,
    grupos: refeicao.grupos,
    itens: [],
  }));
}

export function Planejador() {
  const [usuarioId, setUsuarioId] = useState(1);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todos');
  const [refeicoes, setRefeicoes] = useState(() => buildInitialMeals(1));
  const [refeicaoAtivaId, setRefeicaoAtivaId] = useState(() => {
    const iniciais = buildInitialMeals(1);
    return iniciais[0]?.id ?? null;
  });

  const usuarioSelecionado = useMemo(
    () => usuarios.find((usuario) => usuario.id === usuarioId) || null,
    [usuarioId]
  );

  const alimentosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return alimentos.filter((item) => {
      const matchFiltro = filtro === 'Todos' ? true : item.grupo === filtro;

      const matchBusca =
        !termo ||
        item.nome.toLowerCase().includes(termo) ||
        (item.descricao || '').toLowerCase().includes(termo) ||
        item.grupo.toLowerCase().includes(termo);

      return matchFiltro && matchBusca;
    });
  }, [busca, filtro]);

  const mapaAlimentos = useMemo(() => {
    return Object.fromEntries(alimentos.map((item) => [item.id, item]));
  }, []);

  const refeicoesCalculadas = useMemo(() => {
    return refeicoes.map((refeicao) => {
      const itemsDetalhados = (refeicao.itens || [])
        .map((item) => {
          const alimento = mapaAlimentos[item.alimentoId];
          if (!alimento) return null;

          return {
            ...item,
            alimento,
            totais: {
              kcal: roundValue(alimento.energiaKcal * item.porcoes),
              carb: roundValue(alimento.carboidratosG * item.porcoes),
              prot: roundValue(alimento.proteinasG * item.porcoes),
              gord: roundValue(alimento.gordurasG * item.porcoes),
            },
          };
        })
        .filter(Boolean);

      const totais = itemsDetalhados.reduce(
        (acc, item) => {
          acc.kcal += item.totais.kcal;
          acc.carb += item.totais.carb;
          acc.prot += item.totais.prot;
          acc.gord += item.totais.gord;
          return acc;
        },
        { kcal: 0, carb: 0, prot: 0, gord: 0 }
      );

      const porcoesPorGrupo = (refeicao.grupos || []).reduce((acc, grupo) => {
        acc[grupo.categoria] = 0;
        return acc;
      }, {});

      itemsDetalhados.forEach((item) => {
        const grupo = item.alimento.grupo;
        porcoesPorGrupo[grupo] = (porcoesPorGrupo[grupo] || 0) + item.porcoes;
      });

      return {
        ...refeicao,
        itemsDetalhados,
        totais: {
          kcal: roundValue(totais.kcal),
          carb: roundValue(totais.carb),
          prot: roundValue(totais.prot),
          gord: roundValue(totais.gord),
        },
        porcoesPorGrupo,
      };
    });
  }, [refeicoes, mapaAlimentos]);

  const totaisDia = useMemo(() => {
    return refeicoesCalculadas.reduce(
      (acc, refeicao) => {
        acc.kcal += refeicao.totais.kcal;
        acc.carb += refeicao.totais.carb;
        acc.prot += refeicao.totais.prot;
        acc.gord += refeicao.totais.gord;
        return acc;
      },
      { kcal: 0, carb: 0, prot: 0, gord: 0 }
    );
  }, [refeicoesCalculadas]);

  const totaisDiaArredondados = useMemo(
    () => ({
      kcal: roundValue(totaisDia.kcal),
      carb: roundValue(totaisDia.carb),
      prot: roundValue(totaisDia.prot),
      gord: roundValue(totaisDia.gord),
    }),
    [totaisDia]
  );

  const diferenca = useMemo(() => {
    const metas = usuarioSelecionado?.metas;

    if (!metas) {
      return { kcal: 0, carb: 0, prot: 0, gord: 0 };
    }

    return {
      kcal: roundValue(totaisDiaArredondados.kcal - metas.kcal),
      carb: roundValue(totaisDiaArredondados.carb - metas.carboidratosG),
      prot: roundValue(totaisDiaArredondados.prot - metas.proteinasG),
      gord: roundValue(totaisDiaArredondados.gord - metas.gordurasG),
    };
  }, [usuarioSelecionado, totaisDiaArredondados]);

  const grupoTotais = useMemo(() => {
    return refeicoesCalculadas.reduce(
      (acc, refeicao) => {
        Object.entries(refeicao.porcoesPorGrupo || {}).forEach(([grupo, valor]) => {
          acc[grupo] = (acc[grupo] || 0) + valor;
        });
        return acc;
      },
      { Proteína: 0, Carboidrato: 0, Gordura: 0 }
    );
  }, [refeicoesCalculadas]);

  const grupoMetas = useMemo(() => {
    return refeicoes.reduce(
      (acc, refeicao) => {
        (refeicao.grupos || []).forEach((grupo) => {
          acc[grupo.categoria] = (acc[grupo.categoria] || 0) + grupo.porcoes;
        });
        return acc;
      },
      { Proteína: 0, Carboidrato: 0, Gordura: 0 }
    );
  }, [refeicoes]);

  const nomeRefeicaoAtiva = useMemo(() => {
    return refeicoes.find((item) => item.id === refeicaoAtivaId)?.nome ?? '';
  }, [refeicoes, refeicaoAtivaId]);

  function trocarUsuario(novoId) {
    const base = buildInitialMeals(novoId);
    setUsuarioId(novoId);
    setRefeicoes(base);
    setRefeicaoAtivaId(base[0]?.id ?? null);
  }

  function adicionarAlimentoNaRefeicao(alimentoId) {
    if (!refeicaoAtivaId) return;

    setRefeicoes((prev) =>
      prev.map((refeicao) => {
        if (refeicao.id !== refeicaoAtivaId) return refeicao;

        const existente = (refeicao.itens || []).find(
          (item) => item.alimentoId === alimentoId
        );

        if (existente) {
          return {
            ...refeicao,
            itens: refeicao.itens.map((item) =>
              item.alimentoId === alimentoId
                ? { ...item, porcoes: item.porcoes + 1 }
                : item
            ),
          };
        }

        return {
          ...refeicao,
          itens: [
            ...(refeicao.itens || []),
            {
              uid: criarUid(),
              alimentoId,
              porcoes: 1,
            },
          ],
        };
      })
    );
  }

  function aumentarPorcao(refeicaoId, uid) {
    setRefeicoes((prev) =>
      prev.map((refeicao) =>
        refeicao.id === refeicaoId
          ? {
              ...refeicao,
              itens: (refeicao.itens || []).map((item) =>
                item.uid === uid ? { ...item, porcoes: item.porcoes + 1 } : item
              ),
            }
          : refeicao
      )
    );
  }

  function diminuirPorcao(refeicaoId, uid) {
    setRefeicoes((prev) =>
      prev.map((refeicao) => {
        if (refeicao.id !== refeicaoId) return refeicao;

        return {
          ...refeicao,
          itens: (refeicao.itens || [])
            .map((item) =>
              item.uid === uid ? { ...item, porcoes: item.porcoes - 1 } : item
            )
            .filter((item) => item.porcoes > 0),
        };
      })
    );
  }

  function removerItem(refeicaoId, uid) {
    setRefeicoes((prev) =>
      prev.map((refeicao) =>
        refeicao.id === refeicaoId
          ? {
              ...refeicao,
              itens: (refeicao.itens || []).filter((item) => item.uid !== uid),
            }
          : refeicao
      )
    );
  }

  function limparItensDaRefeicao(refeicaoId) {
    setRefeicoes((prev) =>
      prev.map((refeicao) =>
        refeicao.id === refeicaoId
          ? { ...refeicao, itens: [] }
          : refeicao
      )
    );
  }

  function limparTudo() {
    const base = buildInitialMeals(usuarioId);
    setRefeicoes(base);
    setRefeicaoAtivaId(base[0]?.id ?? null);
  }

  const jsonGerado = useMemo(() => {
    const estrutura = {
      [usuarioId]: {
        refeicoes: refeicoesCalculadas.map((refeicao) => ({
          id: refeicao.id,
          nome: refeicao.nome,
          imagem: refeicao.imagem,
          grupos: (refeicao.grupos || []).map((grupo) => ({
            categoria: grupo.categoria,
            porcoes: refeicao.porcoesPorGrupo?.[grupo.categoria] || 0,
          })),
        })),
      },
    };

    return JSON.stringify(estrutura, null, 2);
  }, [usuarioId, refeicoesCalculadas]);

  function copiarJson() {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(jsonGerado);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = jsonGerado;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  return (
    <div className="min-h-screen bg-[#EEE9F2] px-6 py-6">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <HeaderPlanejador onGerarJson={copiarJson} onLimpar={limparTudo} />

        <ResumoMetas
          usuarios={usuarios}
          usuarioId={usuarioId}
          onUsuarioChange={trocarUsuario}
          usuario={usuarioSelecionado}
          totais={totaisDiaArredondados}
          diferenca={diferenca}
        />

        <div className="grid grid-cols-[340px_1fr_360px] gap-6 items-start">
          <ListaAlimentos
            alimentos={alimentosFiltrados}
            busca={busca}
            onBuscaChange={setBusca}
            filtro={filtro}
            onFiltroChange={setFiltro}
            onAdicionarAlimento={adicionarAlimentoNaRefeicao}
            nomeRefeicaoAtiva={nomeRefeicaoAtiva}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[14px] font-semibold uppercase tracking-wide text-[#EF5170]">
                  Refeições do dia
                </h2>
                <p className="mt-1 text-[12px] text-[#0D1164]/60">
                  Selecione uma refeição, adicione alimentos e ajuste as porções.
                </p>
              </div>

              <div className="rounded-full bg-[#FFF3F6] px-3 py-1.5 text-[12px] font-medium text-[#EF5170]">
                {nomeRefeicaoAtiva || 'Nenhuma refeição ativa'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {refeicoesCalculadas.map((refeicao) => (
                <CardRefeicaoEditor
                  key={refeicao.id}
                  refeicao={refeicao}
                  isActive={refeicao.id === refeicaoAtivaId}
                  onSelecionar={setRefeicaoAtivaId}
                  onAumentarPorcao={aumentarPorcao}
                  onDiminuirPorcao={diminuirPorcao}
                  onRemoverItem={removerItem}
                  onLimparRefeicao={limparItensDaRefeicao}
                />
              ))}
            </div>
          </div>

          <ResumoLateral
            totais={totaisDiaArredondados}
            metas={
              usuarioSelecionado?.metas || {
                kcal: 0,
                carboidratosG: 0,
                proteinasG: 0,
                gordurasG: 0,
              }
            }
            grupoTotais={grupoTotais}
            grupoMetas={grupoMetas}
            jsonGerado={jsonGerado}
            onCopiarJson={copiarJson}
          />
        </div>
      </div>
    </div>
  );
}