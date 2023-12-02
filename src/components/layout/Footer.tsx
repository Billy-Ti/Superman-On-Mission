import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // 處理訂閱邏輯
    console.log(email);
    // 清空輸入欄位
    setEmail('');
  };

  return (
    <footer className="w-full pt-20">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-col mb-4 sm:mb-0">
          <h5 className="text-lg font-bold mb-3">Subscribe our newsletter to get update.</h5>
          <form onSubmit={handleSubmit} className="flex">
            <input
              className="p-2 mr-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Subscribe
            </button>
          </form>
        </div>
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-col mr-8">
            <h5 className="font-bold mb-3">Quick Link</h5>
            <span className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Home</span>
            <span className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Who We Are</span>
            <span className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Our Philosophy</span>
          </div>
          <div className="flex flex-col">
            <h5 className="font-bold mb-3">Industries</h5>
            <span className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Retail & E-Commerce</span>
            <span className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Information Technology</span>
            <span className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Finance & Insurance</span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-300 text-center py-4 mt-4">
        <span className="text-sm text-gray-600">&copy; 2023 All Rights Reserved</span>
      </div>
    </footer>
  );
};

export default Footer;
