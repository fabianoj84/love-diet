import { motion } from 'framer-motion';

function SecaoOrientacao({ titulo, itens = [] }) {
  if (!itens.length) return null;

  return (
    <div>
      <h3 className="text-white text-[14px] font-semibold mb-2">
        {titulo}
      </h3>

      <div className="rounded-lg bg-[#FFD8DF] px-3 py-3">
        <div className="flex flex-wrap gap-2">
          {itens.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center rounded-full bg-white/70 px-2.5 py-1 text-[12px] font-medium text-[#0D1164]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecaoObservacoes({ itens = [] }) {
  if (!itens.length) return null;

  return (
    <div>
      <h3 className="text-white text-[14px] font-semibold mb-2">
        Observações
      </h3>

      <div className="rounded-lg bg-[#FFD8DF] px-3 py-3 space-y-2">
        {itens.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="grid grid-cols-[auto_1fr] gap-2 items-start"
          >
            <div className="w-2 h-2 rounded-full bg-[#EF5170] mt-1.5" />
            <p className="text-[13px] leading-relaxed text-[#0D1164]">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OrientacoesDieta({ orientacoes }) {
  if (!orientacoes) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-6"
    >
      <h2 className="text-[#0D1164] text-[15px] font-medium mb-3">
        Orientações
      </h2>

      <div className="rounded-xl bg-[#EF5170] p-4 space-y-4 shadow-sm">
        <SecaoOrientacao
          titulo="Vegetais liberados"
          itens={orientacoes.vegetaisLiberados}
        />

        <SecaoOrientacao
          titulo="Bebidas / outros"
          itens={orientacoes.bebidasOutros}
        />

        <SecaoOrientacao
          titulo="Consumo moderado"
          itens={orientacoes.consumoModerado}
        />

        <SecaoObservacoes itens={orientacoes.observacoes} />
      </div>
    </motion.section>
  );
}