"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface NewsletterSectionProps {
  isMounted: boolean;
}

export default function NewsletterSection({
  isMounted,
}: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionState, setSubscriptionState] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous states
    setSubscriptionState("idle");
    setErrorMessage("");

    // Validate email
    if (!email.trim()) {
      setErrorMessage("Please enter your email address");
      setSubscriptionState("error");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      setSubscriptionState("error");
      return;
    }

    // Simulate API call
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate random success/failure for demo purposes
      const isSuccess = Math.random() > 0.2; // 80% success rate

      if (isSuccess) {
        setSubscriptionState("success");
        setEmail("");
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
        setSubscriptionState("error");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again." + error);
      setSubscriptionState("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className={`py-16 px-4 transition-all duration-700 delay-700 ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-12 shadow-2xl overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 mb-6">
              <Mail className="h-8 w-8 text-white" />
            </div>

            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Subscribe to Our Newsletter
            </h3>

            <p className="text-gray-300 mb-6 md:mb-8 text-base md:text-lg max-w-2xl mx-auto">
              Stay updated with our latest offers, product releases, and
              exclusive content. Join our community of subscribers today!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-xl mx-auto">
                <div className="flex-grow relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-5 md:px-6 py-3 md:py-4 rounded-full bg-gray-700/80 dark:bg-gray-800/80 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base transition-all"
                    disabled={isLoading}
                  />
                  {subscriptionState === "error" && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl text-base disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>

              {/* Status messages */}
              {subscriptionState === "success" && (
                <div className="mt-4 p-3 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center max-w-md mx-auto">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>
                    Thank you for subscribing! Check your email for
                    confirmation.
                  </span>
                </div>
              )}

              {subscriptionState === "error" && errorMessage && (
                <div className="mt-4 p-3 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center max-w-md mx-auto">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-4 max-w-md mx-auto">
                By subscribing, you agree to our Privacy Policy and consent to
                receive updates.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
