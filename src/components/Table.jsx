import React, { useContext } from 'react';

import { Context } from '../context/Context';
import { IoMdAddCircleOutline } from 'react-icons/io';
import toast from 'react-hot-toast';

const Table = () => {
  const {
    stockData,
    fav,
    setFav,
    isClickedFav,
    setPriceLevel,
    priceLevel,
    setIsAlert,
    saveToDatabase,
  } = useContext(Context);

  const data = isClickedFav ? fav : stockData;
  const tableText = isClickedFav ? 'Add Alert' : 'Add Fav';

  const handleClick = (item) => {
    if (isClickedFav) {
      if (Number(priceLevel) > 0) {
        const pos = fav.findIndex(
          (element) => element.identifier === item.identifier
        );
        const newFav = [...fav];
        newFav[pos].alertPrice = priceLevel;
        newFav[pos].check = priceLevel > item.lastPrice ? 'greater' : 'less';
        setFav(newFav);
        setIsAlert(true);

        toast.success(
          `${priceLevel} price alerts added successfully for ${item.identifier}`
        );
      }
    } else {
      setFav([...fav, { ...item, alertPrice: null }]);
      saveToDatabase(item);
      toast.success(`${item.identifier} successfully added`);
    }
  };

  return (
    <div className="overflow-auto rounded-lg">
      {isClickedFav && (
        <div className="flex items-center justify-center space-x-2">
          <p>Set alert price :</p>
          <input
            type="number"
            className="px-5 py-2 outline-none focus:bg-slate-100 rounded-lg"
            onChange={(e) => setPriceLevel(e.target.value)}
          />
        </div>
      )}
      <table className="mt-3 w-full">
        <thead>
          <tr>
            {['Index', 'Last', 'High', 'Low', 'Change', 'Time', tableText].map(
              (item, idx) => (
                <th
                  className={`${
                    idx === 6 ? 'w-auto' : 'w-[10rem]'
                  } p-3 text-sm font-semibold  text-left`}
                  key={idx}
                >
                  {item}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data?.map((item, idx) => (
            <tr
              key={idx}
              className="bg-white hover:bg-gray-500 hover:text-white duration-100"
            >
              <td className="p-2">{item.identifier}</td>
              <td>{item.lastPrice}</td>
              <td>{item.dayHigh}</td>
              <td>{item.dayLow}</td>
              <td
                className={`${
                  item.pChange >= 0 ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {item.pChange}%
              </td>
              <td>{item.lastUpdateTime}</td>
              <td className="text-left">
                <IoMdAddCircleOutline
                  className="text-2xl cursor-pointer"
                  onClick={() => handleClick(item)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
