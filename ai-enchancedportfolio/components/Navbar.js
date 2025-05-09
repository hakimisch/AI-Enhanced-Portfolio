import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">🎨 Artfolio</h1>
      <div className="space-x-4">
        <Link href="/" className="text-gray-700 hover:text-blue-500">Home</Link>
        <Link href="/about" className="text-gray-700 hover:text-blue-500">About</Link>
        <Link href="/contact" className="text-gray-700 hover:text-blue-500">Contact</Link>
        {/* Add more links like Shop or Admin later */}
      </div>
    </nav>
  )
}