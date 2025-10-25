import React, { useState, useEffect } from "react";
import { gameAPI } from "../../utils/api";

const MyHistoryTable = ({ limit = 7 }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasMore: false
  });

  const fetchUserHistory = async (offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await gameAPI.getUserGameHistory(limit, offset);
      
      if (response.success) {
        const formattedData = response.data.data.map(item => ({
          id: item.id,
          type: item.type,
          date: item.period,
          result: item.result,
          amount: item.profit > 0 ? `+₹${item.profit.toFixed(2)}` : `-₹${Math.abs(item.profit).toFixed(2)}`,
          color: item.color
        }));
        
        setHistoryData(formattedData);
        setPagination({
          currentPage: Math.floor(offset / limit) + 1,
          totalPages: Math.ceil(response.data.pagination.total / limit),
          hasMore: response.data.pagination.has_more
        });
      } else {
        setError(response.data.message || 'Failed to fetch user history');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('User history fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserHistory(0);
  }, [limit]);

  const handlePageChange = (newPage) => {
    const offset = (newPage - 1) * limit;
    fetchUserHistory(offset);
  };
  return (
    <div className="min-h-screen bg-gray-900 flex justify-center py-6">
      <div className="w-full max-w-md bg-[#333332] rounded-2xl shadow-lg p-4">
       

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-500 p-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <p className="mt-2">Loading your history...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-400 p-8">
            <p className="font-semibold">Error loading history</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => fetchUserHistory(0)}
              className="mt-2 text-xs bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            <div id="scroll" className="space-y-3 overflow-y-auto max-h-[95vh] scrollbar-hide">
              {historyData.length === 0 ? (
                <div className="text-center text-gray-500 p-8">No game history yet.</div>
              ) : (
                historyData.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-[#1f1f1f]  rounded-xl p-3 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`text-sm font-semibold px-3 py-4 rounded-lg ${
                          item.type === "Big"
                            ? "bg-blue-700 text-white "
                            : "bg-green-700 text-white "
                        }`}
                      >
                        {item.type}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {item.id}
                        </p>
                        <p className="text-xs text-gray-500">{item.date}</p>
                      </div>
                    </div>

                    <div
                      className={`text-right ${
                        item.color === "success"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      <p className="text-sm font-semibold">{item.result}</p>
                      <span className="text-xs font-medium">{item.amount}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {historyData.length > 0 && (
              <div className="flex justify-between items-center mt-4 text-gray-500">
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
          </>
        )}
      </div>
    </div>
  );
};

export default MyHistoryTable;
