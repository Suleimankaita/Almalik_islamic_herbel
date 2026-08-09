import React, { useEffect, useMemo, useState } from "react";
import {
    Search,
    Plus,
    MoreHorizontal,
    ShieldCheck,
    Users,
    UserPlus,
    UserCheck,
    UserX,
    KeyRound,
    Edit3,
    Trash2,
    X,
    Check,
    ChevronDown,
    Shield,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Phone,
    Building2,
    Clock3,
    Activity,
    CheckCircle2,
    Leaf,
    AlertCircle,
    Settings2,
    User,
} from "lucide-react";
import { useRegistrationMutation } from "../Features/api/DataSlice";
import { toast, ToastContainer } from "react-toastify";
import { form } from "framer-motion/client";

/*
|--------------------------------------------------------------------------
| Demo Data
|--------------------------------------------------------------------------
*/

const initialUsers = [
    {
        id: 1,
        name: "Suleiman Yusuf",
        email: "suleiman@almalik.com",
        phone: "+234 800 000 0000",
        role: "Administrator",
        branch: "Main Branch",
        status: "Active",
        lastLogin: "Today, 10:42 AM",
        avatar: "SY",
    },
    {
        id: 2,
        name: "Abdullahi Musa",
        email: "abdullahi@almalik.com",
        phone: "+234 801 234 5678",
        role: "Manager",
        branch: "Main Branch",
        status: "Active",
        lastLogin: "Today, 09:15 AM",
        avatar: "AM",
    },
    {
        id: 3,
        name: "Aisha Ibrahim",
        email: "aisha@almalik.com",
        phone: "+234 802 345 6789",
        role: "Cashier",
        branch: "Main Branch",
        status: "Active",
        lastLogin: "Yesterday, 05:32 PM",
        avatar: "AI",
    },
    {
        id: 4,
        name: "Muhammad Bello",
        email: "muhammad@almalik.com",
        phone: "+234 803 456 7890",
        role: "Inventory Manager",
        branch: "Katsina Branch",
        status: "Active",
        lastLogin: "Yesterday, 02:10 PM",
        avatar: "MB",
    },
    {
        id: 5,
        name: "Fatima Umar",
        email: "fatima@almalik.com",
        phone: "+234 804 567 8901",
        role: "Cashier",
        branch: "Katsina Branch",
        status: "Inactive",
        lastLogin: "Aug 02, 2026",
        avatar: "FU",
    },
    {
        id: 6,
        name: "Yusuf Ahmad",
        email: "yusuf@almalik.com",
        phone: "+234 805 678 9012",
        role: "Sales Staff",
        branch: "Main Branch",
        status: "Active",
        lastLogin: "Aug 08, 2026",
        avatar: "YA",
    },
];

const initialRoles = [
    {
        id: 1,
        name: "Administrator",
        description: "Full access to the entire system.",
        users: 1,
        color: "green",
        permissions: {
            dashboard: ["view"],
            inventory: ["view", "create", "edit", "delete"],
            sales: ["view", "create", "edit", "delete"],
            purchases: ["view", "create", "edit", "delete"],
            customers: ["view", "create", "edit", "delete"],
            suppliers: ["view", "create", "edit", "delete"],
            expenses: ["view", "create", "edit", "delete"],
            reports: ["view", "export"],
            users: ["view", "create", "edit", "delete"],
            settings: ["view", "edit"],
        },
    },
    {
        id: 2,
        name: "Manager",
        description: "Manage daily business operations.",
        users: 1,
        color: "blue",
        permissions: {
            dashboard: ["view"],
            inventory: ["view", "create", "edit"],
            sales: ["view", "create", "edit"],
            purchases: ["view", "create", "edit"],
            customers: ["view", "create", "edit"],
            suppliers: ["view", "create", "edit"],
            expenses: ["view", "create"],
            reports: ["view", "export"],
            users: ["view"],
            settings: ["view"],
        },
    },
    {
        id: 3,
        name: "Cashier",
        description: "Handle sales and customer transactions.",
        users: 2,
        color: "purple",
        permissions: {
            dashboard: ["view"],
            inventory: ["view"],
            sales: ["view", "create"],
            purchases: [],
            customers: ["view", "create"],
            suppliers: [],
            expenses: [],
            reports: [],
            users: [],
            settings: [],
        },
    },
    {
        id: 4,
        name: "Inventory Manager",
        description: "Manage products, stock and purchases.",
        users: 1,
        color: "orange",
        permissions: {
            dashboard: ["view"],
            inventory: ["view", "create", "edit", "delete"],
            sales: ["view"],
            purchases: ["view", "create", "edit"],
            customers: ["view"],
            suppliers: ["view", "create", "edit"],
            expenses: [],
            reports: ["view"],
            users: [],
            settings: [],
        },
    },
    {
        id: 5,
        name: "Sales Staff",
        description: "Handle sales and customer management.",
        users: 1,
        color: "gold",
        permissions: {
            dashboard: ["view"],
            inventory: ["view"],
            sales: ["view", "create"],
            purchases: [],
            customers: ["view", "create", "edit"],
            suppliers: [],
            expenses: [],
            reports: [],
            users: [],
            settings: [],
        },
    },
];

const modules = [
    "dashboard",
    "inventory",
    "sales",
    "purchases",
    "customers",
    "suppliers",
    "expenses",
    "reports",
    "users",
    "settings",
];

const permissionLabels = {
    dashboard: "Dashboard",
    inventory: "Inventory",
    sales: "Sales",
    purchases: "Purchases",
    customers: "Customers",
    suppliers: "Suppliers",
    expenses: "Expenses",
    reports: "Reports",
    users: "Users & Roles",
    settings: "Settings",
};

const permissionTypes = ["view", "create", "edit", "delete", "export"];

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function getInitials(name) {
    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function roleBadge(role) {
    const styles = {
        Administrator: "bg-[#eaf5eb] text-[#245c30] border-[#d5e7d7]",
        Manager: "bg-blue-50 text-blue-700 border-blue-100",
        Cashier: "bg-purple-50 text-purple-700 border-purple-100",
        "Inventory Manager":
            "bg-orange-50 text-orange-700 border-orange-100",
        "Sales Staff": "bg-[#faf4df] text-[#9b7624] border-[#eadcb4]",
    };

    return styles[role] || "bg-gray-50 text-gray-600 border-gray-200";
}

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export default function UsersRoles() {
    const [activeTab, setActiveTab] = useState("users");
    const [Reg,{isSuccess,isLoading}]=useRegistrationMutation()
    const [users, setUsers] = useState(initialUsers);
    const [roles, setRoles] = useState(initialRoles);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [roleFilter, setRoleFilter] = useState("All");

    const [showUserModal, setShowUserModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showPermissions, setShowPermissions] = useState(false);

    const [editingUser, setEditingUser] = useState(null);
    const [editingRole, setEditingRole] = useState(null);
    
    const [openMenu, setOpenMenu] = useState(null);

    const [UserName,SetUserame]=useState('')
    const [Password,SetPassword]=useState('')
    const [Role,SetRole]=useState('')
    const [FirstName,SetFirstName]=useState('')
    const [LastName,SetLastName]=useState('')

    /*
    |--------------------------------------------------------------------------
    | User Filtering
    |--------------------------------------------------------------------------
    */

    useEffect(()=>{

        if(isSuccess){
            toast.success(`${form.name} is Created`)
        }

    },[isSuccess])

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const searchMatch =
                user.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                user.email
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                user.role
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const statusMatch =
                statusFilter === "All" ||
                user.status === statusFilter;

            const roleMatch =
                roleFilter === "All" ||
                user.role === roleFilter;

            return searchMatch && statusMatch && roleMatch;
        });
    }, [users, search, statusFilter, roleFilter]);

    /*
    |--------------------------------------------------------------------------
    | Stats
    |--------------------------------------------------------------------------
    */

    const activeUsers = users.filter(
        (user) => user.status === "Active"
    ).length;

    const inactiveUsers = users.filter(
        (user) => user.status === "Inactive"
    ).length;

    /*
    |--------------------------------------------------------------------------
    | User Actions
    |--------------------------------------------------------------------------
    */

    const toggleUserStatus = (id) => {
        setUsers((current) =>
            current.map((user) =>
                user.id === id
                    ? {
                          ...user,
                          status:
                              user.status === "Active"
                                  ? "Inactive"
                                  : "Active",
                      }
                    : user
            )
        );

        setOpenMenu(null);
    };

    const deleteUser = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmed) return;

        setUsers((current) =>
            current.filter((user) => user.id !== id)
        );

        setOpenMenu(null);
    };

    const editUser = (user) => {
        setEditingUser(user);
        setShowUserModal(true);
        setOpenMenu(null);
    };

    const addUser = () => {
        setEditingUser(null);
        setShowUserModal(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Save User
    |--------------------------------------------------------------------------
    */

    const saveUser = (form) => {
        if (editingUser) {
            setUsers((current) =>
                current.map((user) =>
                    user.id === editingUser.id
                        ? {
                              ...user,
                              ...form,
                              avatar: getInitials(
                                  form.name
                              ),
                          }
                        : user
                )
            );
        } else {
            setUsers((current) => [
                ...current,
                {
                    id: Date.now(),
                    ...form,
                    status: "Active",
                    lastLogin: "Never",
                    avatar: getInitials(form.name),
                },
            ]);
        }

        setShowUserModal(false);
        setEditingUser(null);
    };

    /*
    |--------------------------------------------------------------------------
    | Role Actions
    |--------------------------------------------------------------------------
    */

    const editRole = (role) => {
        setEditingRole(role);
        setShowRoleModal(true);
    };

    const deleteRole = (id) => {
        const confirmed = window.confirm(
            "Delete this role?"
        );

        if (!confirmed) return;

        setRoles((current) =>
            current.filter((role) => role.id !== id)
        );
    };

    const addRole = () => {
        setEditingRole(null);
        setShowRoleModal(true);
    };

    const saveRole = (roleData) => {
        if (editingRole) {
            setRoles((current) =>
                current.map((role) =>
                    role.id === editingRole.id
                        ? {
                              ...role,
                              ...roleData,
                          }
                        : role
                )
            );
        } else {
            setRoles((current) => [
                ...current,
                {
                    id: Date.now(),
                    ...roleData,
                    users: 0,
                    color: "green",
                },
            ]);
        }

        setShowRoleModal(false);
        setEditingRole(null);
    };

    return (
        <div className="min-h-screen bg-[#f7faf5] p-4 md:p-6 lg:p-8">
            <ToastContainer/>

            {/* =========================================================
                HEADER
            ========================================================== */}

            <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-[#b58a32]" />

                        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7b917d]">
                            Administration
                        </span>
                    </div>

                    <h1 className="font-serif text-3xl font-semibold text-[#1d3021]">
                        Users & Roles
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage staff accounts, roles and system
                        permissions.
                    </p>
                </div>

                <button
                    onClick={
                        activeTab === "users"
                            ? addUser
                            : addRole
                    }
                    className="
                        group
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        bg-[#245c30]
                        px-5
                        py-3
                        text-xs
                        font-semibold
                        text-white
                        shadow-[0_10px_25px_rgba(36,92,48,.18)]
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:bg-[#1d4e28]
                        active:scale-[.98]
                    "
                >
                    <Plus
                        size={16}
                        className="transition-transform duration-300 group-hover:rotate-90"
                    />

                    {activeTab === "users"
                        ? "Add User"
                        : "Create Role"}
                </button>

            </div>


            {/* =========================================================
                STATISTICS
            ========================================================== */}

            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    icon={Users}
                    title="Total Users"
                    value={users.length}
                    description="Registered staff"
                />

                <StatCard
                    icon={UserCheck}
                    title="Active Users"
                    value={activeUsers}
                    description="Currently active"
                    iconClass="text-[#2e713b]"
                />

                <StatCard
                    icon={UserX}
                    title="Inactive"
                    value={inactiveUsers}
                    description="Disabled accounts"
                    iconClass="text-[#a37b27]"
                />

                <StatCard
                    icon={ShieldCheck}
                    title="Roles"
                    value={roles.length}
                    description="Access levels"
                    iconClass="text-purple-600"
                />

            </div>


            {/* =========================================================
                MAIN CARD
            ========================================================== */}

            <div
                className="
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-[#e3e9df]
                    bg-white
                    shadow-[0_15px_60px_rgba(31,67,35,.06)]
                "
            >

                {/* =====================================================
                    TABS
                ====================================================== */}

                <div className="border-b border-[#edf1ea] px-5 pt-5 md:px-7">

                    <div className="flex gap-7">

                        <TabButton
                            active={activeTab === "users"}
                            onClick={() =>
                                setActiveTab("users")
                            }
                            icon={Users}
                        >
                            Users
                        </TabButton>

                        <TabButton
                            active={activeTab === "roles"}
                            onClick={() =>
                                setActiveTab("roles")
                            }
                            icon={ShieldCheck}
                        >
                            Roles & Permissions
                        </TabButton>

                    </div>

                </div>


                {/* =====================================================
                    USERS
                ====================================================== */}

                {activeTab === "users" && (
                    <>

                        {/* Filters */}

                        <div className="flex flex-col gap-4 border-b border-[#edf1ea] p-5 md:flex-row md:items-center md:justify-between md:px-7">

                            <div className="relative w-full md:max-w-sm">

                                <Search
                                    size={16}
                                    className="
                                        absolute
                                        left-3.5
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-400
                                    "
                                />

                                <input
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search users..."
                                    className="
                                        h-11
                                        w-full
                                        rounded-xl
                                        border
                                        border-[#e2e8df]
                                        bg-[#fafcf9]
                                        pl-10
                                        pr-4
                                        text-xs
                                        outline-none
                                        transition
                                        focus:border-[#9db69b]
                                        focus:ring-4
                                        focus:ring-[#dcebd6]/50
                                    "
                                />

                            </div>


                            <div className="flex flex-wrap gap-2">

                                <FilterSelect
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    options={[
                                        "All",
                                        "Active",
                                        "Inactive",
                                    ]}
                                />

                                <FilterSelect
                                    value={roleFilter}
                                    onChange={setRoleFilter}
                                    options={[
                                        "All",
                                        ...roles.map(
                                            (role) =>
                                                role.name
                                        ),
                                    ]}
                                />

                            </div>

                        </div>


                        {/* User table */}

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[900px]">

                                <thead>
                                    <tr className="border-b border-[#edf1ea] bg-[#fafcf9]">

                                        <TableHead>
                                            User
                                        </TableHead>

                                        <TableHead>
                                            Role
                                        </TableHead>

                                        <TableHead>
                                            Branch
                                        </TableHead>

                                        <TableHead>
                                            Status
                                        </TableHead>

                                        <TableHead>
                                            Last Login
                                        </TableHead>

                                        <TableHead align="right">
                                            Action
                                        </TableHead>

                                    </tr>
                                </thead>

                                <tbody>

                                    {filteredUsers.map(
                                        (user) => (
                                            <UserRow
                                                key={user.id}
                                                user={user}
                                                openMenu={
                                                    openMenu
                                                }
                                                setOpenMenu={
                                                    setOpenMenu
                                                }
                                                onEdit={
                                                    editUser
                                                }
                                                onToggle={
                                                    toggleUserStatus
                                                }
                                                onDelete={
                                                    deleteUser
                                                }
                                            />
                                        )
                                    )}

                                </tbody>

                            </table>


                            {filteredUsers.length === 0 && (
                                <EmptyState
                                    icon={Users}
                                    title="No users found"
                                    description="Try changing your search or filters."
                                />
                            )}

                        </div>

                    </>
                )}


                {/* =====================================================
                    ROLES
                ====================================================== */}

                {activeTab === "roles" && (
                    <div className="p-5 md:p-7">

                        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                            <div>
                                <h2 className="text-sm font-semibold text-[#243629]">
                                    System Roles
                                </h2>

                                <p className="mt-1 text-xs text-gray-400">
                                    Control what each role can
                                    access.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setShowPermissions(
                                        !showPermissions
                                    )
                                }
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-[#dfe8db]
                                    px-4
                                    py-2.5
                                    text-[11px]
                                    font-semibold
                                    text-[#49634c]
                                    transition
                                    hover:bg-[#f5f9f3]
                                "
                            >
                                <Settings2 size={14} />

                                Permission Matrix
                            </button>

                        </div>


                        {!showPermissions ? (
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                                {roles.map((role) => (
                                    <RoleCard
                                        key={role.id}
                                        role={role}
                                        onEdit={editRole}
                                        onDelete={deleteRole}
                                        onPermissions={() => {
                                            setEditingRole(
                                                role
                                            );
                                            setShowPermissions(
                                                true
                                            );
                                        }}
                                    />
                                ))}

                            </div>
                        ) : (
                            <PermissionMatrix
                                roles={roles}
                                setRoles={setRoles}
                            />
                        )}

                    </div>
                )}

            </div>


            {/* =========================================================
                FOOTER
            ========================================================== */}

            <div className="mt-6 flex items-center justify-center gap-2 text-[9px] font-medium uppercase tracking-[0.16em] text-gray-400">

                <Leaf
                    size={11}
                    className="text-[#7fa37b]"
                />

                Almalik Herbal Center

                <Leaf
                    size={11}
                    className="rotate-180 text-[#7fa37b]"
                />

            </div>


            {/* =========================================================
                MODALS
            ========================================================== */}

            {showUserModal && (
                <UserModal
                    Reg={Reg}
                    user={editingUser}
                    roles={roles}
                    onClose={() => {
                        setShowUserModal(false);
                        setEditingUser(null);
                    }}
                    onSave={saveUser}
                />
            )}

            {showRoleModal && (
                <RoleModal
                    role={editingRole}
                    onClose={() => {
                        setShowRoleModal(false);
                        setEditingRole(null);
                    }}
                    onSave={saveRole}
                />
            )}

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Stat Card
|--------------------------------------------------------------------------
*/

function StatCard({
    icon: Icon,
    title,
    value,
    description,
    iconClass = "text-[#245c30]",
}) {
    return (
        <div
            className="
                group
                rounded-[22px]
                border
                border-[#e3e9df]
                bg-white
                p-5
                shadow-[0_10px_35px_rgba(31,67,35,.04)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_15px_45px_rgba(31,67,35,.08)]
            "
        >

            <div className="flex items-start justify-between">

                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                        {title}
                    </p>

                    <p className="mt-2 font-serif text-3xl font-semibold text-[#243629]">
                        {value}
                    </p>

                    <p className="mt-1 text-[10px] text-gray-400">
                        {description}
                    </p>
                </div>

                <div
                    className={`
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-2xl
                        bg-[#f0f6ed]
                        ${iconClass}
                        transition-transform
                        duration-300
                        group-hover:scale-110
                    `}
                >
                    <Icon size={19} />
                </div>

            </div>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Tab Button
|--------------------------------------------------------------------------
*/

function TabButton({
    active,
    onClick,
    icon: Icon,
    children,
}) {
    return (
        <button
            onClick={onClick}
            className={`
                relative
                flex
                items-center
                gap-2
                pb-4
                text-xs
                font-semibold
                transition
                ${
                    active
                        ? "text-[#245c30]"
                        : "text-gray-400 hover:text-gray-600"
                }
            `}
        >

            <Icon size={15} />

            {children}

            {active && (
                <span
                    className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        h-[2px]
                        rounded-full
                        bg-[#245c30]
                    "
                />
            )}

        </button>
    );
}


/*
|--------------------------------------------------------------------------
| Table Head
|--------------------------------------------------------------------------
*/

function TableHead({ children, align = "left" }) {
    return (
        <th
            className={`
                px-5
                py-3.5
                text-[9px]
                font-bold
                uppercase
                tracking-[0.13em]
                text-gray-400
                ${
                    align === "right"
                        ? "text-right"
                        : "text-left"
                }
            `}
        >
            {children}
        </th>
    );
}


/*
|--------------------------------------------------------------------------
| User Row
|--------------------------------------------------------------------------
*/

function UserRow({
    user,
    openMenu,
    setOpenMenu,
    onEdit,
    onToggle,
    onDelete,
}) {
    return (
        <tr
            className="
                group
                border-b
                border-[#f0f3ee]
                transition-colors
                hover:bg-[#fafcf9]
            "
        >

            {/* User */}

            <td className="px-5 py-4">

                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-[#eaf4e7]
                            text-[11px]
                            font-bold
                            text-[#2d6937]
                        "
                    >
                        {user.avatar}
                    </div>

                    <div>

                        <p className="text-xs font-semibold text-[#26392a]">
                            {user.name}
                        </p>

                        <p className="mt-0.5 text-[10px] text-gray-400">
                            {user.email}
                        </p>

                    </div>

                </div>

            </td>


            {/* Role */}

            <td className="px-5 py-4">

                <span
                    className={`
                        inline-flex
                        items-center
                        rounded-lg
                        border
                        px-2.5
                        py-1
                        text-[9px]
                        font-semibold
                        ${roleBadge(user.role)}
                    `}
                >
                    {user.role}
                </span>

            </td>


            {/* Branch */}

            <td className="px-5 py-4">

                <div className="flex items-center gap-2 text-xs text-gray-500">

                    <Building2
                        size={13}
                        className="text-gray-400"
                    />

                    {user.branch}

                </div>

            </td>


            {/* Status */}

            <td className="px-5 py-4">

                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold">

                    <span
                        className={`
                            h-1.5
                            w-1.5
                            rounded-full
                            ${
                                user.status === "Active"
                                    ? "bg-[#4d8a55]"
                                    : "bg-gray-300"
                            }
                        `}
                    />

                    <span
                        className={
                            user.status === "Active"
                                ? "text-[#4d8a55]"
                                : "text-gray-400"
                        }
                    >
                        {user.status}
                    </span>

                </span>

            </td>


            {/* Last Login */}

            <td className="px-5 py-4">

                <div className="flex items-center gap-2 text-[10px] text-gray-400">

                    <Clock3 size={12} />

                    {user.lastLogin}

                </div>

            </td>


            {/* Actions */}

            <td className="relative px-5 py-4 text-right">

                <button
                    onClick={() =>
                        setOpenMenu(
                            openMenu === user.id
                                ? null
                                : user.id
                        )
                    }
                    className="
                        inline-flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        text-gray-400
                        transition
                        hover:bg-[#eef4eb]
                        hover:text-[#245c30]
                    "
                >
                    <MoreHorizontal size={17} />
                </button>


                {openMenu === user.id && (
                    <div
                        className="
                            absolute
                            right-5
                            top-14
                            z-30
                            w-44
                            overflow-hidden
                            rounded-2xl
                            border
                            border-[#e1e8de]
                            bg-white
                            p-1.5
                            text-left
                            shadow-[0_20px_50px_rgba(0,0,0,.12)]
                            animate-[menuIn_.15s_ease-out]
                        "
                    >

                        <ActionMenuItem
                            icon={Edit3}
                            onClick={() =>
                                onEdit(user)
                            }
                        >
                            Edit User
                        </ActionMenuItem>

                        <ActionMenuItem
                            icon={KeyRound}
                            onClick={() => {
                                alert(
                                    "Password reset link would be sent here."
                                );
                                setOpenMenu(null);
                            }}
                        >
                            Reset Password
                        </ActionMenuItem>

                        <ActionMenuItem
                            icon={
                                user.status === "Active"
                                    ? UserX
                                    : UserCheck
                            }
                            onClick={() =>
                                onToggle(user.id)
                            }
                        >
                            {user.status === "Active"
                                ? "Deactivate"
                                : "Activate"}
                        </ActionMenuItem>

                        <div className="my-1 border-t border-[#edf1ea]" />

                        <ActionMenuItem
                            danger
                            icon={Trash2}
                            onClick={() =>
                                onDelete(user.id)
                            }
                        >
                            Delete User
                        </ActionMenuItem>

                    </div>
                )}

            </td>

        </tr>
    );
}


/*
|--------------------------------------------------------------------------
| Action Menu Item
|--------------------------------------------------------------------------
*/

function ActionMenuItem({
    icon: Icon,
    children,
    onClick,
    danger = false,
}) {
    return (
        <button
            onClick={onClick}
            className={`
                flex
                w-full
                items-center
                gap-2.5
                rounded-xl
                px-3
                py-2.5
                text-[10px]
                font-medium
                transition
                ${
                    danger
                        ? "text-red-500 hover:bg-red-50"
                        : "text-gray-600 hover:bg-[#f3f7f1] hover:text-[#245c30]"
                }
            `}
        >
            <Icon size={14} />

            {children}
        </button>
    );
}


/*
|--------------------------------------------------------------------------
| Filter Select
|--------------------------------------------------------------------------
*/

function FilterSelect({
    value,
    onChange,
    options,
}) {
    return (
        <div className="relative">

            <select
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="
                    h-10
                    appearance-none
                    rounded-xl
                    border
                    border-[#e1e8de]
                    bg-white
                    pl-3
                    pr-9
                    text-[10px]
                    font-medium
                    text-gray-600
                    outline-none
                    transition
                    focus:border-[#9db69b]
                "
            >
                {options.map((option) => (
                    <option
                        key={option}
                        value={option}
                    >
                        {option === "All"
                            ? "All"
                            : option}
                    </option>
                ))}
            </select>

            <ChevronDown
                size={13}
                className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                "
            />

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Role Card
|--------------------------------------------------------------------------
*/

function RoleCard({
    role,
    onEdit,
    onDelete,
    onPermissions,
}) {
    return (
        <div
            className="
                group
                rounded-[22px]
                border
                border-[#e4eae0]
                bg-[#fcfdfb]
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white
                hover:shadow-[0_15px_45px_rgba(31,67,35,.07)]
            "
        >

            <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-2xl
                            bg-[#eaf4e7]
                            text-[#245c30]
                        "
                    >
                        <ShieldCheck size={19} />
                    </div>

                    <div>

                        <h3 className="text-sm font-semibold text-[#26392a]">
                            {role.name}
                        </h3>

                        <p className="mt-1 text-[10px] text-gray-400">
                            {role.users}{" "}
                            {role.users === 1
                                ? "user"
                                : "users"}
                        </p>

                    </div>

                </div>


                <div className="flex items-center gap-1">

                    <button
                        onClick={() =>
                            onEdit(role)
                        }
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            text-gray-400
                            transition
                            hover:bg-[#eef4eb]
                            hover:text-[#245c30]
                        "
                    >
                        <Edit3 size={14} />
                    </button>

                    <button
                        onClick={() =>
                            onDelete(role.id)
                        }
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            text-gray-400
                            transition
                            hover:bg-red-50
                            hover:text-red-500
                        "
                    >
                        <Trash2 size={14} />
                    </button>

                </div>

            </div>


            <p className="mt-4 min-h-[35px] text-[11px] leading-5 text-gray-500">
                {role.description}
            </p>


            {/* Permission preview */}

            <div className="mt-5 flex flex-wrap gap-1.5">

                {modules
                    .filter(
                        (module) =>
                            role.permissions[module]
                                ?.length > 0
                    )
                    .slice(0, 5)
                    .map((module) => (
                        <span
                            key={module}
                            className="
                                rounded-lg
                                border
                                border-[#e3eadf]
                                bg-white
                                px-2
                                py-1
                                text-[8px]
                                font-medium
                                text-gray-500
                            "
                        >
                            {permissionLabels[module]}
                        </span>
                    ))}

                {modules.filter(
                    (module) =>
                        role.permissions[module]
                            ?.length > 0
                ).length > 5 && (
                    <span className="rounded-lg bg-[#edf4e9] px-2 py-1 text-[8px] font-semibold text-[#527157]">
                        +
                        {modules.filter(
                            (module) =>
                                role.permissions[
                                    module
                                ]?.length > 0
                        ).length - 5}{" "}
                        more
                    </span>
                )}

            </div>


            <button
                onClick={onPermissions}
                className="
                    mt-5
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-[#dfe8db]
                    bg-white
                    py-2.5
                    text-[10px]
                    font-semibold
                    text-[#49634c]
                    transition
                    hover:border-[#bfd1b9]
                    hover:bg-[#f4f8f2]
                "
            >
                <Shield size={13} />

                View Permissions
            </button>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Permission Matrix
|--------------------------------------------------------------------------
*/

function PermissionMatrix({
    roles,
    setRoles,
}) {
    const togglePermission = (
        roleId,
        module,
        permission
    ) => {
        setRoles((current) =>
            current.map((role) => {
                if (role.id !== roleId) {
                    return role;
                }

                const currentPermissions =
                    role.permissions[module] || [];

                const exists =
                    currentPermissions.includes(
                        permission
                    );

                return {
                    ...role,
                    permissions: {
                        ...role.permissions,
                        [module]: exists
                            ? currentPermissions.filter(
                                  (item) =>
                                      item !==
                                      permission
                              )
                            : [
                                  ...currentPermissions,
                                  permission,
                              ],
                    },
                };
            })
        );
    };

    return (
        <div>

            <div className="mb-5 flex items-center justify-between">

                <div>
                    <h3 className="text-sm font-semibold text-[#26392a]">
                        Permission Matrix
                    </h3>

                    <p className="mt-1 text-[10px] text-gray-400">
                        Configure module-level permissions
                        for each role.
                    </p>
                </div>

            </div>


            <div className="overflow-x-auto rounded-2xl border border-[#e4eae0]">

                <table className="w-full min-w-[900px]">

                    <thead>

                        <tr className="bg-[#fafcf9]">

                            <th className="border-b border-[#e8eee5] px-4 py-4 text-left text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                Module
                            </th>

                            {roles.map((role) => (
                                <th
                                    key={role.id}
                                    className="border-b border-[#e8eee5] px-4 py-4 text-center"
                                >
                                    <div className="text-[9px] font-bold text-[#3e5843]">
                                        {role.name}
                                    </div>
                                </th>
                            ))}

                        </tr>

                    </thead>

                    <tbody>

                        {modules.map((module) => (
                            <tr
                                key={module}
                                className="border-b border-[#edf1ea] last:border-0"
                            >

                                <td className="px-4 py-4">

                                    <div className="flex items-center gap-2">

                                        <div className="h-1.5 w-1.5 rounded-full bg-[#7fa37b]" />

                                        <span className="text-[10px] font-semibold text-[#405743]">
                                            {
                                                permissionLabels[
                                                    module
                                                ]
                                            }
                                        </span>

                                    </div>

                                </td>


                                {roles.map((role) => (
                                    <td
                                        key={role.id}
                                        className="px-4 py-4"
                                    >

                                        <div className="flex flex-wrap justify-center gap-1">

                                            {permissionTypes.map(
                                                (
                                                    permission
                                                ) => {
                                                    const active =
                                                        role
                                                            .permissions[
                                                            module
                                                        ]?.includes(
                                                            permission
                                                        );

                                                    return (
                                                        <button
                                                            key={
                                                                permission
                                                            }
                                                            onClick={() =>
                                                                togglePermission(
                                                                    role.id,
                                                                    module,
                                                                    permission
                                                                )
                                                            }
                                                            title={
                                                                permission
                                                            }
                                                            className={`
                                                                flex
                                                                h-6
                                                                min-w-6
                                                                items-center
                                                                justify-center
                                                                rounded-md
                                                                px-1.5
                                                                text-[7px]
                                                                font-bold
                                                                uppercase
                                                                transition
                                                                ${
                                                                    active
                                                                        ? "bg-[#e4f0e1] text-[#2d6937]"
                                                                        : "bg-[#f5f6f4] text-gray-300 hover:bg-[#edf1ea]"
                                                                }
                                                            `}
                                                        >
                                                            {permission.charAt(
                                                                0
                                                            )}
                                                        </button>
                                                    );
                                                }
                                            )}

                                        </div>

                                    </td>
                                ))}

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>


            <div className="mt-4 flex flex-wrap gap-4 text-[9px] text-gray-400">

                {permissionTypes.map((permission) => (
                    <div
                        key={permission}
                        className="flex items-center gap-1.5"
                    >
                        <span className="flex h-5 min-w-5 items-center justify-center rounded bg-[#e4f0e1] px-1 text-[7px] font-bold uppercase text-[#2d6937]">
                            {permission.charAt(0)}
                        </span>

                        {permission}
                    </div>
                ))}

            </div>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| User Modal
|--------------------------------------------------------------------------
*/

function UserModal({
    user,
    roles,
    Reg,
    onClose,
    onSave,
}) {
    
    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        Username: user?.Username || "",
        Password:user?.Password,
        role:
            user?.role ||
            roles[0]?.name ||
            "Cashier",
        branch: user?.branch || "Main Branch",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [password, setPassword] = useState("");

    const update = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    // const submit = async(e) => {
    //     alert("s")
    // }
    const Handlesubmit = async(e) => {
        e.preventDefault();
        try{

            // if (!form.name || !form.email) {
            //     toast.warn(
            //         "Please enter the user's name and email."
            //     );
            //     return;
            // }
            await Reg({UserName:form.email,Password:form?.Password,Role:form.role})
            console.log(form)
            // onSave(form);
        } catch(err:any){
            toast.error(err?.data?.message||err?.message)
        }
    };

    return (
        <Modal
            title={user ? "Edit User" : "Add New User"}
            description={
                user
                    ? "Update this staff account."
                    : "Create a new staff account."
            }
            onClose={onClose}
        >

            <form
                onSubmit={Handlesubmit}
                className="space-y-5"
            >

                <div className="grid gap-4 sm:grid-cols-2">

                    <InputField
                        label="Full Name"
                        icon={Users}
                        value={form.name}
                        onChange={(value) =>
                            update("name", value)
                        }
                        placeholder="e.g. Aisha Ibrahim"
                    />

                    <InputField
                        label="Username"
                        icon={User}
                        type="text"
                        value={form.Username}
                        onChange={(value) =>
                            update("Username", value)
                        }
                        placeholder="staff@almalik"
                    />

                    <InputField
                        label="Phone Number"
                        icon={Phone}
                        value={form.phone}
                        onChange={(value) =>
                            update("phone", value)
                        }
                        placeholder="+234..."
                    />


                    <SelectField
                        label="Role"
                        value={form.role}
                        onChange={(value) =>
                            update("role", value)
                        }
                        options={roles.map(
                            (role) => role.name
                        )}
                    />

                    {/* <SelectField
                        label="Branch"
                        value={form.branch}
                        onChange={(value) =>
                            update("branch", value)
                        }
                        options={[
                            "Main Branch",
                            "Katsina Branch",
                            "Secondary Branch",
                        ]}
                    /> */}

                </div>


                {!user && (
                    <div>

                        <label className="mb-2 block text-[10px] font-semibold text-gray-500">
                            Temporary Password
                        </label>

                        <div className="relative">

                            <Lock
                                size={14}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter temporary password"
                                className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-[#e1e8de]
                                    bg-[#fafcf9]
                                    pl-10
                                    pr-11
                                    text-xs
                                    outline-none
                                    focus:border-[#9db69b]
                                    focus:ring-4
                                    focus:ring-[#dcebd6]/50
                                "
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? (
                                    <EyeOff size={15} />
                                ) : (
                                    <Eye size={15} />
                                )}
                            </button>

                        </div>

                    </div>
                )}


                <div className="flex items-center justify-end gap-2 border-t border-[#edf1ea] pt-5">

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-xl
                            px-4
                            py-2.5
                            text-[10px]
                            font-semibold
                            text-gray-500
                            hover:bg-gray-100
                        "
                    >
                        Cancel
                    </button>

                    <button
                    onClick={Handlesubmit}
                        // type="submit"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-[#245c30]
                            px-5
                            py-2.5
                            text-[10px]
                            font-semibold
                            text-white
                            transition
                            hover:bg-[#1d4e28]
                        "
                    >
                        <Check size={14} />

                        {user
                            ? "Save Changes"
                            : "Create User"}
                    </button>

                </div>

            </form>

        </Modal>
    );
}


/*
|--------------------------------------------------------------------------
| Role Modal
|--------------------------------------------------------------------------
*/

function RoleModal({
    role,
    onClose,
    onSave,
}) {
    const [name, setName] = useState(
        role?.name || ""
    );

    const [description, setDescription] =
        useState(role?.description || "");

    const submit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Please enter a role name.");
            return;
        }

        onSave({
            name,
            description,
            permissions:
                role?.permissions || {
                    dashboard: ["view"],
                    inventory: [],
                    sales: [],
                    purchases: [],
                    customers: [],
                    suppliers: [],
                    expenses: [],
                    reports: [],
                    users: [],
                    settings: [],
                },
        });
    };

    return (
        <Modal
            title={role ? "Edit Role" : "Create Role"}
            description="Define an access level for your staff."
            onClose={onClose}
        >

            <form
                onSubmit={submit}
                className="space-y-5"
            >

                <InputField
                    label="Role Name"
                    icon={Shield}
                    value={name}
                    onChange={setName}
                    placeholder="e.g. Sales Supervisor"
                />

                <div>

                    <label className="mb-2 block text-[10px] font-semibold text-gray-500">
                        Description
                    </label>

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                        rows={4}
                        placeholder="Describe what this role is responsible for..."
                        className="
                            w-full
                            resize-none
                            rounded-xl
                            border
                            border-[#e1e8de]
                            bg-[#fafcf9]
                            px-4
                            py-3
                            text-xs
                            outline-none
                            focus:border-[#9db69b]
                            focus:ring-4
                            focus:ring-[#dcebd6]/50
                        "
                    />

                </div>


                <div className="rounded-xl border border-[#e2e9df] bg-[#f8fbf6] p-4">

                    <div className="flex gap-3">

                        <AlertCircle
                            size={16}
                            className="mt-0.5 shrink-0 text-[#7c9a79]"
                        />

                        <p className="text-[10px] leading-5 text-gray-500">
                            After creating the role, you can
                            configure detailed permissions
                            from the Permission Matrix.
                        </p>

                    </div>

                </div>


                <div className="flex items-center justify-end gap-2 border-t border-[#edf1ea] pt-5">

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-xl
                            px-4
                            py-2.5
                            text-[10px]
                            font-semibold
                            text-gray-500
                            hover:bg-gray-100
                        "
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-[#245c30]
                            px-5
                            py-2.5
                            text-[10px]
                            font-semibold
                            text-white
                            hover:bg-[#1d4e28]
                        "
                    >
                        <Check size={14} />

                        {role
                            ? "Save Role"
                            : "Create Role"}
                    </button>

                </div>

            </form>

        </Modal>
    );
}


/*
|--------------------------------------------------------------------------
| Input Field
|--------------------------------------------------------------------------
*/

function InputField({
    label,
    icon: Icon,
    value,
    onChange,
    placeholder,
    type = "text",
}) {
    return (
        <div>

            <label className="mb-2 block text-[10px] font-semibold text-gray-500">
                {label}
            </label>

            <div className="relative">

                <Icon
                    size={14}
                    className="
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                    "
                />

                <input
                    type={type}
                    value={value}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                    placeholder={placeholder}
                    className="
                        h-11
                        w-full
                        rounded-xl
                        border
                        border-[#e1e8de]
                        bg-[#fafcf9]
                        pl-10
                        pr-4
                        text-xs
                        outline-none
                        transition
                        focus:border-[#9db69b]
                        focus:ring-4
                        focus:ring-[#dcebd6]/50
                    "
                />

            </div>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Select Field
|--------------------------------------------------------------------------
*/

function SelectField({
    label,
    value,
    onChange,
    options,
}) {
    return (
        <div>

            <label className="mb-2 block text-[10px] font-semibold text-gray-500">
                {label}
            </label>

            <div className="relative">

                <select
                    value={value}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                    className="
                        h-11
                        w-full
                        appearance-none
                        rounded-xl
                        border
                        border-[#e1e8de]
                        bg-[#fafcf9]
                        px-4
                        pr-10
                        text-xs
                        outline-none
                        focus:border-[#9db69b]
                        focus:ring-4
                        focus:ring-[#dcebd6]/50
                    "
                >

                    {options.map((option) => (
                        <option
                            key={option}
                            value={option}
                        >
                            {option}
                        </option>
                    ))}

                </select>

                <ChevronDown
                    size={14}
                    className="
                        pointer-events-none
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                    "
                />

            </div>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Modal
|--------------------------------------------------------------------------
*/

function Modal({
    title,
    description,
    onClose,
    children,
}) {
    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-[#142018]/40
                p-4
                backdrop-blur-sm
                animate-[fadeIn_.2s_ease-out]
            "
        >

            <div
                className="
                    max-h-[90vh]
                    w-full
                    max-w-2xl
                    overflow-y-auto
                    rounded-[28px]
                    border
                    border-[#e1e8de]
                    bg-white
                    shadow-[0_30px_100px_rgba(0,0,0,.18)]
                    animate-[modalIn_.25s_cubic-bezier(.16,1,.3,1)]
                "
            >

                {/* Header */}

                <div className="flex items-start justify-between border-b border-[#edf1ea] px-6 py-5">

                    <div>

                        <h2 className="font-serif text-xl font-semibold text-[#26392a]">
                            {title}
                        </h2>

                        <p className="mt-1 text-[10px] text-gray-400">
                            {description}
                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            text-gray-400
                            transition
                            hover:bg-gray-100
                            hover:text-gray-600
                        "
                    >
                        <X size={17} />
                    </button>

                </div>


                {/* Body */}

                <div className="p-6">

                    {children}

                </div>

            </div>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

function EmptyState({
    icon: Icon,
    title,
    description,
}) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4e9] text-[#7b9878]">
                <Icon size={24} />
            </div>

            <h3 className="text-sm font-semibold text-[#354a38]">
                {title}
            </h3>

            <p className="mt-1 max-w-xs text-[10px] leading-5 text-gray-400">
                {description}
            </p>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Animations
|--------------------------------------------------------------------------
*/

const animationStyles = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    @keyframes modalIn {
        from {
            opacity: 0;
            transform: scale(.95) translateY(15px);
        }

        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    @keyframes menuIn {
        from {
            opacity: 0;
            transform: translateY(-5px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }


/*
|--------------------------------------------------------------------------
| Inject animations
|--------------------------------------------------------------------------
*/

if (
    typeof document !== "undefined" &&
    !document.getElementById("almalik-users-roles-animations")
) {
    const style = document.createElement("style");

    style.id =
        "almalik-users-roles-animations";

    style.innerHTML = animationStyles;

    document.head.appendChild(style);
}
`
