import Navbar from "components/Navbar";

export default function Contact() {
    return (
        
      <div className="p-8 max-w-xl mx-auto">
        <Navbar />
        <h2 className="text-3xl font-semibold mb-4">Contact</h2>
        <p className="text-gray-600 mb-6">
          This is a placeholder. In the future, you&apos;ll be able to contact the artist or submit inquiries here.
        </p>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border border-gray-300 rounded px-4 py-2"
            disabled
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border border-gray-300 rounded px-4 py-2"
            disabled
          />
          <textarea
            placeholder="Your Message"
            rows="5"
            className="w-full border border-gray-300 rounded px-4 py-2"
            disabled
          ></textarea>
          <button
            type="submit"
            className="bg-gray-400 text-white px-6 py-2 rounded cursor-not-allowed"
            disabled
          >
            Submit (Coming Soon)
          </button>
        </form>
      </div>
    )
  }