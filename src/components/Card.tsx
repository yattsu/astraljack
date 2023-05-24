import { ImClubs, ImDiamonds, ImHeart, ImSpades } from "react-icons/im";

import { motion } from "framer-motion";

type Card = {
  suit: any;
  value: string;
};
export function Card({
  suit,
  value,
  smallCards,
  hiddenCards,
  dealerCards,
  gameStatus,
}: Card) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 1.1,
        rotateY: dealerCards ? -32 : 60,
        rotateZ: dealerCards ? -16 : 16,
        rotateX: dealerCards ? 16 : 0,
      }}
      animate={{ rotateY: 0, scale: 1, rotateZ: 0, rotateX: 0, opacity: 1 }}
      transition={{ delay: dealerCards ? 0.6 : 0.2, duration: 0.2 }}
      className={`${
        smallCards ? "w-[24.8mm] h-[35.2mm]" : "w-[62mm] h-[88mm]"
      } ${
        gameStatus === "win"
          ? dealerCards
            ? "border-red-400 text-red-300"
            : "border-green-400 text-green-300"
          : gameStatus === "lose"
          ? dealerCards
            ? "border-green-400 text-green-300"
            : "border-red-400 text-red-300"
          : "border-slate-400 text-slate-300"
      } flex flex-col justify-between items-center border-2 bg-slate-900/95 rounded-md`}
    >
      {!hiddenCards && (
        <>
          <span
            className={`${
              smallCards ? "text-sm px-2 py-1" : "text-5xl px-4 py-2"
            } flex justify-start w-full`}
          >
            {value}
          </span>
          <span className={smallCards ? "text-5xl" : "text-9xl"}>
            {
              {
                clubs: <ImClubs />,
                diamonds: <ImDiamonds />,
                hearts: <ImHeart />,
                spades: <ImSpades />,
              }[suit]
            }
          </span>
          <span
            className={`${
              smallCards ? "text-sm px-2 py-1" : "text-5xl px-4 py-2"
            } flex justify-end w-full`}
          >
            {value}
          </span>
        </>
      )}
    </motion.div>
  );
}
