import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/inspections', label: 'Inspections' },
  { to: '/complaints', label: 'Complaints' },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-mark">SF</div>
        <div>
          <h2>Smart Facility</h2>
          <p>Operations Suite</p>
        </div>
      </div>

      <nav className="nav-menu">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
