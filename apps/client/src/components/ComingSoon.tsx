import { motion } from 'framer-motion';
import { ArrowLeft, Clock3, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ComingSoonProps {
  title: string;
}

export default function ComingSoon({ title }: ComingSoonProps): React.JSX.Element {
  return (
    <main className="flex min-h-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#f7faf6] via-white to-[#edf4ec] px-5 py-12">
      <motion.section
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#dce8dc] bg-white/90 p-8 text-center shadow-xl shadow-[#2c5234]/10 sm:p-12"
      >
        <motion.div
          aria-hidden="true"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-16 -top-20 h-52 w-52 rounded-full border border-dashed border-[#b7cfb8]"
        />
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf3e9] text-[#2c5234]"
        >
          <Clock3 size={30} />
        </motion.div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#f3f7f2] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#527354]">
          <Sparkles size={14} />
          Coming soon
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-600">
          We’re preparing this feature now. It will be available soon in production mode.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#2c5234] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1e3a24] focus:outline-none focus:ring-2 focus:ring-[#2c5234] focus:ring-offset-2"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
      </motion.section>
    </main>
  );
}
