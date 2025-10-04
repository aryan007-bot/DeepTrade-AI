"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { 
  LayoutDashboard, 
  Bot, 
  TrendingUp, 
  Trophy, 
  ArrowLeftRight, 
  BarChart3, 
  Settings, 
  HelpCircle,
  X,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface DashboardSidebarProps {
  onClose?: () => void;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  badge?: string;
  children?: NavItem[];
}

export function DashboardSidebar({ onClose }: DashboardSidebarProps) {
  const { connected } = useWallet();
  const router = useRouter();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['trading']);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const navItems: NavItem[] = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      href: "/dashboard",
      active: pathname === "/dashboard"
    },
    {
      icon: <Bot size={20} />,
      label: "My Bots",
      href: "/dashboard/bots",
      badge: "12",
      active: pathname === "/dashboard/bots"
    },
    {
      icon: <TrendingUp size={20} />,
      label: "Trading",
      children: [
        { icon: <BarChart3 size={16} />, label: "Spot Trading", href: "/dashboard/trading/spot", active: pathname === "/dashboard/trading/spot" },
        { icon: <ArrowLeftRight size={16} />, label: "Cross-Chain", href: "/dashboard/trading/cross-chain", active: pathname === "/dashboard/trading/cross-chain" },
        { icon: <TrendingUp size={16} />, label: "Arbitrage", href: "/dashboard/trading/arbitrage", active: pathname === "/dashboard/trading/arbitrage" }
      ]
    },
    {
      icon: <Trophy size={20} />,
      label: "Leaderboard",
      href: "/dashboard/leaderboard",
      active: pathname === "/dashboard/leaderboard"
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Analytics",
      href: "/dashboard/analytics",
      active: pathname === "/dashboard/analytics"
    }
  ];

  const bottomNavItems: NavItem[] = [
    {
      icon: <Settings size={20} />,
      label: "Settings",
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings"
    },
    {
      icon: <HelpCircle size={20} />,
      label: "Help & Support",
      href: "/dashboard/help",
      active: pathname === "/dashboard/help"
    }
  ];

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.label);
    const paddingLeft = level === 0 ? "pl-4" : "pl-8";

    return (
      <div key={item.label}>
        <Button
          variant="ghost"
          className={`
            w-full justify-start ${paddingLeft} pr-4 py-3 h-auto text-left
            ${item.active ? 'bg-[#00d2cee6] text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}
            ${level > 0 ? 'text-sm' : ''}
          `}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.label);
            } else if (item.href) {
              router.push(item.href);
              onClose?.();
            }
          }}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-[#00d2cee6] text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            {hasChildren && (
              <div className="ml-auto">
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            )}
          </div>
        </Button>
        
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children?.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!connected) {
    return (
      <div className="w-64 h-full bg-[#051419] border-r border-gray-700 flex items-center justify-center">
        <div className="text-center text-gray-400 p-6">
          <Bot size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-sm">Connect wallet to access dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 h-full bg-[#051419] border-r border-gray-700 flex flex-col">
      {/* Mobile close button */}
      <div className="lg:hidden flex justify-end p-4">
        <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={20} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="space-y-1">
          {navItems.map(item => renderNavItem(item))}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-700 py-4">
        <div className="space-y-1">
          {bottomNavItems.map(item => renderNavItem(item))}
        </div>
      </div>

      {/* User Info */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#00d2cee6] rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Trading Bot User</p>
            <p className="text-xs text-gray-400 truncate">Connected</p>
          </div>
        </div>
      </div>
    </div>
  );
}