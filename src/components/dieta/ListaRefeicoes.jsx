import { CardRefeicao } from './CardRefeicao';

export function ListaRefeicoes({ refeicoes }) {
  return (
    <div className="space-y-3">
      {refeicoes.map((refeicao, index) => (
        <CardRefeicao key={index} refeicao={refeicao} />
      ))}
    </div>
  );
}