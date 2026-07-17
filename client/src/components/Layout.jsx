import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-grow px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
