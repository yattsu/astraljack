import { Card } from "./Card"

export function CardSpread({ cardHand, smallCards = false, hiddenCards = false, dealerCards = false }) {
  return (
    <div className={`${smallCards ? 'grid-cols-12' : 'grid-cols-6'} grid grid-flow-col`}>
      {cardHand.map(card => (
          <Card key={`${card.value}-${card.suit}`} suit={card.suit} value={card.value} smallCards={smallCards} hiddenCards={hiddenCards} dealerCards={dealerCards} />
      ))}
    </div>
  )
}
