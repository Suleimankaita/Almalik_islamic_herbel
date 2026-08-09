import React, { useEffect, useRef } from "react";
import { Leaf } from "lucide-react";

export default function AlmalikLoader({
    fullScreen = true,
    message = "Preparing your experience...",
    showBrand = true,
    speak = true,
}) {
const hasSpokenRef = useRef(false);
 
useEffect(() => {
    if (!speak) return;

    if (!("speechSynthesis" in window)) {
        console.warn("Speech synthesis is not supported.");
        return;
    }

    const text =
        "Welcome to Almalik Herbal Center. Please wait while we prepare your experience.";

    const speakNow = () => {
        if (hasSpokenRef.current) return;

        const voices = window.speechSynthesis.getVoices();

        if (!voices.length) {
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.lang = "en-US";
        utterance.rate = 0.85;
        utterance.pitch = 1.15;
        utterance.volume = 1;

        /*
        Find the best available English voice.
        */

        const femaleVoice = voices.find((voice) =>
            /female|samantha|zira|susan|karen|victoria|moira|fiona|ava|sara/i.test(
                voice.name
            )
        );

        const englishVoice =
            femaleVoice ||
            voices.find((voice) =>
                voice.lang.toLowerCase().startsWith("en")
            );

        if (englishVoice) {
            utterance.voice = englishVoice;
        }

        utterance.onstart = () => {
            console.log("Almalik voice started");
            hasSpokenRef.current = true;
        };

        utterance.onerror = (event) => {
            console.error(
                "Almalik speech error:",
                event.error
            );
        };

        window.speechSynthesis.speak(utterance);
    };

    /*
    Try immediately.
    */

    speakNow();

    /*
    Chrome sometimes loads voices later.
    */

    window.speechSynthesis.addEventListener(
        "voiceschanged",
        speakNow
    );

    /*
    If autoplay is blocked, wait for the
    user's first interaction.
    */

    const handleInteraction = () => {
        speakNow();
    };

    window.addEventListener(
        "click",
        handleInteraction,
        { once: true }
    );

    window.addEventListener(
        "keydown",
        handleInteraction,
        { once: true }
    );

    window.addEventListener(
        "touchstart",
        handleInteraction,
        { once: true }
    );

    return () => {
        window.speechSynthesis.removeEventListener(
            "voiceschanged",
            speakNow
        );

        window.removeEventListener(
            "click",
            handleInteraction
        );

        window.removeEventListener(
            "keydown",
            handleInteraction
        );

        window.removeEventListener(
            "touchstart",
            handleInteraction
        );

        window.speechSynthesis.cancel();
    };
}, [speak]);
    return (
        <div
            className={`
                ${
                    fullScreen
                        ? "fixed inset-0 z-[9999]"
                        : "relative min-h-[300px] w-full"
                }
                flex items-center justify-center
                overflow-hidden
                bg-[#f8faf5]
            `}
        >
            {/* Background */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="
                        absolute
                        left-1/2
                        top-1/2
                        h-[420px]
                        w-[420px]
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-[#dcebd6]
                        opacity-40
                        blur-[100px]
                        animate-pulse
                    "
                />

                <div
                    className="
                        absolute
                        -left-20
                        -top-20
                        h-72
                        w-72
                        rounded-full
                        bg-[#e7f0df]
                        opacity-70
                        blur-[80px]
                        animate-[float_7s_ease-in-out_infinite]
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-24
                        -right-20
                        h-80
                        w-80
                        rounded-full
                        bg-[#edf3df]
                        opacity-80
                        blur-[90px]
                        animate-[floatReverse_9s_ease-in-out_infinite]
                    "
                />

                <Leaf
                    className="
                        absolute
                        left-[12%]
                        top-[18%]
                        text-[#c9d9c2]
                        opacity-30
                        animate-[leafFloat_6s_ease-in-out_infinite]
                    "
                    size={34}
                    strokeWidth={1}
                />

                <Leaf
                    className="
                        absolute
                        right-[14%]
                        top-[25%]
                        rotate-45
                        text-[#bfcfb8]
                        opacity-25
                        animate-[leafFloat_8s_ease-in-out_infinite_reverse]
                    "
                    size={42}
                    strokeWidth={1}
                />

                <Leaf
                    className="
                        absolute
                        bottom-[20%]
                        left-[18%]
                        -rotate-45
                        text-[#c4d6bc]
                        opacity-25
                        animate-[leafFloat_7s_ease-in-out_infinite]
                    "
                    size={28}
                    strokeWidth={1}
                />

                <Leaf
                    className="
                        absolute
                        bottom-[15%]
                        right-[20%]
                        rotate-90
                        text-[#c9d9c2]
                        opacity-25
                        animate-[leafFloat_9s_ease-in-out_infinite_reverse]
                    "
                    size={36}
                    strokeWidth={1}
                />
            </div>

            {/* Main */}

            <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6">

                {/* Brand */}

                {showBrand && (
                    <div className="mb-8 flex flex-col items-center animate-[fadeUp_.8s_ease-out]">

                        <div className="relative mb-4">

                            <div
                                className="
                                    absolute
                                    -inset-3
                                    rounded-[28px]
                                    border
                                    border-[#c9dcc2]
                                    opacity-60
                                    animate-[spin_8s_linear_infinite]
                                "
                            />

                            <div
                                className="
                                    absolute
                                    -inset-6
                                    rounded-[34px]
                                    border
                                    border-[#dfeadb]
                                    opacity-50
                                    animate-[spinReverse_12s_linear_infinite]
                                "
                            />

                            <div
                                className="
                                    relative
                                    flex
                                    h-20
                                    w-20
                                    items-center
                                    justify-center
                                    rounded-[25px]
                                    border
                                    border-[#dce8d7]
                                    bg-white
                                    shadow-[0_15px_45px_rgba(34,85,42,0.12)]
                                "
                            >
                                <div
                                    className="
                                        absolute
                                        inset-2
                                        rounded-2xl
                                        bg-[#edf5e9]
                                        animate-pulse
                                    "
                                />

                                <Leaf
                                    className="relative z-10 text-[#245c30]"
                                    size={39}
                                    strokeWidth={1.5}
                                />
                            </div>
                        </div>

                        <div className="text-center">
                            <h1
                                className="
                                    font-serif
                                    text-[25px]
                                    font-semibold
                                    tracking-[0.18em]
                                    text-[#1d4e28]
                                "
                            >
                                ALMALIK
                            </h1>

                            <div
                                className="
                                    mt-[-2px]
                                    text-[10px]
                                    font-bold
                                    tracking-[0.42em]
                                    text-[#b58a32]
                                "
                            >
                                HERBEL
                            </div>
                        </div>
                    </div>
                )}

                {/* Loader Card */}

                <div
                    className="
                        flex
                        w-full
                        flex-col
                        items-center
                        rounded-[28px]
                        border
                        border-[#e3e9df]
                        bg-white/80
                        px-7
                        py-8
                        shadow-[0_25px_80px_rgba(31,67,35,0.08)]
                        backdrop-blur-xl
                        animate-[scaleIn_.7s_ease-out]
                    "
                >

                    {/* Spinner */}

                    <div className="relative mb-7 h-24 w-24">

                        <div
                            className="
                                absolute
                                inset-0
                                rounded-full
                                border-[2px]
                                border-transparent
                                border-t-[#2c6b37]
                                border-r-[#7fa37b]
                                animate-spin
                            "
                        />

                        <div
                            className="
                                absolute
                                inset-[9px]
                                rounded-full
                                border-[2px]
                                border-transparent
                                border-b-[#b58a32]
                                border-l-[#d5e3ce]
                                animate-[spinReverse_2s_linear_infinite]
                            "
                        />

                        <div
                            className="
                                absolute
                                inset-[18px]
                                flex
                                items-center
                                justify-center
                                rounded-full
                                bg-[#edf5e9]
                                shadow-inner
                                animate-pulse
                            "
                        >
                            <Leaf
                                size={25}
                                strokeWidth={1.7}
                                className="
                                    text-[#2b6836]
                                    animate-[leafPulse_2s_ease-in-out_infinite]
                                "
                            />
                        </div>

                        <div
                            className="
                                absolute
                                left-1/2
                                top-0
                                h-2.5
                                w-2.5
                                -translate-x-1/2
                                rounded-full
                                bg-[#b58a32]
                                shadow-[0_0_12px_rgba(181,138,50,.55)]
                                animate-[orbit_2s_linear_infinite]
                            "
                        />
                    </div>

                    {/* Text */}

                    <div className="text-center">

                        <h2 className="text-[15px] font-semibold text-[#1e3021]">
                            Loading
                            <span className="inline-flex w-[24px] text-left">
                                <span className="animate-[dot1_1.5s_infinite]">
                                    .
                                </span>

                                <span className="animate-[dot2_1.5s_infinite]">
                                    .
                                </span>

                                <span className="animate-[dot3_1.5s_infinite]">
                                    .
                                </span>
                            </span>
                        </h2>

                        <p className="mt-2 text-[11px] leading-5 text-gray-400">
                            {message}
                        </p>

                    </div>

                    {/* Progress */}

                    <div className="mt-6 w-full">
                        <div className="h-[5px] w-full overflow-hidden rounded-full bg-[#edf1e9]">
                            <div
                                className="
                                    h-full
                                    w-[45%]
                                    rounded-full
                                    bg-gradient-to-r
                                    from-[#245c30]
                                    via-[#4c814f]
                                    to-[#b58a32]
                                    animate-[loadingBar_2s_ease-in-out_infinite]
                                "
                            />
                        </div>
                    </div>

                    {/* Voice indicator */}

                    {speak && (
                        <div className="mt-5 flex items-center gap-2">

                            <div className="flex items-end gap-[2px] h-3">
                                <span className="w-[2px] h-2 rounded-full bg-[#5b8d5f] animate-[voiceBar_.8s_ease-in-out_infinite]" />
                                <span className="w-[2px] h-3 rounded-full bg-[#5b8d5f] animate-[voiceBar_.6s_ease-in-out_infinite]" />
                                <span className="w-[2px] h-1.5 rounded-full bg-[#5b8d5f] animate-[voiceBar_.9s_ease-in-out_infinite]" />
                                <span className="w-[2px] h-2.5 rounded-full bg-[#5b8d5f] animate-[voiceBar_.7s_ease-in-out_infinite]" />
                            </div>

                            <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-gray-400">
                                Almalik Assistant
                            </span>

                        </div>
                    )}

                </div>

                <p className="mt-6 text-center text-[9px] font-medium tracking-[0.12em] text-gray-400">
                    NATURE'S WISDOM • YOUR WELLNESS
                </p>

            </div>

            {/* Animations */}

            <style>
                {`
                    @keyframes float {
                        0%, 100% {
                            transform: translate3d(0, 0, 0);
                        }

                        50% {
                            transform: translate3d(25px, 20px, 0);
                        }
                    }

                    @keyframes floatReverse {
                        0%, 100% {
                            transform: translate3d(0, 0, 0);
                        }

                        50% {
                            transform: translate3d(-30px, -20px, 0);
                        }
                    }

                    @keyframes leafFloat {
                        0%, 100% {
                            transform: translateY(0) rotate(0deg);
                        }

                        50% {
                            transform: translateY(-15px) rotate(8deg);
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

                    @keyframes orbit {
                        from {
                            transform: rotate(0deg)
                                translateX(36px)
                                rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg)
                                translateX(36px)
                                rotate(-360deg);
                        }
                    }

                    @keyframes leafPulse {
                        0%, 100% {
                            transform: scale(1);
                            opacity: .75;
                        }

                        50% {
                            transform: scale(1.15);
                            opacity: 1;
                        }
                    }

                    @keyframes loadingBar {
                        0% {
                            transform: translateX(-120%);
                            width: 35%;
                        }

                        50% {
                            transform: translateX(80%);
                            width: 55%;
                        }

                        100% {
                            transform: translateX(240%);
                            width: 35%;
                        }
                    }

                    @keyframes voiceBar {
                        0%, 100% {
                            transform: scaleY(.4);
                        }

                        50% {
                            transform: scaleY(1);
                        }
                    }

                    @keyframes fadeUp {
                        from {
                            opacity: 0;
                            transform: translateY(15px);
                        }

                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes scaleIn {
                        from {
                            opacity: 0;
                            transform: scale(.94) translateY(10px);
                        }

                        to {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                        }
                    }

                    @keyframes dot1 {
                        0%, 20% { opacity: 0; }
                        25%, 100% { opacity: 1; }
                    }

                    @keyframes dot2 {
                        0%, 40% { opacity: 0; }
                        45%, 100% { opacity: 1; }
                    }

                    @keyframes dot3 {
                        0%, 60% { opacity: 0; }
                        65%, 100% { opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
}