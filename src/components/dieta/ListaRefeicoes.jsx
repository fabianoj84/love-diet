import { CardRefeicao } from './CardRefeicao';

export function ListaRefeicoes({ refeicoes }) {
  return (
    <div className="space-y-4">
      {refeicoes.map((refeicao, index) => (
        <CardRefeicao key={index} refeicao={refeicao} />
      ))}
    </div>
  );
}