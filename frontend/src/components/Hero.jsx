export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-dark to-gray-800 text-white py-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold font-anime mb-6">
            Premium <span className="text-primary">Anime</span> Merchandise
          </h1>
          <p className="text-xl mb-8">
            Find your favorite characters and show your otaku pride with our exclusive collection
          </p>
          <button className="bg-primary hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full transition">
            Shop Now
          </button>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img 
            src="https://cdn.pixabay.com/photo/2019/02/22/12/01/sit-4013410_1280.jpg" 
            alt="Anime Figure" 
            className="rounded-lg shadow-2xl max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  )
}