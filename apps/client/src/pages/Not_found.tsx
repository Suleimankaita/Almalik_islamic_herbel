
import React from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Home,
    Leaf,
    Search,
    Sparkles,
} from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f7faf5] text-[#1d3021]">

            {/* =====================================================
                BACKGROUND
            ====================================================== */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">

                {/* Main glow */}
                <div
                    className="
                        absolute
                        left-1/2
                        top-1/2
                        h-[500px]
                        w-[500px]
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-[#dcebd6]
                        opacity-50
                        blur-[120px]
                        animate-pulse
                    "
                />

                {/* Top left glow */}
                <div
                    className="
                        absolute
                        -left-32
                        -top-32
                        h-[420px]
                        w-[420px]
                        rounded-full
                        bg-[#e7f0df]
                        opacity-70
                        blur-[100px]
                        animate-[float_9s_ease-in-out_infinite]
                    "
                />

                {/* Bottom right glow */}
                <div
                    className="
                        absolute
                        -bottom-40
                        -right-32
                        h-[450px]
                        w-[450px]
                        rounded-full
                        bg-[#edf3df]
                        opacity-80
                        blur-[110px]
                        animate-[floatReverse_11s_ease-in-out_infinite]
                    "
                />

                {/* Floating leaves */}

                <Leaf
                    size={45}
                    strokeWidth={1}
                    className="
                        absolute
                        left-[8%]
                        top-[18%]
                        rotate-[-25deg]
                        text-[#8cab84]
                        opacity-30
                        animate-[leafFloat_7s_ease-in-out_infinite]
                    "
                />

                <Leaf
                    size={60}
                    strokeWidth={1}
                    className="
                        absolute
                        right-[10%]
                        top-[14%]
                        rotate-45
                        text-[#789b72]
                        opacity-20
                        animate-[leafFloat_9s_ease-in-out_infinite_reverse]
                    "
                />

                <Leaf
                    size={32}
                    strokeWidth={1}
                    className="
                        absolute
                        bottom-[18%]
                        left-[13%]
                        rotate-45
                        text-[#9ab692]
                        opacity-30
                        animate-[leafFloat_8s_ease-in-out_infinite_reverse]
                    "
                />

                <Leaf
                    size={48}
                    strokeWidth={1}
                    className="
                        absolute
                        bottom-[13%]
                        right-[15%]
                        rotate-[110deg]
                        text-[#829e7c]
                        opacity-25
                        animate-[leafFloat_10s_ease-in-out_infinite]
                    "
                />

                {/* Tiny floating particles */}

                <span className="absolute left-[22%] top-[30%] h-1.5 w-1.5 rounded-full bg-[#b58a32] opacity-50 animate-[particle_4s_ease-in-out_infinite]" />

                <span className="absolute right-[25%] top-[38%] h-2 w-2 rounded-full bg-[#5b8d5f] opacity-30 animate-[particle_5s_ease-in-out_infinite_reverse]" />

                <span className="absolute bottom-[28%] left-[30%] h-1 w-1 rounded-full bg-[#b58a32] opacity-50 animate-[particle_6s_ease-in-out_infinite]" />

            </div>


            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <main className="relative z-10 flex min-h-screen items-center justify-center px-5 py-12">

                <div className="w-full max-w-2xl text-center">

                    {/* =================================================
                        BRAND
                    ================================================== */}

                    <div
                        className="
                            mb-8
                            flex
                            flex-col
                            items-center
                            animate-[fadeDown_.8s_ease-out]
                        "
                    >

                        {/* Logo */}

                        <div className="relative mb-4">

                            {/* rotating outer ring */}

                            <div
                                className="
                                    absolute
                                    -inset-4
                                    rounded-[28px]
                                    border
                                    border-[#c9dcc2]
                                    opacity-50
                                    animate-[spin_12s_linear_infinite]
                                "
                            />

                            {/* second ring */}

                            <div
                                className="
                                    absolute
                                    -inset-7
                                    rounded-[34px]
                                    border
                                    border-dashed
                                    border-[#dce8d7]
                                    opacity-60
                                    animate-[spinReverse_18s_linear_infinite]
                                "
                            />

                            <div
                                className="
                                    relative
                                    flex
                                    h-16
                                    w-16
                                    items-center
                                    justify-center
                                    rounded-[21px]
                                    border
                                    border-[#dce8d7]
                                    bg-white/90
                                    shadow-[0_15px_45px_rgba(34,85,42,0.12)]
                                    backdrop-blur
                                "
                            >
                                <div
                                    className="
                                        absolute
                                        inset-2
                                        rounded-[15px]
                                        bg-[#edf5e9]
                                    "
                                />

                                <Leaf
                                    size={30}
                                    strokeWidth={1.5}
                                    className="
                                        relative
                                        z-10
                                        text-[#245c30]
                                        animate-[leafPulse_3s_ease-in-out_infinite]
                                    "
                                />
                            </div>

                        </div>


                        {/* Brand name */}

                        <h2
                            className="
                                font-serif
                                text-xl
                                font-semibold
                                tracking-[0.22em]
                                text-[#1d4e28]
                            "
                        >
                            ALMALIK
                        </h2>

                        <span
                            className="
                                mt-[-2px]
                                text-[9px]
                                font-bold
                                tracking-[0.45em]
                                text-[#b58a32]
                            "
                        >
                            HERBEL
                        </span>

                    </div>


                    {/* =================================================
                        404 CARD
                    ================================================== */}

                    <section
                        className="
                            relative
                            overflow-hidden
                            rounded-[36px]
                            border
                            border-[#e1e9dd]
                            bg-white/75
                            px-6
                            py-10
                            shadow-[0_30px_100px_rgba(31,67,35,0.10)]
                            backdrop-blur-2xl
                            animate-[scaleIn_.8s_cubic-bezier(.16,1,.3,1)]
                            sm:px-12
                            sm:py-14
                        "
                    >

                        {/* Card glow */}

                        <div
                            className="
                                pointer-events-none
                                absolute
                                left-1/2
                                top-0
                                h-40
                                w-72
                                -translate-x-1/2
                                rounded-full
                                bg-[#dcebd6]
                                opacity-40
                                blur-[70px]
                            "
                        />

                        {/* Decorative corner */}

                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-16
                                -top-16
                                h-32
                                w-32
                                rounded-full
                                border
                                border-[#d9e7d3]
                                opacity-50
                            "
                        />

                        <div
                            className="
                                pointer-events-none
                                absolute
                                -bottom-20
                                -left-20
                                h-40
                                w-40
                                rounded-full
                                border
                                border-[#e5eadf]
                                opacity-50
                            "
                        />


                        {/* =================================================
                            404 NUMBER
                        ================================================== */}

                        <div className="relative">

                            <div
                                className="
                                    select-none
                                    font-serif
                                    text-[110px]
                                    font-bold
                                    leading-none
                                    tracking-[-0.08em]
                                    text-[#245c30]
                                    drop-shadow-[0_10px_30px_rgba(36,92,48,0.12)]
                                    animate-[numberFloat_5s_ease-in-out_infinite]
                                    sm:text-[150px]
                                "
                            >
                                404
                            </div>

                            {/* Gold underline */}

                            <div className="mx-auto mt-3 h-[3px] w-16 overflow-hidden rounded-full bg-[#e6eadf]">
                                <div
                                    className="
                                        h-full
                                        w-1/2
                                        rounded-full
                                        bg-[#b58a32]
                                        animate-[lineMove_2s_ease-in-out_infinite]
                                    "
                                />
                            </div>

                        </div>


                        {/* =================================================
                            MESSAGE
                        ================================================== */}

                        <div
                            className="
                                relative
                                mt-8
                                animate-[fadeUp_1s_.15s_ease-out_both]
                            "
                        >

                            <div className="mb-3 flex items-center justify-center gap-2">

                                <Sparkles
                                    size={15}
                                    className="text-[#b58a32]"
                                />

                                <span
                                    className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-[0.25em]
                                        text-[#789076]
                                    "
                                >
                                    Page Not Found
                                </span>

                                <Sparkles
                                    size={15}
                                    className="text-[#b58a32]"
                                />

                            </div>


                            <h1
                                className="
                                    font-serif
                                    text-2xl
                                    font-semibold
                                    text-[#1d3021]
                                    sm:text-3xl
                                "
                            >
                                This path has wandered away.
                            </h1>


                            <p
                                className="
                                    mx-auto
                                    mt-4
                                    max-w-md
                                    text-sm
                                    leading-7
                                    text-gray-500
                                "
                            >
                                The page you're looking for doesn't exist,
                                may have been moved, or the address might
                                have been entered incorrectly.
                            </p>

                        </div>


                        {/* =================================================
                            ACTIONS
                        ================================================== */}

                        <div
                            className="
                                relative
                                mt-9
                                flex
                                flex-col
                                items-center
                                justify-center
                                gap-3
                                animate-[fadeUp_1s_.3s_ease-out_both]
                                sm:flex-row
                            "
                        >

                            {/* Home */}

                            <Link
                                to="/"
                                className="
                                    group
                                    inline-flex
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2.5
                                    rounded-2xl
                                    bg-[#245c30]
                                    px-6
                                    py-3.5
                                    text-xs
                                    font-semibold
                                    text-white
                                    shadow-[0_10px_30px_rgba(36,92,48,0.20)]
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:bg-[#1d4e28]
                                    hover:shadow-[0_15px_35px_rgba(36,92,48,0.25)]
                                    active:scale-[.97]
                                    sm:w-auto
                                "
                            >
                                <Home
                                    size={15}
                                    className="
                                        transition-transform
                                        duration-300
                                        group-hover:scale-110
                                    "
                                />

                                Back to Home
                            </Link>


                            {/* Back */}

                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="
                                    group
                                    inline-flex
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2.5
                                    rounded-2xl
                                    border
                                    border-[#dce6d8]
                                    bg-white/80
                                    px-6
                                    py-3.5
                                    text-xs
                                    font-semibold
                                    text-[#36563b]
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:border-[#c5d7bf]
                                    hover:bg-[#f5f9f3]
                                    active:scale-[.97]
                                    sm:w-auto
                                "
                            >
                                <ArrowLeft
                                    size={15}
                                    className="
                                        transition-transform
                                        duration-300
                                        group-hover:-translate-x-1
                                    "
                                />

                                Go Back
                            </button>

                        </div>


                        {/* =================================================
                            SEARCH HINT
                        ================================================== */}

                        <div
                            className="
                                relative
                                mx-auto
                                mt-8
                                flex
                                max-w-sm
                                items-center
                                justify-center
                                gap-2
                                border-t
                                border-[#edf1ea]
                                pt-6
                                text-[10px]
                                text-gray-400
                                animate-[fadeUp_1s_.45s_ease-out_both]
                            "
                        >

                            <Search size={12} />

                            <span>
                                Check the URL and try again
                            </span>

                        </div>

                    </section>


                    {/* =================================================
                        FOOTER
                    ================================================== */}

                    <div
                        className="
                            mt-7
                            flex
                            items-center
                            justify-center
                            gap-2
                            text-[9px]
                            font-medium
                            tracking-[0.16em]
                            text-gray-400
                            animate-[fadeUp_1s_.6s_ease-out_both]
                        "
                    >
                        <Leaf
                            size={11}
                            className="text-[#7fa37b]"
                        />

                        <span>
                            NATURE'S WISDOM • YOUR WELLNESS
                        </span>

                        <Leaf
                            size={11}
                            className="rotate-180 text-[#7fa37b]"
                        />
                    </div>

                </div>

            </main>


            {/* =====================================================
                ANIMATIONS
            ====================================================== */}

            <style>
                {`
                    @keyframes float {
                        0%, 100% {
                            transform: translate3d(0, 0, 0);
                        }

                        50% {
                            transform: translate3d(35px, 25px, 0);
                        }
                    }

                    @keyframes floatReverse {
                        0%, 100% {
                            transform: translate3d(0, 0, 0);
                        }

                        50% {
                            transform: translate3d(-35px, -25px, 0);
                        }
                    }

                    @keyframes leafFloat {
                        0%, 100% {
                            transform: translateY(0) rotate(0deg);
                        }

                        50% {
                            transform: translateY(-20px) rotate(10deg);
                        }
                    }

                    @keyframes spinReverse {
                        from {
                            transform: rotate(360deg);
                        }

                        to {
                            transform: rotate(0deg);
                        }
                    }

                    @keyframes leafPulse {
                        0%, 100% {
                            transform: scale(1);
                            opacity: .8;
                        }

                        50% {
                            transform: scale(1.15);
                            opacity: 1;
                        }
                    }

                    @keyframes numberFloat {
                        0%, 100% {
                            transform: translateY(0);
                        }

                        50% {
                            transform: translateY(-6px);
                        }
                    }

                    @keyframes lineMove {
                        0% {
                            transform: translateX(-120%);
                        }

                        50% {
                            transform: translateX(120%);
                        }

                        100% {
                            transform: translateX(250%);
                        }
                    }

                    @keyframes particle {
                        0%, 100% {
                            transform: translateY(0) scale(1);
                            opacity: .25;
                        }

                        50% {
                            transform: translateY(-25px) scale(1.4);
                            opacity: .7;
                        }
                    }

                    @keyframes fadeDown {
                        from {
                            opacity: 0;
                            transform: translateY(-20px);
                        }

                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes fadeUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }

                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes scaleIn {
                        from {
                            opacity: 0;
                            transform: scale(.92) translateY(20px);
                        }

                        to {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                        }
                    }
                `}
            </style>

        </div>
    );
}

