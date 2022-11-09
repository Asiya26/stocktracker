import React, { useContext, useRef } from 'react';
import { Context } from '../context/Context';

const Navbar = () => {
  const inputRef = useRef();
  const { fetchData } = useContext(Context);

  const handleEnter = (e) => {
    if (e.code === 'Enter') {
      fetchData(inputRef.current.value);
    }
  };

  return (
    <div className="bg-slate-500 w-full">
      <div className="max-w-screen-lg mx-auto h-full flex sm:flex-row flex-col items-center justify-between py-3">
        <p className="text-2xl text-white">Stock Market App</p>

        <input
          placeholder="Enter Something"
          className="w-[20rem] px-5 py-2 rounded focus:outline-none focus:bg-slate-100 focus:shadow-lg my-3 sm:my-0"
          ref={inputRef}
          onKeyUp={handleEnter}
        />
      </div>
    </div>
  );
};

export default Navbar;
