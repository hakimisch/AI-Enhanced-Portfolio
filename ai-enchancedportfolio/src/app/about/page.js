import Navbar from 'components/Navbar';

export default function About() {
    return (
      <div>
        <Navbar />
        <div className="p-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4">About Me</h2>
        <p className="text-gray-700 leading-relaxed">
          Hi, I’m an independent artist passionate about bringing imagination to life through visual storytelling.
          This platform showcases selected works from me and other talented creators.
        </p>
      </div>
      </div>
    )
  }