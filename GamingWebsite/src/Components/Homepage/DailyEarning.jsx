import React from 'react';

const earningsData = [
  { rank: 2, name: "RP_***HIT", amount: "38,349,477.60", avatar: "/winningimgs/Avatar2.webp", crown: "/winningimgs/crown2.webp", place: "/winningimgs/place2.webp" },
  { rank: 1, name: "KUN***ND", amount: "107,306,080.00", avatar: "/winningimgs/Avatar1.jpg", crown: "/winningimgs/crown1.webp", place: "/winningimgs/place1.webp" },
  { rank: 3, name: "ARJ***0CR", amount: "21,560,000.00", avatar: "/winningimgs/Avatar3.webp", crown: "/winningimgs/crown3.webp", place: "/winningimgs/place3.webp" },
  { rank: 4, name: "Lx *** ", amount: "8,863,806.00", avatar: "/winningimgs/four.webp" },
  { rank: 5, name: "Pre***dhu", amount: "4,648,728.73", avatar: "/winningimgs/five.webp" },
  { rank: 6, name: "Mem***NLK", amount: "3,528,000.00", avatar: "/winningimgs/six.jpg" },
  { rank: 6, name: "Par***NLK", amount: "3,528,000.00", avatar: "/winningimgs/six.jpg" },
  { rank: 7, name: "Jawe***VWC", amount: "2,498,892.20", avatar: "/winningimgs/seven.webp" },
  { rank: 8, name: "Mem***WST", amount: "2,404,763.20", avatar: "/winningimgs/eight.jpg" },
  { rank: 9, name: "Tah***nu", amount: "1,984,049.25", avatar: "/winningimgs/10.webp" },
  { rank: 10, name: "Sat***6OQ", amount: "1,971,760.00", avatar: "/winningimgs/nine.webp" },
];

// Convert INR string to USD
const convertToUSD = (inr) => {
  const inrNumber = parseFloat(inr.replace(/,/g, ""));
  const usd = (inrNumber / 83).toFixed(2);
  return usd;
};

const DailyEarnings = () => {
  const topThree = earningsData.slice(0, 3).sort((a, b) => {
    const order = { 2: 1, 1: 2, 3: 3 };
    return order[a.rank] - order[b.rank];
  });
  
  const rest = earningsData.slice(3);

  const getPodiumStyles = (rank) => {
    if (rank === 1) {
      return {
        podium: 'bg-[#ffc93c] h-40 rounded-t-lg hover:scale-105 hover:shadow-xl transition-transform duration-300',
        avatarContainer: 'absolute -top-12',
        name: 'text-gray-800',
        amount: 'bg-yellow-300/70 text-yellow-900'
      };
    }
    if (rank === 2) {
      return {
        podium: 'bg-slate-300 h-32 rounded-t-lg hover:scale-105 hover:shadow-lg transition-transform duration-300',
        avatarContainer: 'absolute -top-12',
        name: 'text-gray-700',
        amount: 'bg-slate-200/70 text-slate-800'
      };
    }
    if (rank === 3) {
      return {
        podium: 'bg-[#d9a477] h-32 rounded-t-lg hover:scale-105 hover:shadow-lg transition-transform duration-300',
        avatarContainer: 'absolute -top-12',
        name: 'text-gray-800',
        amount: 'bg-orange-300/70 text-orange-900'
      };
    }
    return {};
  };

  return (
    <div className="w-full max-w-[480px] bg-[#2c2c2e] p-4 px-3 rounded-lg shadow-lg mt-4">
      <h1 className="text-xl font-bold text-yellow-400 mb-20 text-left ">
        Today's earnings chart
      </h1>

      {/* Top 3 Podium Section */}
      <div className="flex items-end justify-center gap-1 text-center">
        {topThree.map((user) => {
          const styles = getPodiumStyles(user.rank);
          const usdAmount = convertToUSD(user.amount);
          return (
            <div key={user.rank} className="w-1/3 flex flex-col items-center">
              <div className={`relative w-full ${styles.podium}`}>
                <div className={`w-24 h-24 ${styles.avatarContainer} left-1/2 -translate-x-1/2`}>
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover border-4 border-gray-800"
                    />
                    {user.crown && (
                      <img
                        src={user.crown}
                        alt={`Crown ${user.rank}`}
                        className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-10"
                      />
                    )}
                    {user.place && (
                      <img
                        src={user.place}
                        alt={`Place ${user.rank}`}
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-8"
                      />
                    )}
                  </div>
                </div>

                <div className="absolute bottom-4 left-0 right-0 px-1">
                  <span className={`block font-bold truncate ${styles.name}`}>{user.name}</span>
                  <div className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-bold ${styles.amount}`}>
                    ${usdAmount}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Remaining List */}
      <div className="space-y-2 mt-4">
        {rest.map((user) => {
          const usdAmount = convertToUSD(user.amount);
          return (
            <div key={user.rank} className="flex items-center bg-[#3f3f3f] p-2 rounded-lg hover:scale-105 hover:shadow-lg transition-transform duration-300">
              <span className="w-8 text-center text-lg font-bold text-gray-400">{user.rank}</span>
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mx-2" />
              <span className="flex-grow text-white font-semibold">{user.name}</span>
              <span className="text-black py-2 px-9 rounded-4xl bg-gradient-to-r from-[#f2dd9b] to-[#dbb768]  font-bold">${usdAmount}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyEarnings;
