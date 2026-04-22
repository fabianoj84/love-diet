import { motion, AnimatePresence } from 'framer-motion';
import { useAccordion } from '../../hooks/useAccordion';
import { ItemAlimento } from './ItemAlimento';
import alimentos from '../../data/alimentos.json';

export function GrupoAlimentar({ grupo }) {
  const alimentosDoGrupo = alimentos.filter(
    (item) => item.grupo === grupo.categoria
  );
  const hasItems = alimentosDoGrupo.length > 0;
  const { isOpen, toggle } = useAccordion(grupo.categoria === 'Proteína' && hasItems);

  return (
    <div>
      <button
        type="button"
        onClick={hasItems ? toggle : undefined}
        className="w-full grid grid-cols-[1fr_70px_24px] items-center px-1 py-2 text-left"
      >
        <span className="text-white text-[15px] font-normal">{grupo.categoria}</span>
        <span className="text-white text-[15px] text-center">{grupo.porcoes}</span>
        <span className="text-white text-[15px] text-right leading-none">
          {hasItems ? (isOpen ? '−' : '+') : ''}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {hasItems && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="pt-1 pb-1 space-y-2">
              {alimentosDoGrupo.map((alimento) => (
                <ItemAlimento key={alimento.id} alimento={alimento} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}