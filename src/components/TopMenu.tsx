import { FaCoins } from 'react-icons/fa'

export function TopMenu() {
  return (
    <nav className='fixed flex flex-row items-center justify-between top-0 text-xl w-full py-4 px-8'>
      {/* LOGO */}
      <div>LOGO</div>

      {/* CREDITS */}
      <div className="flex items-center gap-2 text-green-400"><FaCoins className='text-green-400' /> 80,000</div>
    </nav>
  )
}