import { Card } from "./Card";

export function CardSpread({
  cardHand,
  smallCards = false,
  hiddenCards = false,
  dealerCards = false,
  gameStatus,
}) {
  return (
    <div
      className={`${
        smallCards ? "grid-cols-12" : "grid-cols-6"
      } grid grid-flow-col`}
    >
      {cardHand.map((card, index) => (
        <Card
          key={`${card.value}-${card.suit}`}
          suit={card.suit}
          value={card.value}
          smallCards={smallCards}
          hiddenCards={dealerCards && index === 0 ? false : hiddenCards}
          dealerCards={dealerCards}
          gameStatus={gameStatus}
        />
      ))}
    </div>
  );
}
