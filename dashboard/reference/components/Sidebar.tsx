import { LayoutDashboard, PlayCircle, Bot, AlertCircle, BarChart3 } from 'lucide-react';

interface SidebarProps {
  activeTab: 'modules' | 'ai' | 'defects' | 'execution' | 'analytics';
  onTabChange: (tab: 'modules' | 'ai' | 'defects' | 'execution' | 'analytics') => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'modules' as const, icon: LayoutDashboard, label: 'Module Selection' },
    { id: 'execution' as const, icon: PlayCircle, label: 'Test Execution' },
    { id: 'analytics' as const, icon: BarChart3, label: 'Test Analytics' },
    { id: 'ai' as const, icon: Bot, label: 'AI Commander' },
    { id: 'defects' as const, icon: AlertCircle, label: 'Defect Logger' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold">Test Dashboard</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-400">
          <p>Framework v1.0.0</p>
          <p>Jira: Connected</p>
          <p>OpenAI: Active</p>
        </div>
      </div>
    </aside>
  );
}
