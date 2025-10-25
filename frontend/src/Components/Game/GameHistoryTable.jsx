import React, { useState, useEffect } from "react";
import { gameAPI } from "../../utils/api";

// Components for rendering
const ResultImage = ({ path }) => (
  <img src={path} alt="ball" className="w-10 h-10 mx-auto" />
);

const ResultColorDots = ({ colors }) => (
  <div className="flex justify-center gap-1">
    {colors.map((color, index) => (
      <span
        key={index}
        className={`w-3 h-3 rounded-full ${
          color === "red"
            ? "bg-red-600"
            : color === "green"
            ? "bg-green-600"
            : "bg-violet-600"
        }`}
      />
    ))}
  </div>
);

const GameHistoryTable = ({ gameType = null, limit = 7 }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasMore: false
  });

  const fetchHistory = async (offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await gameAPI.getGameHistory(gameType, limit, offset);
      
      if (response.success) {
        const formattedData = response.data.data.map(item => item.formatted);
        setHistoryData(formattedData);
        setPagination({
          currentPage: Math.floor(offset / limit) + 1,
          totalPages: Math.ceil(response.data.pagination.total / limit),
          hasMore: response.data.pagination.has_more
        });
      } else {
        setError(response.data.message || 'Failed to fetch game history');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Game history fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(0);
  }, [gameType, limit]);

  const handlePageChange = (newPage) => {
    const offset = (newPage - 1) * limit;
    fetchHistory(offset);
  };
  return (
    <div className="text-gray-300 text-sm">
      {/* Header */}
      <div className="flex py-4 px-3 bg-gray-800 font-semibold">
        <div className="flex-none basis-10/24">Period</div>
        <div className="flex-none basis-5/24 text-center">Number</div>
        <div className="flex-none basis-5/24 text-center">Big Small</div>
        <div className="flex-none basis-4/24 text-center">Color</div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-500 p-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          <p className="mt-2">Loading game history...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-red-400 p-8">
          <p className="font-semibold">Error loading history</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => fetchHistory(0)}
            className="mt-2 text-xs bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Body */}
      {!loading && !error && historyData.length === 0 && (
        <div className="text-center text-gray-500 p-8">No history yet.</div>
      )}
      
      {!loading && !error && historyData.map((item, index) => (
        <div
          key={`${item.period}-${index}`}
          className="flex items-center py-3 px-3 border-b border-gray-700 last:border-b-0"
        >
          <div className="flex-none basis-10/24 font-medium">{item.period}</div>
          <div className="flex-none basis-5/24 flex justify-center">
            <ResultImage path={item.number} />
          </div>
          <div className="flex-none basis-5/24 text-center font-medium">
            {item.bs}
          </div>
          <div className="flex-none basis-4/24 text-center">
            <ResultColorDots colors={item.colors} />
          </div>
        </div>
      ))}

      {/* Footer */}
      {!loading && !error && (
        <div className="flex justify-between items-center p-3 text-gray-500 border-t border-gray-700">
          <button 
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
            className={`${pagination.currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-white'}`}
          >
            {"<"}
          </button>
          <span>{pagination.currentPage}/{pagination.totalPages}</span>
          <button 
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasMore}
            className={`${!pagination.hasMore ? 'opacity-50 cursor-not-allowed' : 'hover:text-white'}`}
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
};

export default GameHistoryTable;
