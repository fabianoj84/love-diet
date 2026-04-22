export function ItemAlimento({ alimento }) {
  return (
    <div className="bg-[#FFD8DF] rounded-[2px] px-2 py-2">
      <div className="grid grid-cols-[auto_1fr_auto] items-start gap-2">
        {alimento.imagem ? (
          <img
            src={alimento.imagem}
            alt={alimento.nome}
            className="w-6 h-6 rounded-full object-cover mt-0.5"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-black mt-0.5" />
        )}

        <div className="min-w-0">
          <p className="text-[#0D1164] text-[11px] font-medium leading-tight">
            {alimento.nome}
          </p>

          {alimento.descricao && (
            <p className="text-[#EF5170] text-[8px] leading-tight mt-1">
              {alimento.descricao}
            </p>
          )}
        </div>

        <span className="text-[#0D1164] text-[11px] font-medium leading-none pt-0.5 whitespace-nowrap">
          {alimento.porcao}
        </span>
      </div>

      <div className="h-px bg-[#FFA1B3] mt-2 mb-1.5" />

      <div className="grid grid-cols-3 gap-2 text-[#EF5170]">
        <div>
          <p className="text-[7px] leading-none mb-0.5">Carboidratos</p>
          <p className="text-[7px] leading-none">{alimento.carboidratosG}g</p>
        </div>
        <div>
          <p className="text-[7px] leading-none mb-0.5">Proteína</p>
          <p className="text-[7px] leading-none">{alimento.proteinasG}g</p>
        </div>
        <div>
          <p className="text-[7px] leading-none mb-0.5">Gordura</p>
          <p className="text-[7px] leading-none">{alimento.gordurasG}g</p>
        </div>
      </div>
    </div>
  );
}