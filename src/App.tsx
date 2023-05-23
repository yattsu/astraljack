import 'react-toastify/ReactToastify.css'

import { Flip, ToastContainer, toast } from 'react-toastify'
import { useEffect, useState } from 'react'

import { CardSpread } from './components/CardSpread'
import { TopMenu } from './components/TopMenu'
import { motion } from 'framer-motion'

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

function getDeck(): any {
  const cardValues: Array<string> = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
  const cardSuits: Array<string> = ['clubs', 'diamonds', 'hearts', 'spades']
  const deck: Array<Object> = [] 

  cardSuits.map(suit => {
    cardValues.map(value => {
      deck.push({suit, value})
    })
  })

  return deck
}

type ButtonProps = {
  text: string,
  action: Function,
  disabled: boolean
}

function Button({text, action, disabled}: ButtonProps) {
  return (
    <button type='button' disabled={disabled} onClick={() => action()} className={classNames(disabled ? 'pointer-events-none border-slate-700 text-slate-600':'hover:border-slate-400 hover:text-slate-300', text === 'HIT' ? 'border-blue-400 text-blue-300' : '', text === 'STAND' ? 'border-red-400 text-red-300' : '', 'border rounded-md px-8 py-4 font-semibold focus:outline-none')}>{text}</button>
  )
}

function App() {
  const [deck, setDeck] = useState([])
  const [playerHand, setPlayerHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])
  const [firstHandDealt, setFirstHandDealt] = useState(false)

  useEffect(() => {
    setDeck(getDeck())    
    toast('test')
  }, [])

  useEffect(() => {
    if (firstHandDealt || deck.length === 0) return

    handleHit()
    setFirstHandDealt(true)
  }, [deck])

  useEffect(() => {
    if (playerHand.length === 0) return

    setDealerHand([...dealerHand, drawCard()])
    checkWin()
  }, [playerHand])

  function checkWin() {
    let playerHandValue = 0

    playerHand.map(card => {
      if (['J', 'Q', 'K', 'A'].includes(card.value)) {
        if (card.value === 'A') {
          playerHandValue += playerHandValue + 11 > 21 ? 1 : 11
        } else {
          playerHandValue += 10
        }
      } else {
        playerHandValue += parseInt(card.value)
      }
    })
    console.log(playerHandValue)

    if (playerHandValue > 21) console.log('bust')
  }

  function drawCard() {
    let randomIdx: number = Math.floor(Math.random() * deck.length)
    const card = deck[randomIdx]

    setDeck(deck.filter(c => c !== card))

    return card
  }

  function handleHit() {
    setPlayerHand([...playerHand, drawCard()])
  }

  function handleStand() {
    console.log('stand')
  }
  return (
    <>
      <ToastContainer transition={Flip} theme='dark' toastStyle={{backgroundColor: 'white', color: '#222'}} position='bottom-right' />
    <TopMenu />
    <main className="w-[100vw] h-[100vh] flex flex-col items-center bg-slate-900 text-slate-750">
      <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.2}} className='flex flex-col justify-around h-full p-8 max-w-4xl'>
      <section>
      {/* DEALER HAND */}
        <CardSpread cardHand={dealerHand} smallCards hiddenCards dealerCards />
      </section>

      {/* SPACER */}
      <section className='flex flex-col gap-1 text-2xl'><span>DEALER</span><div className='border-b-2 border-slate-400'></div><span>YOU</span></section>

      <section>
      {/* PLAYER HAND */}
        <CardSpread cardHand={playerHand} />
      </section>

      {/* ACTION MENU */}
      <section>
        <div className="flex justify-center items-center gap-8">
          <Button disabled={deck.length === 0} text='HIT' action={handleHit} />
          <Button disabled={false} text='STAND' action={handleStand} />
        </div>
      </section>
      </motion.div>
    </main>
  </>
  )
}
export default App
