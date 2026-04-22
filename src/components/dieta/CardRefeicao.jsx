import { motion, AnimatePresence } from 'framer-motion';
import { useAccordion } from '../../hooks/useAccordion';
import { GrupoAlimentar } from './GrupoAlimentar';

export function CardRefeicao({ refeicao }) {
  const { isOpen, toggle } = useAccordion(refeicao.nome === 'Café da Manhã');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="overflow-hidden rounded-[2px] bg-[#EF5170]"
    >
      <button
        type="button"
        onClick={toggle}
        className="w-full grid grid-cols-[auto_1fr] items-center gap-3.5 px-4 py-4 text-left"
      >
        {refeicao.imagem ? (
          <img
            src={refeicao.imagem}
            alt={refeicao.nome}
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#E6E6E6]" />
        )}
        <span className="text-white text-[16px] font-semibold leading-none">
          {refeicao.nome}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pt-3 pb-3">
              <div className="w-full border-t border-white/30 mt-2 mb-1" />

              <div className="grid grid-cols-[1fr_70px_24px] items-center px-1 mb-1">
                <span className="text-white text-[13px] font-medium">Categoria</span>
                <span className="text-white text-[13px] font-medium text-center">
                  Porção
                </span>
                <span />
              </div>

              <div className="w-full border-t border-[#FFA1B3]/30 mb-2" />

              <div className="space-y-0.5">
                {refeicao.grupos.map((grupo, index) => (
                  <GrupoAlimentar key={index} grupo={grupo} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}