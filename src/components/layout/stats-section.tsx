"use client";
import { useState, useEffect } from "react";
import { Users, Package, Headphones, Trophy } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  delay: number;
  isMounted: boolean;
}

function StatCard({ icon, title, subtitle, delay, isMounted }: StatCardProps) {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(title.replace(/[^0-9]/g, ""));
  const suffix = title.replace(/[0-9]/g, "");

  useEffect(() => {
    if (!isMounted) return;

    const duration = 2000; // Animation duration in ms
    const steps = 30;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setTimeout(() => {
      const counter = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setCount(numericValue);
          clearInterval(counter);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
    }, delay);

    return () => clearTimeout(timer);
  }, [isMounted, numericValue, delay]);

  return (
    <div
      className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl md:rounded-2xl p-5 md:p-6 text-center shadow-lg dark:shadow-black/20 border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-500 hover:-translate-y-1 group`}
    >
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors duration-300">
          {icon}
        </div>
      </div>
      <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {count}
        <span className="text-blue-600 dark:text-blue-400">{suffix}</span>
      </h4>
      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
        {subtitle}
      </p>
    </div>
  );
}

export default function StatsSection({ isMounted }: { isMounted: boolean }) {
  const stats = [
    {
      title: "10,000+",
      subtitle: "Happy Customers",
      icon: <Users className="h-6 w-6" />,
      delay: 100,
    },
    {
      title: "500+",
      subtitle: "Premium Products",
      icon: <Package className="h-6 w-6" />,
      delay: 300,
    },
    {
      title: "24/7",
      subtitle: "Customer Support",
      icon: <Headphones className="h-6 w-6" />,
      delay: 500,
    },
    {
      title: "30+",
      subtitle: "Award Wins",
      icon: <Trophy className="h-6 w-6" />,
      delay: 700,
    },
  ];

  return (
    <section
      className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20 transition-all duration-700 delay-600 ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          title={stat.title}
          subtitle={stat.subtitle}
          delay={stat.delay}
          isMounted={isMounted}
        />
      ))}
    </section>
  );
}
