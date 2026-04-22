import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MetaDiaria } from '../components/dieta/MetaDiaria';
import { ListaRefeicoes } from '../components/dieta/ListaRefeicoes';
import usuarios from '../data/usuarios.json';
import dietas from '../data/dietas.json';

export function Usuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const usuario = usuarios.find((u) => u.id === parseInt(id));
  const dieta = dietas[id];

  if (!usuario || !dieta) {
    return (
      <div className="min-h-screen bg-[#EEE9F2] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-[#0D1164] text-xl font-semibold mb-4">
            Usuário não encontrado
          </h2>
          <button
            onClick={() => navigate('/')}
            className="bg-[#EF5170] text-white px-5 py-2 rounded-xl text-sm font-medium"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEE9F2]">
      <div className="max-w-[320px] mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22 }}
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <h1 className="text-[#EF5170] text-[24px] font-semibold leading-none">
                Olá, {usuario.nome}
              </h1>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-12 h-12 rounded-full bg-[#D9D9D9] flex items-center justify-center overflow-hidden"
            >
              {usuario.fotoPerfil ? (
                <img
                  src={usuario.fotoPerfil}
                  alt={usuario.nome}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-[#EF5170] text-[22px] font-semibold leading-none">
                  {usuario.iniciais}
                </span>
              )}
            </button>
          </div>

          <MetaDiaria meta={usuario.metas} />

          <section className="mt-4">
            <h2 className="text-[#0D1164] text-[13px] font-medium mb-2">
              Refeições
            </h2>
            <ListaRefeicoes refeicoes={dieta.refeicoes} />
          </section>
        </motion.div>
      </div>
    </div>
  );
}