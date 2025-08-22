export default function StatsSection({ isMounted }: { isMounted: boolean }) {
  return (
    <section
      className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20 transition-all duration-700 delay-600 ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {[
        { title: "10,000+", subtitle: "Happy Customers" },
        { title: "500+", subtitle: "Premium Products" },
        { title: "24/7", subtitle: "Customer Support" },
        { title: "30+", subtitle: "Award Wins" },
      ].map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 text-center shadow-lg dark:shadow-black/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {stat.title}
          </h4>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            {stat.subtitle}
          </p>
        </div>
      ))}
    </section>
  );
}
