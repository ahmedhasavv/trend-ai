
import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Stay on Trend</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Subscribe to our newsletter to receive the latest AI trends and prompts directly in your inbox.
            </p>
          </div>
          <div className="flex items-center">
            {subscribed ? (
              <p className="text-green-500">Thanks for subscribing!</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex w-full max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-semibold rounded-r-md hover:opacity-90 transition-opacity"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} TrendAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
