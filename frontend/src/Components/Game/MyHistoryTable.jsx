import React from "react";

const historyData = [
  {
    id: "20251023100051924",
    type: "Small",
    date: "2025-10-23 21:31:52",
    result: "Succeed",
    amount: "+₹1.96",
    color: "success",
  },
  {
    id: "20251023100051923",
    type: "Big",
    date: "2025-10-23 21:31:16",
    result: "Failed",
    amount: "-₹1.00",
    color: "failed",
  },
  {
    id: "20251023100051873",
    type: "Small",
    date: "2025-10-23 21:06:13",
    result: "Succeed",
    amount: "+₹39.20",
    color: "success",
  },
  {
    id: "20251023100051876",
    type: "Big",
    date: "2025-10-23 21:07:48",
    result: "Failed",
    amount: "-₹50.00",
    color: "failed",
  },

  {
    id: "20251023100051876",
    type: "9",
    date: "2025-10-23 21:07:48",
    result: "Failed",
    amount: "-50.00",
    color: "failed",
  },
  {
    id: "20251023100051876",
    type: "9",
    date: "2025-10-23 21:07:48",
    result: "Failed",
    amount: "-₹60.00",
    color: "failed",
  },
];

const HistoryPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex justify-center py-6">
      <div className="w-full max-w-md bg-[#333332] rounded-2xl shadow-lg p-4">
       

        <div id="scroll" className="space-y-3 overflow-y-auto max-h-[95vh] scrollbar-hide">
          {historyData.map((item, i) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
