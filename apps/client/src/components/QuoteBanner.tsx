export default function QuoteBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-brand-greenLight px-6 py-6">
      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-white/70 text-2xl">
          ☪️
        </div>
        <p className="text-[14px] text-gray-700 sm:text-[15px]">
          "And We send down of the Qur'an that which is a healing and a{' '}
          <span className="font-bold text-brand-green">mercy</span> for the believers."
          <br />
          <span className="mt-1 block text-[12.5px] text-gray-500">— Surah Al-Isra (17:82)</span>
        </p>
      </div>

      {/* Decorative skyline */}
      <svg
        className="pointer-events-none absolute bottom-0 right-0 h-full w-2/3 opacity-40"
        viewBox="0 0 400 120"
        preserveAspectRatio="xMaxYMax slice"
        fill="none"
      >
        <path
          d="M0 120 L0 90 Q10 85 15 90 L15 70 Q25 60 35 70 L35 40 Q45 20 55 40 L55 90 Q65 85 70 90 L70 60 Q80 50 90 60 L90 90 L120 90 L120 100 Q130 95 135 100 L135 80 Q150 55 165 80 L165 100 Q175 95 180 100 L180 60 Q195 30 210 60 L210 100 Q220 95 225 100 L225 70 Q235 60 245 70 L245 100 L280 100 L280 90 Q290 85 295 90 L295 65 Q310 40 325 65 L325 90 Q335 85 340 90 L340 100 L400 100 L400 120 Z"
          fill="#1F7A4D"
        />
      </svg>
    </div>
  );
}
