import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <span className="inline-block px-3 py-1 bg-[#050f36] text-white text-[10px] font-black tracking-widest rounded-full mb-3 uppercase">LOT OPERATIONS</span>
          <h1 className="text-4xl md:text-5xl font-black text-[#050f36] leading-tight flex items-center cursor-pointer group font-manrope">
            Dashboard - Jacksonville Lot
            <span className="material-symbols-outlined ml-2 transition-transform group-hover:translate-y-1">expand_more</span>
          </h1>
          <p className="text-[#45464e] font-medium mt-1">Real-time overview of your parking operations</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg flex items-center gap-2 font-bold text-xs uppercase tracking-wide">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            Live
          </div>
          <div className="bg-[#f1f4fb] px-4 py-2 rounded-lg flex items-center gap-3 border border-transparent">
            <span className="material-symbols-outlined text-[#0058be]">calendar_today</span>
            <span className="font-semibold text-sm">Today</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </div>
          <button className="bg-white hover:bg-[#e5e8ef] transition-colors px-5 py-2 rounded-lg flex items-center gap-2 font-bold text-sm shadow-sm border border-[#c6c5cf]/20">
            <span className="material-symbols-outlined text-sm">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Occupancy */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c6c5cf]/10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#45464e] text-xs font-black uppercase tracking-widest">Occupancy</span>
            <div className="bg-[#0058be]/10 p-2 rounded-lg">
              <span className="material-symbols-outlined text-[#0058be]">pie_chart</span>
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-[#050f36]">42 / 60</span>
            <span className="text-lg font-bold text-[#0058be]">70%</span>
          </div>
          <div className="mt-4 flex items-center gap-1 text-green-600 font-bold text-sm">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            ↑ 12% vs yesterday
          </div>
        </div>

        {/* Arriving Today */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c6c5cf]/10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#45464e] text-xs font-black uppercase tracking-widest">Arriving Today</span>
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="material-symbols-outlined text-blue-700">login</span>
            </div>
          </div>
          <div className="text-4xl font-black text-[#050f36]">8</div>
          <div className="mt-4 text-[#45464e] text-sm leading-tight">
            <div className="font-bold text-[#050f36]">Next: 2:30 PM</div>
            <div className="text-xs">Space 23 - Global Logistics</div>
          </div>
        </div>

        {/* Departing Today */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c6c5cf]/10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#45464e] text-xs font-black uppercase tracking-widest">Departing Today</span>
            <div className="bg-slate-100 p-2 rounded-lg">
              <span className="material-symbols-outlined text-slate-700">logout</span>
            </div>
          </div>
          <div className="text-4xl font-black text-[#050f36]">5</div>
          <div className="mt-4 text-[#45464e] text-sm leading-tight">
            <div className="font-bold text-[#050f36]">Next: 11:00 AM</div>
            <div className="text-xs">Space 15 - Road-Ready Transit</div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c6c5cf]/10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#45464e] text-xs font-black uppercase tracking-widest">Revenue</span>
            <div className="bg-green-100 p-2 rounded-lg">
              <span className="material-symbols-outlined text-green-700">payments</span>
            </div>
          </div>
          <div className="text-4xl font-black text-[#050f36]">$2,480</div>
          <div className="mt-2 text-[#45464e] text-xs font-medium">Confirmed payments today</div>
          <div className="mt-1 flex items-center gap-1 text-green-600 font-bold text-sm">
            <span className="material-symbols-outlined text-sm">arrow_upward</span>
            ↑ $340 vs 30-day average
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c6c5cf]/10 ring-1 ring-[#3c2100]/10 transition-all hover:shadow-md hover:bg-[#f1f4fb] cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#45464e] text-xs font-black uppercase tracking-widest">Pending Actions</span>
            <div className="bg-[#ffdcbc] p-2 rounded-lg">
              <span className="material-symbols-outlined text-[#61401a]">priority_high</span>
            </div>
          </div>
          <div className="text-4xl font-black text-[#3c2100]">3</div>
          <div className="mt-4 flex justify-between items-end">
            <span className="text-[#45464e] text-sm font-medium">2 check-ins, 1 support request</span>
            <span className="text-[#0058be] text-sm font-bold group-hover:translate-x-1 transition-transform">View Details →</span>
          </div>
        </div>

        {/* Available */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c6c5cf]/10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#45464e] text-xs font-black uppercase tracking-widest">Available</span>
            <div className="bg-[#ebeef5] p-2 rounded-lg">
              <span className="material-symbols-outlined text-[#050f36]">local_parking</span>
            </div>
          </div>
          <div className="text-4xl font-black text-[#050f36]">18</div>
          <div className="mt-4 text-[#45464e] text-sm font-medium">
            30% availability
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-[#050f36] p-4 rounded-xl flex flex-wrap gap-4 items-center mb-10 shadow-lg">
        <span className="text-white/60 text-[10px] font-black uppercase tracking-widest px-4 mr-2 border-r border-white/20 font-label">Quick Actions</span>
        <button className="bg-[#0058be] hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 font-label">
          <span className="material-symbols-outlined text-sm">add_circle</span>
          Manual Check-In
        </button>
        <button className="bg-[#1b254b] text-[#838db9] hover:text-white px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 border border-white/10 font-label">
          <span className="material-symbols-outlined text-sm">calendar_month</span>
          New Reservation
        </button>
        <button className="bg-transparent hover:bg-white/10 text-white/80 px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 font-label">
          <span className="material-symbols-outlined text-sm">block</span>
          Mark Space Unavailable
        </button>
      </section>

      {/* Arriving Table */}
      <section className="bg-white rounded-xl shadow-sm mb-10 overflow-hidden border border-[#c6c5cf]/10">
        <div className="px-8 py-6 border-b border-[#ebeef5]">
          <h2 className="text-xl font-black text-[#050f36] font-manrope">Arriving in Next 4 Hours</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-[#f1f4fb] text-[#45464e] text-[10px] font-black uppercase tracking-widest font-label">
                <th className="px-8 py-4">Time</th>
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">Vehicle</th>
                <th className="px-8 py-4">Space</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebeef5]">
              <tr className="hover:bg-[#f1f4fb]/50 transition-colors">
                <td className="px-8 py-4 font-bold text-[#050f36]">11:15 AM</td>
                <td className="px-8 py-4 text-sm font-medium">Global Logistics S.A.</td>
                <td className="px-8 py-4 text-sm text-[#45464e] flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-lg">local_shipping</span>
                  Freightliner Cascadia #902
                </td>
                <td className="px-8 py-4 text-sm font-bold text-[#0058be]">A-12</td>
                <td className="px-8 py-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    ON TIME
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <button className="bg-[#0058be] text-white text-xs font-black px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-label">CHECK IN</button>
                </td>
              </tr>
              <tr className="hover:bg-[#f1f4fb]/50 transition-colors">
                <td className="px-8 py-4 font-bold text-[#050f36]">11:45 AM</td>
                <td className="px-8 py-4 text-sm font-medium">Inter-State Carriers</td>
                <td className="px-8 py-4 text-sm text-[#45464e] flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-lg">local_shipping</span>
                  Kenworth T680 #44
                </td>
                <td className="px-8 py-4 text-sm font-bold text-[#0058be]">B-05</td>
                <td className="px-8 py-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-full">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    EARLY
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <button className="bg-[#0058be] text-white text-xs font-black px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-label">CHECK IN</button>
                </td>
              </tr>
              <tr className="hover:bg-[#f1f4fb]/50 transition-colors">
                <td className="px-8 py-4 font-bold text-[#050f36]">12:30 PM</td>
                <td className="px-8 py-4 text-sm font-medium">Road-Ready Transit</td>
                <td className="px-8 py-4 text-sm text-[#45464e] flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-lg">local_shipping</span>
                  Volvo VNL 860 #211
                </td>
                <td className="px-8 py-4 text-sm font-bold text-[#0058be]">C-09</td>
                <td className="px-8 py-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-[10px] font-black rounded-full">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                    LATE (15m)
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <button className="bg-[#e5e8ef] text-[#45464e] text-xs font-black px-4 py-2 rounded-lg cursor-not-allowed font-label">WAITING</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Activity & Alerts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Recent Activity Feed */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-[#c6c5cf]/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-[#050f36] font-manrope">Recent Activity</h2>
            <a className="text-[#0058be] text-sm font-bold hover:underline" href="#">View History →</a>
          </div>
          <div className="space-y-6">
            {[
              { type: 'check_circle', color: 'green', title: 'Check-in Complete: Space A-10', time: '2m ago', desc: 'Driver: Thomas Muller • Truck: DE-TR-902' },
              { type: 'payments', color: 'blue', title: 'Payment Received: $125.00', time: '15m ago', desc: 'Invoice #88291 • Credit Card Transaction' },
              { type: 'logout', color: 'slate', title: 'Check-out Complete: Space B-22', time: '45m ago', desc: 'Driver: Sarah Jones • Empty space reported' },
            ].map((activity, idx) => (
              <div key={idx} className="flex gap-4 group">
                <div className={`flex-shrink-0 w-10 h-10 bg-${activity.color}-50 rounded-full flex items-center justify-center text-${activity.color}-600 group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-lg">{activity.type}</span>
                </div>
                <div className="flex-1 border-b border-[#ebeef5] pb-4">
                  <div className="flex justify-between">
                    <p className="text-sm font-bold text-[#050f36]">{activity.title}</p>
                    <span className="text-[10px] font-bold text-[#45464e]">{activity.time}</span>
                  </div>
                  <p className="text-xs text-[#45464e] mt-1">{activity.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-[#c6c5cf]/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-[#050f36] font-manrope">System Alerts</h2>
            <span className="bg-[#ba1a1a] text-white text-[10px] font-black px-2 py-0.5 rounded">3 NEW</span>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border-l-4 border-[#ba1a1a] rounded-r-lg flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-[#ba1a1a] mt-0.5">report</span>
                <div>
                  <h4 className="text-sm font-black text-[#93000a]">Maintenance Required</h4>
                  <p className="text-xs text-[#93000a]/80 mt-1">Space D-04 light sensor failure.</p>
                </div>
              </div>
              <button className="text-xs font-bold text-[#ba1a1a] border border-[#ba1a1a]/20 px-3 py-1.5 rounded-lg hover:bg-[#ba1a1a]/10 whitespace-nowrap hidden sm:block font-label">Schedule</button>
            </div>
            <div className="p-4 bg-[#ffdcbc]/20 border-l-4 border-[#eebe8d] rounded-r-lg flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-[#61401a] mt-0.5">warning</span>
                <div>
                  <h4 className="text-sm font-black text-[#61401a]">Payment Overdue</h4>
                  <p className="text-xs text-[#61401a]/80 mt-1">Atlas Freight (Space B-12) overstay fee.</p>
                </div>
              </div>
              <button className="text-xs font-bold text-[#61401a] border border-[#eebe8d]/20 px-3 py-1.5 rounded-lg hover:bg-[#ffdcbc]/30 whitespace-nowrap hidden sm:block font-label">Send Reminder</button>
            </div>
            <div className="p-4 bg-blue-50 border-l-4 border-[#0058be] rounded-r-lg flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-[#0058be] mt-0.5">info</span>
                <div>
                  <h4 className="text-sm font-black text-[#004395]">Reservations Surge</h4>
                  <p className="text-xs text-[#004395]/80 mt-1">High demand forecast for Friday.</p>
                </div>
              </div>
              <button className="text-xs font-bold text-[#0058be] border border-[#0058be]/20 px-3 py-1.5 rounded-lg hover:bg-[#0058be]/10 whitespace-nowrap hidden sm:block font-label">View Details</button>
            </div>
          </div>
        </div>
      </section>

      {/* Occupancy Trend */}
      <section className="bg-white p-8 rounded-xl shadow-sm mb-12 border border-[#c6c5cf]/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl font-black text-[#050f36] font-manrope">7-Day Occupancy Trend</h2>
            <p className="text-sm text-[#45464e] font-medium">Historical data based on total lot capacity</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#0058be] rounded-full"></span>
              <span className="text-xs font-bold text-[#45464e]">Occupancy %</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#e5e8ef] rounded-full"></span>
              <span className="text-xs font-bold text-[#45464e]">Avg Daily</span>
            </div>
          </div>
        </div>
        {/* Mock Chart Visualization */}
        <div className="relative h-64 w-full flex items-end gap-2 px-2">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="border-t border-[#e5e8ef] w-full h-0"></div>
            <div className="border-t border-[#e5e8ef] w-full h-0"></div>
            <div className="border-t border-[#e5e8ef] w-full h-0"></div>
            <div className="border-t border-[#e5e8ef] w-full h-0"></div>
          </div>
          {/* Days */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
            const heights = ['65%', '72%', '85%', '92%', '78%', '60%', '55%'];
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-[#0058be] rounded-t-lg transition-all duration-500 hover:bg-[#050f36]" 
                  style={{ height: heights[idx] }}
                ></div>
                <span className="text-[10px] font-bold text-[#45464e] uppercase font-label">{day}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
