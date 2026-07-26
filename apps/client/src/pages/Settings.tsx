import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Lock,
  Bell,
  Globe,
  Leaf,
  Moon,
  Shield,
  Trash2,
  ChevronRight,
  ChevronDown,
  X,
  Check,
} from 'lucide-react';

// --- Types & Interfaces ---

interface SettingItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
  value?: string;
  onClick?: () => void;
  delay?: number;
  options?: string[];
  onOptionSelect?: (option: string) => void;
  isOpen?: boolean;
  onToggleDropdown?: () => void;
}

interface ToggleProps {
  active: boolean;
  onChange: () => void;
}

// --- Hooks ---

// Custom hook to handle clicks outside of dropdowns
function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// --- Sub-Components ---

const Toggle: React.FC<ToggleProps> = ({ active, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={active}
    onClick={(e) => {
      e.stopPropagation();
      onChange();
    }}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2C5234] focus-visible:ring-offset-2 ${
      active ? 'bg-[#2C5234]' : 'bg-gray-200 dark:bg-gray-700'
    }`}
  >
    <span
      aria-hidden="true"
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
        active ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

const SettingItem: React.FC<SettingItemProps> = ({
  icon: Icon,
  title,
  description,
  action,
  value,
  onClick,
  delay = 0,
  options,
  onOptionSelect,
  isOpen,
  onToggleDropdown,
}) => {
  const isDropdown = options && options.length > 0;
  const dropdownRef:any = useRef(null) ;

  useOnClickOutside(dropdownRef, () => {
    if (isOpen && onToggleDropdown) onToggleDropdown();
  });

  const handleClick = () => {
    if (isDropdown && onToggleDropdown) {
      onToggleDropdown();
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      ref={dropdownRef}
      onClick={handleClick}
      style={{ animationDelay: `${delay}ms` }}
      className={`group relative flex items-center justify-between rounded-xl p-4 transition-all duration-300 ease-in-out hover:bg-[#F3F6F4] dark:hover:bg-gray-800 hover:shadow-sm ${
        onClick || isDropdown ? 'cursor-pointer' : ''
      } animate-fade-in-up opacity-0 fill-mode-forwards`}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F6F4] dark:bg-gray-800 text-[#2C5234] dark:text-[#4ade80] transition-transform duration-300 group-hover:scale-110">
          <Icon size={20} strokeWidth={1.75} />
        </div>
        <div className="flex flex-col">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 sm:text-base transition-colors">
            {title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm transition-colors">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 pl-4">
        {value && (
          <span className="hidden text-sm text-gray-500 dark:text-gray-400 sm:block transition-colors">
            {value}
          </span>
        )}
        {action ? (
          action
        ) : isDropdown ? (
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-all duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        ) : (
          <ChevronRight
            size={18}
            className="text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#2C5234] dark:group-hover:text-[#4ade80]"
          />
        )}
      </div>

      {/* Dropdown Menu */}
      {isDropdown && isOpen && (
        <div className="absolute right-4 top-full z-50 mt-1 w-48 origin-top-right rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95 duration-200">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={(e) => {
                e.stopPropagation();
                if (onOptionSelect) onOptionSelect(opt);
              }}
              className="flex w-full items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-[#F3F6F4] dark:hover:bg-gray-700 transition-colors"
            >
              {opt}
              {value === opt && <Check size={16} className="text-[#2C5234] dark:text-[#4ade80]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Page Component ---

export default function SettingsPage() {
  // State Management
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('info@almalikherbel.com');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [units, setUnits] = useState('Metric (kg, cm)');

  // UI State
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);
  
  // Modals State
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    title: string;
    value: string;
    type: 'text' | 'password';
    onSave: (val: string) => void;
  }>({ isOpen: false, title: '', value: '', type: 'text', onSave: () => {} });
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper to show temporary toast notifications
  const showToast = (message: string) => {
    setToast({ message, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  };

  // Toggle dropdowns safely
  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  if (!mounted) return null;

  return (
    <div className={`${darkMode ? 'dark' : ''} transition-colors duration-500`}>
      <div className="relative min-h-screen bg-[#FAF9F6] dark:bg-gray-950 px-4 py-12 sm:px-6 lg:px-8 font-sans overflow-hidden transition-colors duration-500">
        
        {/* Toast Notification */}
        {toast && (
          <div
            key={toast.id}
            className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-gray-900 dark:bg-white px-4 py-3 text-white dark:text-gray-900 shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-300"
          >
            <Check size={18} className="text-green-400 dark:text-green-600" />
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        )}

        {/* Decorative Botanical Graphic */}
        <div className="absolute right-0 top-0 pointer-events-none opacity-60 mix-blend-multiply dark:mix-blend-screen transition-opacity duration-500">
          <svg
            width="400"
            height="300"
            viewBox="0 0 400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transform translate-x-1/4 -translate-y-1/4 text-[#4A6D50] dark:text-[#2C5234]"
          >
            <path d="M380 50C340 100 280 120 200 150C250 140 300 110 330 60C345 30 360 10 380 50Z" fill="currentColor" opacity="0.2" />
            <path d="M300 150C250 180 180 190 100 200C160 185 220 160 260 120C280 100 295 80 300 150Z" fill="currentColor" opacity="0.3" />
            <path d="M350 200C300 240 220 260 140 270C200 250 260 210 300 160C320 135 335 110 350 200Z" fill="currentColor" opacity="0.15" />
          </svg>
        </div>

        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .fill-mode-forwards {
            animation-fill-mode: forwards;
          }
        `}</style>

        <div className="relative z-10 mx-auto max-w-3xl">
          {/* Header */}
          <header className="mb-8 animate-fade-in-up opacity-0 fill-mode-forwards">
            <h1 className="mb-1 text-4xl font-serif text-[#1e3a24] dark:text-white tracking-tight transition-colors">
              Settings
            </h1>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">Manage your account and preferences</p>
          </header>

          {/* Main Card */}
          <main className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm sm:p-8 animate-fade-in-up opacity-0 fill-mode-forwards transition-colors duration-500" style={{ animationDelay: '100ms' }}>
            
            {/* Section: Account Settings */}
            <section className="mb-8">
              <h3 className="mb-3 px-4 text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                Account Settings
              </h3>
              <div className="flex flex-col space-y-1">
                <SettingItem
                  icon={User}
                  title="Profile Information"
                  description="View and update your personal details"
                  delay={150}
                  onClick={() => showToast("Profile settings opened")}
                />
                <div className="mx-4 h-px bg-gray-100 dark:bg-gray-800 transition-colors" />
                <SettingItem
                  icon={Mail}
                  title="Email Address"
                  description="Update your email address"
                  value={email}
                  delay={200}
                  onClick={() => setEditModal({
                    isOpen: true, title: 'Update Email Address', type: 'text', value: email,
                    onSave: (val) => { setEmail(val); showToast("Email successfully updated"); }
                  })}
                />
                <div className="mx-4 h-px bg-gray-100 dark:bg-gray-800 transition-colors" />
                <SettingItem
                  icon={Lock}
                  title="Password"
                  description="Change your password"
                  value="********"
                  delay={250}
                  onClick={() => setEditModal({
                    isOpen: true, title: 'Update Password', type: 'password', value: '',
                    onSave: (val) => { setPassword(val); showToast("Password updated securely"); }
                  })}
                />
              </div>
            </section>

            {/* Section: Preferences */}
            <section className="mb-8">
              <h3 className="mb-3 px-4 text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                Preferences
              </h3>
              <div className="flex flex-col space-y-1">
                <SettingItem
                  icon={Bell}
                  title="Notifications"
                  description="Manage your email and order notifications"
                  action={
                    <Toggle
                      active={notifications}
                      onChange={() => {
                        setNotifications(!notifications);
                        showToast(notifications ? "Notifications disabled" : "Notifications enabled");
                      }}
                    />
                  }
                  delay={300}
                />
                <div className="mx-4 h-px bg-gray-100 dark:bg-gray-800 transition-colors" />
                <SettingItem
                  icon={Globe}
                  title="Language"
                  description="Choose your preferred language"
                  value={language}
                  options={['English', 'French', 'Arabic', 'Spanish']}
                  isOpen={activeDropdown === 'language'}
                  onToggleDropdown={() => toggleDropdown('language')}
                  onOptionSelect={(val) => {
                    setLanguage(val);
                    setActiveDropdown(null);
                    showToast(`Language set to ${val}`);
                  }}
                  delay={350}
                />
                <div className="mx-4 h-px bg-gray-100 dark:bg-gray-800 transition-colors" />
                <SettingItem
                  icon={Leaf}
                  title="Units & Measurements"
                  description="Select your preferred units"
                  value={units}
                  options={['Metric (kg, cm)', 'Imperial (lb, in)']}
                  isOpen={activeDropdown === 'units'}
                  onToggleDropdown={() => toggleDropdown('units')}
                  onOptionSelect={(val) => {
                    setUnits(val);
                    setActiveDropdown(null);
                    showToast(`Units updated to ${val.split(' ')[0]}`);
                  }}
                  delay={400}
                />
                <div className="mx-4 h-px bg-gray-100 dark:bg-gray-800 transition-colors" />
                <SettingItem
                  icon={Moon}
                  title="Dark Mode"
                  description="Switch between light and dark appearance"
                  action={
                    <Toggle
                      active={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                    />
                  }
                  delay={450}
                />
              </div>
            </section>

            {/* Section: Account & Security */}
            <section>
              <h3 className="mb-3 px-4 text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                Account & Security
              </h3>
              <div className="flex flex-col space-y-1">
                <SettingItem
                  icon={Shield}
                  title="Privacy & Security"
                  description="Manage your privacy settings and data"
                  delay={500}
                  onClick={() => showToast("Privacy settings opened")}
                />
                <div className="mx-4 h-px bg-gray-100 dark:bg-gray-800 transition-colors" />
                <SettingItem
                  icon={Trash2}
                  title="Delete Account"
                  description="Permanently delete your account and data"
                  delay={550}
                  onClick={() => setIsDeleteModalOpen(true)}
                />
              </div>
            </section>
          </main>
        </div>

        {/* Global Modals */}

        {/* 1. Edit Data Modal */}
        {editModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{editModal.title}</h3>
                <button 
                  onClick={() => setEditModal({ ...editModal, isOpen: false })}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <input
                type={editModal.type}
                autoFocus
                defaultValue={editModal.value}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:border-[#2C5234] focus:outline-none focus:ring-1 focus:ring-[#2C5234] transition-colors mb-6"
                placeholder={`Enter new ${editModal.title.split(' ')[1].toLowerCase()}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    editModal.onSave(e.currentTarget.value);
                    setEditModal({ ...editModal, isOpen: false });
                  }
                }}
                id="modal-input"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditModal({ ...editModal, isOpen: false })}
                  className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const val = (document.getElementById('modal-input') as HTMLInputElement).value;
                    editModal.onSave(val);
                    setEditModal({ ...editModal, isOpen: false });
                  }}
                  className="rounded-xl bg-[#2C5234] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1e3a24] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-500" aria-hidden="true" />
              </div>
              <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Delete Account
              </h3>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    showToast("Account deletion request submitted.");
                  }}
                  className="w-full rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors sm:w-auto"
                >
                  Yes, Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}