import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Upload, Package } from 'lucide-react';

const brands = [
  { name: 'Azure', path: '/dashboard/azure' },
  { name: 'Monsini', path: '/dashboard/monsini' },
  { name: 'Risky', path: '/dashboard/risky' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-card border-r border-border h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Product Dashboard</h1>
      </div>

      <nav className="px-4 space-y-2">
        <Link
          to="/dashboard"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
            location.pathname === '/dashboard'
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        <div className="pt-4 pb-2">
          <p className="px-4 text-xs font-semibold text-muted-foreground uppercase">
            Websites
          </p>
        </div>

        {brands.map((brand) => (
          <Link
            key={brand.name}
            to={brand.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              location.pathname.includes(brand.path)
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Package className="w-5 h-5" />
            <span>{brand.name}</span>
          </Link>
        ))}

        <div className="pt-4">
          <Link
            to="/upload"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              location.pathname === '/upload'
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Upload className="w-5 h-5" />
            <span>Upload Products</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;

