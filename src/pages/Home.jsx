import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import usuarios from '../data/usuarios.json';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D1164] flex items-center justify-center px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-[260px] min-h-[620px] flex flex-col"
      >
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-4">
            {usuarios.map((usuario) => {
              const isFirst = usuario.id === 1;

              return (
                <motion.button
                  key={usuario.id}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => navigate(`/usuario/${usuario.id}`)}
                  className={`w-full h-11 rounded-none text-white text-sm font-semibold tracking-[0.01em] shadow-sm ${
                    isFirst
                      ? 'bg-[#EF5170]'
                      : 'bg-gradient-to-r from-[#B13BFF] to-[#8C34F2]'
                  }`}
                >
                  {usuario.nome}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="pb-6 text-center">
          <button className="text-[10px] text-white/70 hover:text-white transition-colors">
            Configuração
          </button>
          <div className="mt-1 text-[8px] text-white/40">Made with ♥ por Fabiano</div>
        </div>
      </motion.div>
    </div>
  );
}