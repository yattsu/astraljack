import "react-toastify/ReactToastify.css";

import { Flip, ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";

import { Card } from "./components/Card";
import { CardSpread } from "./components/CardSpread";
import { FaRedoAlt } from "react-icons/fa";
import { FormatValue } from "./components/FormatValue";
import { TopMenu } from "./components/TopMenu";
import { motion } from "framer-motion";

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

function getDeck(): any {
  const cardValues: Array<string> = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];
  const cardSuits: Array<string> = ["clubs", "diamonds", "hearts", "spades"];
  const deck: Array<Object> = [];

  cardSuits.map((suit) => {
    cardValues.map((value) => {
      deck.push({ suit, value });
    });
  });

  return deck;
}

type ButtonProps = {
  text: string;
  action: Function;
  disabled: boolean;
};

type BetButtonProps = {
  value: number;
  action: Function;
  disabled: boolean;
};

const betButtons = [50, 100, 300, 500, 800, 1000, 10000, 25000];

function BetButton({ value, action, disabled }: BetButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => action()}
      className={classNames(
        disabled
          ? "opacity-30 pointer-events-none border-slate-700 text-slate-600"
          : "hover:border-slate-400 hover:text-slate-300",
        value <= 50 ? "border-slate-400 text-slate-300" : "",
        value >= 100 ? "border-green-400 text-green-300" : "",
        value >= 300 ? "border-orange-400 text-orange-300" : "",
        value >= 500 ? "border-red-400 text-red-300" : "",
        value >= 1000 ? "border-red-400 text-red-300" : "",
        value >= 10000 ? "border-purple-400 text-purple-300" : "",
        "border rounded-full px-8 py-4 font-semibold focus:outline-none"
      )}
    >
      <FormatValue value={value} />
    </button>
  );
}

function Button({ text, action, disabled }: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => action()}
      className={classNames(
        disabled
          ? "pointer-events-none border-slate-700 text-slate-600"
          : "hover:border-slate-400 hover:text-slate-300",
        text === "HIT" ? "border-blue-400 text-blue-300" : "",
        text === "STAND" ? "border-red-400 text-red-300" : "",
        "border rounded-md px-8 py-4 font-semibold focus:outline-none"
      )}
    >
      {text}
    </button>
  );
}

function App() {
  const [deck, setDeck] = useState([]);
  const [credits, setCredits] = useState(
    localStorage.getItem("credits") || null
  );
  const [currentBet, setCurrentBet] = useState(0);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [firstHit, setFirstHit] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);

  useEffect(() => {
    setDeck(getDeck());

    if (!localStorage.getItem("credits")) {
      setCredits(1000);
    } else {
      setCredits(localStorage.getItem("credits"));
    }
  }, []);

  useEffect(() => {
    if (credits !== null) {
      localStorage.setItem("credits", credits);
    }
  }, [credits]);

  useEffect(() => {
    if (playerHand.length === 0) return;
    if (firstHit) {
      setPlayerHand([...playerHand, drawCard()]);
      setFirstHit(false);
    }

    // CHECK PASSIVE WIN
    checkWin("passive");
  }, [playerHand]);

  function getHandValue(hand: any) {
    let total = 0;

    hand.map((card: any) => {
      if (["J", "Q", "K", "A"].includes(card.value)) {
        if (card.value === "A") {
          total += total + 11 > 21 ? 1 : 11;
        } else {
          total += 10;
        }
      } else {
        total += parseInt(card.value);
      }
    });

    return total;
  }

  function gameEnd(outcome: string) {
    setGameStatus(outcome);

    switch (outcome) {
      case "win":
        setGameEnded(true);
        toast("WIN");
        setCredits(credits + currentBet * 2);
        break;
      case "lose":
        setGameEnded(true);
        toast("LOSE");
        break;
      case "draw":
        setGameEnded(true);
        toast("DRAW");
        setCredits(credits + currentBet);
        break;
    }
  }

  function checkWin(mode: string) {
    let playerHandValue = getHandValue(playerHand);
    let dealerHandValue = getHandValue(dealerHand);

    let outcome: string = "";
    if (mode === "passive") {
      // IF PLAYER BUSTS
      if (playerHandValue > 21) {
        outcome = "lose";
      }
      if (playerHandValue === 21) {
        outcome = "win";
      }
    } else {
      if (playerHandValue > dealerHandValue) {
        outcome = "win";
      } else if (playerHandValue < dealerHandValue) {
        outcome = dealerHandValue > 21 ? "win" : "lose";
      } else {
        outcome = "draw";
      }
    }

    // GIVE CARD TO DEALER
    if (outcome === "") {
      setDealerHand([...dealerHand, drawCard()]);
    }

    gameEnd(outcome);
  }

  function resetGame() {
    setDeck(getDeck());
    setPlayerHand([]);
    setDealerHand([]);
    setFirstHit(true);
    setGameEnded(false);
    setGameStatus(null);
  }

  function drawCard() {
    let randomIdx: number = Math.floor(Math.random() * deck.length);
    const card = deck[randomIdx];

    setDeck(deck.filter((c) => c !== card));

    return card;
  }

  function handleHit() {
    if (firstHit) {
      if (currentBet === 0 || currentBet > credits) {
        toast("Make a valid bet");
        return;
      }
      setCredits((credits) => credits - currentBet);
    }

    setPlayerHand([...playerHand, drawCard()]);
  }

  function handleStand() {
    checkWin("active");
  }

  return (
    <>
      <ToastContainer
        transition={Flip}
        theme="dark"
        toastStyle={{ backgroundColor: "white", color: "#222" }}
        position="bottom-right"
      />
      <TopMenu credits={credits} />
      <main className="w-[100vw] h-[100vh] flex flex-col items-center bg-slate-900 text-slate-750">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col justify-around h-full p-8 max-w-4xl"
        >
          <motion.div
            initial={{
              opacity: firstHit ? 0 : 1,
              scale: firstHit ? 0.3 : 1,
              display: firstHit ? "none" : "block",
            }}
            animate={{
              opacity: firstHit ? 0 : 1,
              scale: firstHit ? 0.3 : 1,
              display: firstHit ? "none" : "block",
            }}
            transition={{ duration: 0.3 }}
          >
            <section>
              {/* DEALER HAND */}
              <CardSpread
                cardHand={dealerHand}
                smallCards
                hiddenCards={!gameEnded}
                dealerCards
                gameStatus={gameStatus}
              />
            </section>

            {/* SPACER */}
            <section className="flex flex-col gap-1 text-2xl">
              <span>DEALER</span>
              <div className="border-b-2 border-slate-400"></div>
              <span>YOU</span>
            </section>

            <section>
              {/* PLAYER HAND */}
              <CardSpread cardHand={playerHand} gameStatus={gameStatus} />
            </section>
          </motion.div>

          {/* ACTION MENU */}
          <section className="flex flex-col gap-8">
            <div className="flex justify-center items-center gap-8">
              <Button
                disabled={deck.length === 0 || gameEnded}
                text="HIT"
                action={handleHit}
              />
              <Button
                disabled={
                  gameEnded ? true : playerHand.length === 0 ? true : false
                }
                text="STAND"
                action={handleStand}
              />
              {gameEnded && (
                <button
                  onClick={resetGame}
                  className="bg-transparent border-none ring-0"
                >
                  <FaRedoAlt className="text-slate-300" />
                </button>
              )}
            </div>
            <div
              className={`${
                currentBet <= credits
                  ? "text-slate-300"
                  : firstHit
                  ? "text-red-300"
                  : "text-slate-300"
              } text-center text-xl`}
            >
              Current bet: <FormatValue value={currentBet} /?
            </div>
            <div className="flex justify-center items-center gap-8">
              {betButtons.map((value) => (
                <BetButton
                  key={value}
                  value={value}
                  action={() => setCurrentBet(value)}
                  disabled={value > credits || !firstHit}
                />
              ))}
            </div>
          </section>
        </motion.div>
      </main>
    </>
  );
}
export default App;
