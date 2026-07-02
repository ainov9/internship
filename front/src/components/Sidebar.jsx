import PropTypes from 'prop-types';

const navItems = ['Dashboard', 'FAQ Management', 'Users', 'Analytics'];
// Sidebar component for navigation
function Sidebar({ activeItem, onNavigate }) {
  return (
    <aside className="flex h-full w-full flex-col justify-between rounded-[30px] bg-[#0F1226] p-5 text-slate-200 shadow-[0_20px_60px_rgba(15,18,38,0.28)] sm:p-6">
      <div>
        <div className="mb-8 flex items-center gap-3 px-1">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-500 font-semibold text-white">
            📈
          </div>
          <div>
            <p className="text-lg font-semibold text-white">SupportAI</p>
            <p className="text-sm text-slate-400">Admin /Assitant Workspace</p>
          </div>
        </div>

        <nav aria-label="Sidebar" className="space-y-2.5 margin-left-0 padding-left-0 margin-right-0 padding-right-0">
          {navItems.map((item) => {  
            // Iterate over navigation items
            const isActive = activeItem === item; // Check if the current item is active
            return (
              <button
                key={item}// Unique key for each navigation item
                type="button"
                onClick={() => onNavigate(item)}// Handle navigation when the item is clicked
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-inner'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`} // Apply conditional styling based on active state
              >
                <span>{item}</span>
                {isActive && <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 font-semibold text-white">
            👤
          </div>
          <div>
            <p className="font-semibold text-white">Amine</p>
            <p className="text-sm text-slate-400">Operations Lead</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  activeItem: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
};// Export the Sidebar component for use in other parts of the application

export default Sidebar;
