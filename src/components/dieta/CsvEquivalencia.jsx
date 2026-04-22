import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  cn,
  parseCsv,
  generateCsv,
  parseOutputCsv,
} from '../../lib/utils';

export default function CsvEquivalencia() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('Cole um CSV e clique em calcular.');

  const previewRows = useMemo(() => parseOutputCsv(output), [output]);

  function handleCalculate() {
    try {
      const data = parseCsv(input);

      if (data.length < 2) {
        setStatus('O CSV precisa ter pelo menos 2 linhas de dados: a base e mais 1 item para comparar.');
        setOutput('');
        return;
      }

      const base = data[0];
      const result = generateCsv(base, data);

      setOutput(result);
      setStatus(
        `Base usada: ${base.alimento} (${base.base}${base.unidade}, ${base.kcal} kcal). ${data.length - 1} item(ns) calculado(s).`
      );
    } catch (err) {
      setStatus('Erro no processamento.');
      setOutput(err?.message || 'Não foi possível processar o CSV.');
    }
  }

  async function handleCopy() {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setStatus('CSV de saída copiado para a área de transferência.');
    } catch {
      setStatus('Não foi possível copiar automaticamente. Copie manualmente a saída.');
    }
  }

  function handleDownload() {
    if (!output) return;

    const blob = new Blob([output], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'equivalencias.csv';
    anchor.click();

    URL.revokeObjectURL(url);
    setStatus('CSV de saída baixado com sucesso.');
  }

  function handleClear() {
    setInput('');
    setOutput('');
    setStatus('Cole um CSV e clique em calcular.');
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  }

  function handleLoadExample() {
    setInput(`Grupo,Alimento,Descrição,Energia (kcal),Carboidratos (g),Proteína (g),Lipídios (g),Tipo
Carboidrato,Arroz cozido,"Com óleo, sem sal",138,29.2,2.41,1.6,100g
Carboidrato,Feijão carioca,Preparado,92,17.8,5.15,1.57,100g
Carboidrato,Macarrão cozido,Com ovos e óleo,180,25.8,3.64,7.05,100g`);
    setOutput('');
    setStatus('Exemplo carregado. Agora clique em calcular.');
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setInput(String(e.target?.result || ''));
      setOutput('');
      setStatus(`Arquivo "${file.name}" carregado. Agora clique em calcular.`);
    };
    reader.onerror = () => {
      setStatus('Não foi possível ler o arquivo.');
    };
    reader.readAsText(file, 'utf-8');
  }

  return (
    <div className="min-h-screen bg-[#0D1164] px-4 py-6 sm:px-6 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-auto w-full max-w-5xl"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            ← Voltar
          </button>

          <div className="text-right text-[10px] text-white/35">
            Ferramenta de equivalência CSV
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0A0E55]/90 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.28)] sm:p-6">
          <div className="mb-5">
            <h1 className="text-xl font-semibold tracking-[0.01em] text-white sm:text-2xl">
              Equivalência por CSV
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">
              Cole um CSV, TSV ou texto tabulado. A primeira linha de dados será usada
              como base de cálculo. O sistema retorna um novo CSV com as quantidades
              equivalentes e os macros recalculados.
            </p>
          </div>

          <div className="mb-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="h-11 rounded-none bg-gradient-to-r from-[#B13BFF] to-[#8C34F2] px-5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              Enviar CSV
            </button>

            <button
              type="button"
              onClick={handleLoadExample}
              className="h-11 rounded-none border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Carregar exemplo
            </button>

            <button
              type="button"
              onClick={handleCalculate}
              className="h-11 rounded-none bg-[#EF5170] px-5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              Calcular
            </button>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!output}
              className={cn(
                'h-11 rounded-none px-5 text-sm font-semibold text-white transition-colors',
                output
                  ? 'border border-white/10 bg-white/5 hover:bg-white/10'
                  : 'cursor-not-allowed border border-white/5 bg-white/5 text-white/35'
              )}
            >
              Copiar
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!output}
              className={cn(
                'h-11 rounded-none px-5 text-sm font-semibold text-white transition-colors',
                output
                  ? 'border border-white/10 bg-white/5 hover:bg-white/10'
                  : 'cursor-not-allowed border border-white/5 bg-white/5 text-white/35'
              )}
            >
              Baixar CSV
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="h-11 rounded-none border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Limpar
            </button>

            <input
              ref={fileRef}
              type="file"
              accept=".csv,.txt,.tsv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-3">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-white/60">
                  Entrada
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='Grupo,Alimento,Descrição,Energia (kcal),Carboidratos (g),Proteína (g),Lipídios (g),Tipo'
                  className="min-h-[260px] w-full rounded-none border border-white/10 bg-white/95 p-4 text-sm leading-6 text-[#10143D] outline-none transition focus:border-[#8C34F2]"
                />
              </div>

              <p className="text-xs leading-5 text-white/55">
                Formatos aceitos: CSV com vírgula, CSV com ponto e vírgula, TAB e múltiplos espaços.
                Se a descrição tiver vírgula, use aspas.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-white/60">
                  Saída CSV
                </label>
                <textarea
                  value={output}
                  readOnly
                  placeholder="O resultado aparecerá aqui"
                  className="min-h-[260px] w-full rounded-none border border-white/10 bg-[#0A0D38] p-4 text-sm leading-6 text-white/90 outline-none"
                />
              </div>

              <div className="rounded-none border border-white/10 bg-white/5 p-3">
                <p className="text-sm leading-6 text-white/80">{status}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-white/60">
              Pré-visualização
            </div>

            {previewRows.length > 0 ? (
              <div className="overflow-hidden border border-white/10">
                <div className="max-h-[360px] overflow-auto">
                  <table className="w-full border-collapse text-left text-sm text-white">
                    <thead className="sticky top-0 bg-[#14185F]">
                      <tr>
                        {Object.keys(previewRows[0]).map((key) => (
                          <th
                            key={key}
                            className="border-b border-white/10 px-4 py-3 font-semibold text-white/85"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, rowIndex) => (
                        <tr
                          key={`${row.Alimento || 'row'}-${rowIndex}`}
                          className="border-b border-white/5 bg-[#0C1050]/50"
                        >
                          {Object.values(row).map((value, valueIndex) => (
                            <td
                              key={`${rowIndex}-${valueIndex}`}
                              className="px-4 py-3 text-white/80"
                            >
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="border border-white/10 bg-white/5 p-4 text-sm text-white/50">
                Nenhuma pré-visualização ainda.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}