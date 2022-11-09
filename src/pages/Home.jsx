import React, { useContext, useEffect } from 'react';
import { Context } from '../context/Context';
import Navbar from '../components/Navbar';
import toast, { Toaster } from 'react-hot-toast';
import Table from '../components/Table';

const Home = () => {
  const { historyData, fav, isClickedFav, setIsClickedFav, isAlert } =
    useContext(Context);

  // UseEffect Section

  useEffect(() => {
    if (isAlert) {
      fav.forEach((item) => {
        if (item.alertPrice) {
          if (item.check === 'greater') {
            if (item.lastPrice >= item.alertPrice)
              toast(
                `${item.identifier} Price range has reached the level you set ${item.alertPrice}`,
                {
                  icon: '⚠️',
                }
              );
          } else {
            if (item.lastPrice <= item.alertPrice)
              toast(
                `${item.identifier} Price range has reached the level you set ${item.alertPrice}`,
                {
                  icon: '⚠️',
                }
              );
          }
        }
      });
    }
  }, [isAlert, fav]);

  return (
    <>
      <Navbar />
      <Toaster />
      <div className="bg-slate-200 lg:max-w-screen-lg lg:mx-auto mx-4 mt-10 p-5 rounded-lg">
        <div
          className={`bg-white p-3 w-full justify-between ${
            historyData.length === 0 ? 'hidden' : 'flex'
          }`}
        >
          <p className="capitalize">recent searches : </p>
          <div className="flex space-x-3">
            {historyData.map((item, idx) => (
              <p className="hover:underline cursor-pointer" key={idx}>
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center my-3">
          <p className="text-sm text-gray-500 mt-5">
            Last updated{' '}
            <span className="text-gray-800 font-semibold">Now</span>
          </p>
          <button
            className={`bg-blue-500 px-5 py-2 rounded-lg hover:bg-blue-300 duration-300 ${
              fav.length === 0 && 'cursor-not-allowed bg-blue-300'
            }`}
            onClick={() => setIsClickedFav(!isClickedFav)}
            disabled={fav.length === 0 ? true : false}
          >
            {isClickedFav ? 'Close Favorites' : 'Show Favorites'}
          </button>
        </div>

        <Table />
      </div>
    </>
  );
};
export default Home;
