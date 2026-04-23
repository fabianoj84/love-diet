import { Scale, Ruler, CalendarDays } from 'lucide-react';

function BarraProgresso({ valor = 0, meta = 0, cor = '#EF5170' }) {
  const percentual = meta > 0 ? Math.min((valor / meta) * 100, 100) : 0;

  return (
    <div className="mt-2">
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1E8EC]">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${percentual}%`,
            backgroundColor: cor,
          }}
        />
      </div>
      <p className="mt-1 text-[12px] text-[#0D1164]/60">
        {Math.round(percentual)}% da meta
      </p>
    </div>
  );
}

function CardMetaCompacto({ titulo, valor, sufixo = '', corTexto = '#0D1164' }) {
  return (
    <div className="rounded-xl bg-[#F9F3F5] px-4 py-4">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-[#EF5170]">
        {titulo}
      </p>
      <p className="mt-2 text-[22px] font-semibold leading-none" style={{ color: corTexto }}>
        {valor}
        {sufixo}
      </p>
    </div>
  );
}

function CardPlanejado({ titulo, valor, sufixo = '', meta = 0, cor = '#0D1164' }) {
  const numero = typeof valor === 'number' ? valor : 0;

  return (
    <div className="rounded-xl bg-[#F9F3F5] px-4 py-4">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-[#EF5170]">
        {titulo}
      </p>

      <p className="mt-2 text-[22px] font-semibold leading-none" style={{ color: cor }}>
        {numero}
        {sufixo}
      </p>

      <BarraProgresso valor={numero} meta={meta} cor={cor} />
    </div>
  );
}

function DadoUsuario({ icon: Icon, label, valor, sufixo = '' }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5">
        <Icon className="h-4 w-4 text-[#0D1164]/60" />
      </div>

      <div>
        <p className="text-[12px] font-semibold uppercase tracking-wide text-[#EF5170]">
          {label}
        </p>
        <p className="mt-1 text-[24px] font-semibold leading-none text-[#0D1164]">
          {valor}
          {sufixo && <span className="ml-1 text-[15px]">{sufixo}</span>}
        </p>
      </div>
    </div>
  );
}

export function ResumoMetas({
  usuarios = [],
  usuarioId = 1,
  onUsuarioChange = () => {},
  usuario = null,
  totais = { kcal: 0, carb: 0, prot: 0, gord: 0 },
  diferenca = { kcal: 0, carb: 0, prot: 0, gord: 0 },
}) {
  if (!usuario) return null;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="grid grid-cols-[280px_1.1fr_1fr_0.9fr] gap-6 items-start">
        {/* USUÁRIO */}
        <div className="pr-5 border-r border-[#EEE3E8]">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#EF5170]">
            Usuário
          </p>

          <div className="relative">
            <select
              value={usuarioId}
              onChange={(e) => onUsuarioChange(Number(e.target.value))}
              className="w-full rounded-xl border border-[#D9D9D9] bg-white px-4 py-3 text-[15px] text-[#0D1164] outline-none"
            >
              {usuarios.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>

            {usuario.fotoPerfil ? (
              <img
                src={usuario.fotoPerfil}
                alt={usuario.nome}
                className="pointer-events-none absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full object-cover border border-[#F1D0D8]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
          </div>

          <div className={`mt-3 ${usuario.fotoPerfil ? 'pl-0' : ''}`} />

          <div className="mt-4 rounded-xl bg-[#FFF7F9] px-4 py-4 border border-[#F3D2DB]">
            <p className="text-[15px] font-semibold text-[#0D1164]">
              {usuario.nome}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <DadoUsuario icon={Scale} label="Peso" valor={usuario.pesoKg} sufixo="kg" />
              <DadoUsuario icon={Ruler} label="Altura" valor={usuario.alturaCm} sufixo="cm" />
              <DadoUsuario icon={CalendarDays} label="Início" valor={usuario.dataInicio} />
            </div>
          </div>
        </div>

        {/* METAS */}
        <div className="pr-5 border-r border-[#EEE3E8]">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#EF5170]">
            Metas diárias
          </p>

          <div className="grid grid-cols-4 gap-3">
            <CardMetaCompacto titulo="Kcal" valor={usuario.metas.kcal} />
            <CardMetaCompacto
              titulo="Carboidratos"
              valor={usuario.metas.carboidratosG}
              sufixo="g"
            />
            <CardMetaCompacto
              titulo="Proteínas"
              valor={usuario.metas.proteinasG}
              sufixo="g"
            />
            <CardMetaCompacto
              titulo="Gorduras"
              valor={usuario.metas.gordurasG}
              sufixo="g"
            />
          </div>
        </div>

        {/* PLANEJADO */}
        <div className="pr-5 border-r border-[#EEE3E8]">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#EF5170]">
            Planejado até agora
          </p>

          <div className="grid grid-cols-4 gap-3">
            <CardPlanejado
              titulo="Kcal"
              valor={totais.kcal}
              meta={usuario.metas.kcal}
              cor="#EF5170"
            />
            <CardPlanejado
              titulo="Carb"
              valor={totais.carb}
              sufixo="g"
              meta={usuario.metas.carboidratosG}
              cor="#58B65F"
            />
            <CardPlanejado
              titulo="Prot"
              valor={totais.prot}
              sufixo="g"
              meta={usuario.metas.proteinasG}
              cor="#4C97F2"
            />
            <CardPlanejado
              titulo="Gord"
              valor={totais.gord}
              sufixo="g"
              meta={usuario.metas.gordurasG}
              cor="#F39C37"
            />
          </div>
        </div>

        {/* DIFERENÇA */}
        <div>
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#EF5170]">
            Diferença para a meta
          </p>

          <div className="rounded-xl border border-dashed border-[#F1B8C4] bg-[#FFF9FB] px-4 py-5">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-[12px] uppercase tracking-wide text-[#0D1164]/55">Kcal</p>
                <p className="mt-2 text-[28px] font-semibold leading-none text-[#EF5170]">
                  {diferenca.kcal}
                </p>
              </div>

              <div>
                <p className="text-[12px] uppercase tracking-wide text-[#0D1164]/55">Carb</p>
                <p className="mt-2 text-[28px] font-semibold leading-none text-[#58B65F]">
                  {diferenca.carb}g
                </p>
              </div>

              <div>
                <p className="text-[12px] uppercase tracking-wide text-[#0D1164]/55">Prot</p>
                <p className="mt-2 text-[28px] font-semibold leading-none text-[#4C97F2]">
                  {diferenca.prot}g
                </p>
              </div>

              <div>
                <p className="text-[12px] uppercase tracking-wide text-[#0D1164]/55">Gord</p>
                <p className="mt-2 text-[28px] font-semibold leading-none text-[#F39C37]">
                  {diferenca.gord}g
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}