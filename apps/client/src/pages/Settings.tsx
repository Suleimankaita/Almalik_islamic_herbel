      import React, { useState, useEffect, useRef } from 'react';
      import {
      User,
      Mail,
      Lock,
      Bell,
      AlertTriangle,
      Globe,
      Leaf,
      Camera,
      UploadCloud,
      Shield,
      Trash2,
      LogOut,
      ChevronRight,
      ChevronDown,
      X,
      Check,
      } from 'lucide-react';
      import {
      useGetUserSettingsQuery,
      useUpdateUserSettingsMutation,
      useChangeUserPasswordMutation,
      useDeleteUserAccountMutation,
      useUpadateProfileImgMutation,
      useDeleteProfileImgMutation,
      useLogoutMutation,
      } from '../Features/api/DataSlice';
      import { useDispatch, useSelector } from 'react-redux';
      import { GetToken, setToken } from '../Features/AppSlice';
      import { useNavigate } from 'react-router-dom';
      import ApiSlice from '../Features/api/ApiSlice';

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
      active ? 'bg-[#2C5234]' : 'bg-gray-200 '
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
      className={`group relative flex items-center justify-between rounded-xl p-4 transition-all duration-300 ease-in-out hover:bg-[#F3F6F4] hover:shadow-sm ${
      onClick || isDropdown ? 'cursor-pointer' : ''
      } animate-fade-in-up opacity-0 fill-mode-forwards`}
      >
      <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F6F4] text-[#2C5234] transition-transform duration-300 group-hover:scale-110">
      <Icon size={20} strokeWidth={1.75} />
      </div>
      <div className="flex flex-col">
      <h4 className="text-sm font-medium text-gray-900 sm:text-base transition-colors">
      {title}
      </h4>
      <p className="text-xs text-gray-500 sm:text-sm transition-colors">
      {description}
      </p>
      </div>
      </div>

      <div className="flex items-center gap-3 pl-4">
      {value && (
      <span className="hidden text-sm text-gray-500 sm:block transition-colors">
      {value}
      </span>
      )}
      {action ? (
      action
      ) : isDropdown ? (
      <ChevronDown
      size={18}
      className={`text-gray-400 transition-all duration-300 group-hover:text-gray-700 ${
      isOpen ? 'rotate-180' : ''
      }`}
      />
      ) : (
      <ChevronRight
      size={18}
      className="text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#2C5234] "
      />
      )}
      </div>

      {/* Dropdown Menu */}
      {isDropdown && isOpen && (
      <div className="absolute right-4 top-full z-50 mt-1 w-48 origin-top-right rounded-xl border border-gray-100 bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95 duration-200">
      {options.map((opt) => (
      <button
      key={opt}
      onClick={(e) => {
      e.stopPropagation();
      if (onOptionSelect) onOptionSelect(opt);
      }}
      className="flex w-full items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-[#F3F6F4] transition-colors"
      >
      {opt}
      {value === opt && <Check size={16} className="text-[#2C5234] " />}
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
      const [lowStockThreshold, setLowStockThreshold] = useState('5');
      const [profileImage, setProfileImage] = useState<string | null>(null);
      const photoInputRef = useRef<HTMLInputElement>(null);
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
      onSave: (val: string) => Promise<void> | void;
      }>({ isOpen: false, title: '', value: '', type: 'text', onSave: async () => {} });

      const token=useSelector(GetToken)
      const dispatch = useDispatch();
      const navigate = useNavigate();

      const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
      const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

      const { data: settingsData, isLoading: isLoadingSettings, isFetching: isFetchingSettings } = useGetUserSettingsQuery({token},{ 
      pollingInterval:1000
      });
      const [updateSettings, { isLoading: isUpdatingSettings }] = useUpdateUserSettingsMutation();
      const [updateProfileImg, { isLoading: isUpdatingProfileImg }] = useUpadateProfileImgMutation();
      const [changePassword, { isLoading: isChangingPassword }] = useChangeUserPasswordMutation();
      const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteUserAccountMutation();
      const [deleteProfileImg, { isLoading: isDeletingProfileImg }] = useDeleteProfileImgMutation();
      const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
      useEffect(() => {
      setMounted(true);
      }, []);

      useEffect(() => {
      if (settingsData?.success && settingsData.user) {
      setEmail(settingsData.user.Email || '');
      setProfileImage(settingsData?.user?.Img?.length ? `${import.meta.env.VITE_URI}/img/${settingsData?.user?.Img}` : null);
      setNotifications(settingsData.user.Notifications ?? true);
      setLowStockThreshold(String(settingsData.user.LowStockThreshold ?? 5));
      setLanguage(settingsData.user.Language || 'English');
      setUnits(settingsData.user.Units || 'Metric (kg, cm)');
      }
      }, [settingsData]);

      // Helper to show temporary toast notifications
      const showToast = (message: string) => {
      setToast({ message, id: Date.now() });
      setTimeout(() => setToast(null), 3000);
      };

      const saveSettings = async (payload: Record<string, any>, successMessage: string) => {
      try {
      await updateSettings(payload).unwrap();
      showToast(successMessage);
      } catch (err: any) {
      showToast(err?.data?.message || err?.message || 'Update failed');
      throw err;
      }
      };

      const saveLowStockThreshold = async () => {
      const threshold = Number(lowStockThreshold);
      if (!Number.isFinite(threshold) || threshold < 0) {
      showToast('Enter a valid threshold of zero or more');
      return;
      }

      try {
      await saveSettings({ LowStockThreshold: threshold }, 'Low-stock alert threshold updated');
      } catch {
      // saveSettings already displays the server error.
      }
      };

      const handlePasswordChange = async (newPassword: string) => {
      try {
      await changePassword({ newPassword }).unwrap();
      showToast('Password updated securely');
      } catch (err: any) {
      showToast(err?.data?.message || err?.message || 'Password update failed');
      throw err;
      }
      };

      const handleDeleteAccount = async () => {
      try {
      await deleteAccount().unwrap();
      showToast('Account deleted successfully');
      window.location.href = '/';
      } catch (err: any) {
      showToast(err?.data?.message || err?.message || 'Unable to delete account');
      }
      };

      const handleLogout = async () => {
      let logoutError: unknown;
      try {
      await logout().unwrap();
      } catch (error) {
      logoutError = error;
      }

      dispatch(setToken(null));
      dispatch(ApiSlice.util.resetApiState());
      setIsLogoutModalOpen(false);
      if (logoutError) {
      console.error('The server could not confirm logout; clearing the local session.', logoutError);
      }
      navigate('/login', { replace: true });
      };

      const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      const form=new FormData;
      if (!file) return;

      if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file');
      event.target.value = '';
      return;
      }

      if (file.size > 5 * 1024 * 1024) {
      showToast('Photo must be 5 MB or smaller');
      event.target.value = '';
      return;
      }

      const previewUrl = URL.createObjectURL(file);
      setProfileImage((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return previewUrl;
      });
      showToast('Profile photo preview updated');
        form.append('file',file)
      updateProfileImg(form).unwrap().then(()=>{
        showToast('Profile photo updated successfully');})


      };

      // Toggle dropdowns safely
      const toggleDropdown = (id: string) => {
      setActiveDropdown(activeDropdown === id ? null : id);
    };

      if (!mounted) return null;

      return (
      <div className="transition-colors duration-300">
      <div className="relative min-h-screen bg-[#FAF9F6] px-4 py-12 sm:px-6 lg:px-8 font-sans overflow-hidden transition-colors duration-500">
      
      {/* Toast Notification */}
      {toast && (
      <div
      key={toast.id}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-white shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-300"
      >
      <Check size={18} className="text-green-400 " />
      <span className="text-sm font-medium">{toast.message}</span>
      </div>
      )}

      {/* Decorative Botanical Graphic */}
      <div className="absolute right-0 top-0 pointer-events-none opacity-60 mix-blend-multiply transition-opacity duration-500">
      <svg
      width="400"
      height="300"
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transform translate-x-1/4 -translate-y-1/4 text-[#4A6D50] "
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
      <h1 className="mb-1 text-4xl font-serif text-[#1e3a24] tracking-tight transition-colors">
      Settings
      </h1>
      <p className="text-gray-500 transition-colors">Manage your account and preferences</p>
      </header>

      {/* Main Card */}
      <main className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-8 animate-fade-in-up opacity-0 fill-mode-forwards transition-colors duration-500" style={{ animationDelay: '100ms' }}>
      
      {/* Profile photo */}
      <section className="mb-8 rounded-2xl border border-[#E5EAE5] bg-gradient-to-br from-white to-[#F4F8F3] p-5 sm:p-6">
      <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div className="relative shrink-0">
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#E8F0E7] text-[#2C5234] shadow-md ring-1 ring-[#D8E4D6]">
      {profileImage ? (
      <img src={profileImage} alt="Profile preview" className="h-full w-full object-cover" />
      ) : (
      <User size={38} strokeWidth={1.5} />
      )}
      </div>
      <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#2C5234] text-white shadow">
      <Camera size={15} />
      </span>
      </div>
      <div className="min-w-0 flex-1 text-center sm:text-left">
      <h3 className="text-base font-semibold text-gray-900">Profile photo</h3>
      <p className="mt-1 text-sm leading-6 text-gray-500">
      Add a clear photo so people can recognize your account. JPG, PNG, or WEBP up to 5 MB.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
      <input
      ref={photoInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      aria-label="Choose profile photo"
      onChange={handleProfilePhotoChange}
      />
      <button
      type="button"
      onClick={() => photoInputRef.current?.click()}
      className="inline-flex items-center gap-2 rounded-xl bg-[#2C5234] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e3a24] focus:outline-none focus:ring-2 focus:ring-[#2C5234] focus:ring-offset-2"
      >
      <UploadCloud size={17} />
      {profileImage ? 'Change photo' : 'Upload photo'}
      </button>
      {profileImage && (
      <button
      type="button"
      onClick={async () => {
      URL.revokeObjectURL(profileImage);
      setProfileImage(null);
      if (photoInputRef.current) photoInputRef.current.value = '';
      showToast('Profile photo removed from preview');
    try {
      await deleteProfileImg(token).unwrap();
      showToast('Profile photo deleted successfully');  
    } catch (err: any) {
      showToast(err?.data?.message || err?.message || 'Failed to delete profile photo');
    }}}
      className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
      >
      Remove
      </button>
      )}
      </div>
      </div>
      </div>
      </section>

      {/* Section: Account Settings */}
      <section className="mb-8">
      <h3 className="mb-3 px-4 text-lg font-semibold text-gray-900 transition-colors">
      Account Settings
      </h3>
      <div className="flex flex-col space-y-1">
      <SettingItem
      icon={User}
      title="Profile Information"
      description="View and update your personal details"
      delay={150}
      onClick={() => photoInputRef.current?.click()}
      />
      <div className="mx-4 h-px bg-gray-100 transition-colors" />
      <SettingItem
      icon={Mail}
      title="Email Address"
      description="Update your email address"
      value={email}
      delay={200}
      onClick={() => setEditModal({
      isOpen: true,
      title: 'Update Email Address',
      type: 'text',
      value: email,
      onSave: async (val) => {
      if (!val) {
      showToast('Email is required');
      return;
      }
      setEmail(val);
      await saveSettings({ Email: val }, 'Email successfully updated');
      },
      })}
      />
      <div className="mx-4 h-px bg-gray-100 transition-colors" />
      <SettingItem
      icon={Lock}
      title="Password"
      description="Change your password"
      value="********"
      delay={250}
      onClick={() => setEditModal({
      isOpen: true,
      title: 'Update Password',
      type: 'password',
      value: '',
      onSave: async (val) => {
      if (!val || val.length < 6) {
      showToast('Password must be at least 6 characters');
      return;
      }
      await handlePasswordChange(val);
      },
      })}
      />
      </div>
      </section>

      {/* Section: Preferences */}
      <section className="mb-8">
      <h3 className="mb-3 px-4 text-lg font-semibold text-gray-900 transition-colors">
      Preferences
      </h3>
      <div className="flex flex-col space-y-1">
      <form
      onSubmit={(event) => {
      event.preventDefault();
      void saveLowStockThreshold();
      }}
      className="flex flex-col gap-4 rounded-xl p-4 transition-colors hover:bg-[#F3F6F4] sm:flex-row sm:items-center sm:justify-between"
      >
      <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F6F4] text-[#2C5234]">
      <AlertTriangle size={20} strokeWidth={1.75} />
      </div>
      <div>
      <h4 className="text-sm font-medium text-gray-900 sm:text-base">Low-stock alert threshold</h4>
      <p className="text-xs text-gray-500 sm:text-sm">Notify when a product reaches this stock level or lower.</p>
      </div>
      </div>
      <div className="flex items-center gap-2 pl-14 sm:pl-4">
      <label className="sr-only" htmlFor="low-stock-threshold">Low-stock threshold in units</label>
      <input
      id="low-stock-threshold"
      type="number"
      min="0"
      step="1"
      required
      value={lowStockThreshold}
      onChange={(event) => setLowStockThreshold(event.target.value)}
      disabled={isLoadingSettings || isUpdatingSettings}
      className="w-24 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#2C5234] focus:outline-none focus:ring-1 focus:ring-[#2C5234] disabled:bg-gray-100"
      />
      <button
      type="submit"
      disabled={isLoadingSettings || isUpdatingSettings || lowStockThreshold === ''}
      className="rounded-xl bg-[#2C5234] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1e3a24] disabled:cursor-not-allowed disabled:opacity-50"
      >
      {isUpdatingSettings ? 'Saving...' : 'Save'}
      </button>
      </div>
      </form>
      <div className="mx-4 h-px bg-gray-100 transition-colors" />
      <SettingItem
      icon={Bell}
      title="Notifications"
      description="Manage your email and order notifications"
      action={
      <Toggle
      active={notifications}
      onChange={async () => {
      const next = !notifications;
      setNotifications(next);
      try {
      await saveSettings({ Notifications: next }, next ? 'Notifications enabled' : 'Notifications disabled');
      } catch {
      setNotifications(!next);
      }
      }}
      />
      }
      delay={300}
      />
      <div className="mx-4 h-px bg-gray-100 transition-colors" />
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
      <div className="mx-4 h-px bg-gray-100 transition-colors" />
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
      <div className="mx-4 h-px bg-gray-100 transition-colors" />

      
      </div>
      </section>

      {/* Section: Account & Security */}
      <section>
      <h3 className="mb-3 px-4 text-lg font-semibold text-gray-900 transition-colors">
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
      <div className="mx-4 h-px bg-gray-100 transition-colors" />
      <SettingItem
      icon={Trash2}
      title="Delete Account"
      description="Permanently delete your account and data"
      delay={550}
      onClick={() => setIsDeleteModalOpen(true)}
      />
      <div className="mx-4 h-px bg-gray-100 transition-colors" />
      <SettingItem
      icon={LogOut}
      title="Log out"
      description="Sign out of this account on this device"
      delay={600}
      onClick={() => setIsLogoutModalOpen(true)}
      />
      </div>
      </section>
      </main>
      </div>

      {/* Global Modals */}

      {/* 1. Edit Data Modal */}
      {editModal.isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900 ">{editModal.title}</h3>
      <button 
      onClick={() => setEditModal({ ...editModal, isOpen: false })}
      className="text-gray-400 hover:text-gray-600 transition-colors"
      >
      <X size={20} />
      </button>
      </div>
      <input
      type={editModal.type}
      autoFocus
      defaultValue={editModal.value}
      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-[#2C5234] focus:outline-none focus:ring-1 focus:ring-[#2C5234] transition-colors mb-6"
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
      className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
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
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
      <Trash2 className="h-6 w-6 text-red-600 " aria-hidden="true" />
      </div>
      <h3 className="text-center text-lg font-semibold text-gray-900 mb-2">
      Delete Account
      </h3>
      <p className="text-center text-sm text-gray-500 mb-6">
      Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
      <button
      onClick={() => setIsDeleteModalOpen(false)}
      className="w-full rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors sm:w-auto"
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

      {isLogoutModalOpen && (
      <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm animate-in fade-in duration-200"
      onMouseDown={(event) => {
      if (event.target === event.currentTarget && !isLoggingOut) setIsLogoutModalOpen(false);
      }}
      >
      <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200"
      >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
      <LogOut className="h-6 w-6 text-[#2C5234]" aria-hidden="true" />
      </div>
      <h3 id="logout-modal-title" className="mb-2 text-center text-lg font-semibold text-gray-900">
      Log out of your account?
      </h3>
      <p className="mb-6 text-center text-sm text-gray-500">
      You will be returned to the login page. You can sign in again at any time.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
      <button
      type="button"
      disabled={isLoggingOut}
      onClick={() => setIsLogoutModalOpen(false)}
      className="w-full rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
      Cancel
      </button>
      <button
      type="button"
      disabled={isLoggingOut}
      onClick={() => void handleLogout()}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C5234] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1e3a24] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
      {isLoggingOut ? (
      <>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      Signing out…
      </>
      ) : (
      <>
      <LogOut size={16} />
      Log out
      </>
      )}
      </button>
      </div>
      </section>
      </div>
      )}

      </div>
      </div>
      );
      }