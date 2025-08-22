export default function NewsletterSection({
  isMounted,
}: {
  isMounted: boolean;
}) {
  return (
    <section
      className={`mb-16 transition-all duration-700 delay-700 ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-12 shadow-2xl">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-gray-300 mb-6 md:mb-8 text-base md:text-lg">
            Stay updated with our latest offers and product releases
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-5 md:px-6 py-3 md:py-4 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
            />
            <button className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl text-base">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
