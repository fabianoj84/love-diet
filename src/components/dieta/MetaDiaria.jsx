import { motion } from 'framer-motion';

export function MetaDiaria({ meta }) {
  if (!meta) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-[#EF5170] rounded-[2px] px-3 py-4"
    >
      <h2 className="text-white text-[11px] font-medium leading-none mb-2">
        Meta Diária
      </h2>

      <div className="text-white text-[18px] leading-none mb-4">
        <span className="font-medium">{meta?.kcal ?? 0}</span>{' '}
        <span className="text-[15px]">Kcal</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-white">
        <div>
          <p className="text-[8px] leading-none opacity-95 mb-1">Carboidratos</p>
          <p className="text-[9px] leading-none font-medium">{meta?.carboidratosG ?? 0}g</p>
        </div>
        <div>
          <p className="text-[8px] leading-none opacity-95 mb-1">Proteína</p>
          <p className="text-[9px] leading-none font-medium">{meta?.proteinasG ?? 0}g</p>
        </div>
        <div>
          <p className="text-[8px] leading-none opacity-95 mb-1">Gordura</p>
          <p className="text-[9px] leading-none font-medium">{meta?.gordurasG ?? 0}g</p>
        </div>
      </div>
    </motion.div>
  );
}
