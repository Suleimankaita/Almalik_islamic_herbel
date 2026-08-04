import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Leaf, Crown } from 'lucide-react';
import Herbel from "../assets/Herbel.png"
import { useLoginMutation } from '../Features/api/DataSlice';
import { useDispatch } from 'react-redux';
import { setToken } from '../Features/AppSlice';
import {toast, ToastContainer} from "react-toastify"
import {useNavigate} from 'react-router-dom';
export default function AlmalikAuthScreen() {
    const [Login,{isLoading,isSuccess}]=useLoginMutation();
    const navigate=useNavigate()
    const [Username,SetUsername]=useState<string>('')
    
    const [Password,SetPassword]=useState<string>('')
  
    const [showPassword, setShowPassword] = useState(false);

    const dispatch=useDispatch()

    useEffect(()=>{
      if(isSuccess){
        navigate('/')
      }
    },[isSuccess,navigate])
    const HandleSubmit=async()=>{
                try{
                const ms=await Login({Username,Password}).unwrap()
                dispatch(setToken(ms?.accessToken))
            }catch(err:any){
              toast.error(err?.data?.message||err.message)
                }
              }

  // Framer Motion Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  return (
    <div className={` min-h-screen w-full flex flex-col lg:flex-row bg-[#F8F9F7] font-sans`}>
      <ToastContainer/>
      {/* LEFT PANEL - Branding & Hero (Hidden on smaller screens) */}
      <div className={`imgs hidden lg:flex w-1/2 relative bg-[#F5F4F0] overflow-hidden flex-col justify-between`}>
        {/* Decorative Background Image Setup */}
        {/* <div className="absolute inset-0 z-0"> */}
        {/* </div> */}
    <div className="div"></div>
        {/* Top Logo */}
        

        {/* Center Typography */}
      

        {/* Bottom Feature Bar */}
         <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="relative z-10 flex items-center justify-between px-12 pb-10 text-sm text-gray-600 font-medium text-white"
        >
          <div className=" flex items-center space-x-2">
            <ShieldCheck className="text-white w-5 h-5 text-gray-500 stroke-[1.5]" />
            <span>Secure Login</span>
          </div>
          <div className="w-px h-5 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <Lock className="text-white w-5 h-5 text-gray-500 stroke-[1.5]" />
            <span>Your Data is Protected</span>
          </div>
          <div className="w-px h-5 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <Leaf className="text-white w-5 h-5 text-gray-500 stroke-[1.5]" />
            <span>Trusted & Natural</span>
          </div>
        </motion.div> 
      </div>

      {/* RIGHT PANEL - Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-[#FDFDFD]">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 border border-gray-100 relative z-10"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-8">
            <h2 className="text-3xl font-serif text-[#1c3a27] mb-2">Welcome Back</h2>
            <p className="text-gray-500 text-sm">Sign in to your Almalik Herbel account</p>
          </motion.div>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Email Input */}
            <motion.div variants={fadeUp} className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 stroke-[1.5]" />
                </div>
                <input
                onChange={(e)=>SetUsername(e.target.value)}
                  type="text"
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1c3a27]/20 focus:border-[#1c3a27] transition-all outline-none text-gray-800 bg-white text-sm"
                  placeholder="Enter your Username"
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={fadeUp} className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 stroke-[1.5]" />
                </div>
                <input
                onChange={(e)=>SetPassword(e.target.value)}
                  
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full pl-11 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1c3a27]/20 focus:border-[#1c3a27] transition-all outline-none text-gray-800 bg-white text-sm"
                  placeholder="Enter your password"

                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 stroke-[1.5]" /> : <Eye className="h-5 w-5 stroke-[1.5]" />}
                </button>
              </div>
            </motion.div>

            {/* Forgot Password Link */}
            <motion.div variants={fadeUp} className="flex justify-end">
              <a href="#" className="text-sm font-medium text-[#1c3a27] hover:text-[#12261a] transition-colors">
                Forgot Password?
              </a>
            </motion.div>

            {/* Submit Button with subtle inner leaf watermark */}
            <motion.div variants={fadeUp}>
              <button 
              onClick={HandleSubmit}
                type="submit"
                className="relative overflow-hidden w-full bg-[#1c3a27] text-white py-3.5 rounded-lg font-medium transition-all hover:bg-[#152e1e] hover:shadow-md active:scale-[0.98] group"
              >
                <span className="relative z-10">Sign In</span>
                {/* Decorative watermark inside button */}
                <Leaf className="absolute -right-2 -bottom-4 w-16 h-16 text-white opacity-5 -rotate-12 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500" />
              </button>
            </motion.div>

            {/* Divider */}
            <motion.div variants={fadeUp} className="flex items-center my-6">
              <div className="flex-grow h-px bg-gray-200"></div>
              <span className="px-4 text-sm text-gray-400">or</span>
              <div className="flex-grow h-px bg-gray-200"></div>
            </motion.div>

            {/* Social Login */}
            <motion.div variants={fadeUp}>
              <button 
                type="button"
                className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors active:scale-[0.98]"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>
            </motion.div>

            {/* Footer Link */}
            <motion.div variants={fadeUp} className="text-center pt-4">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <a href="#" className="font-semibold text-[#1c3a27] hover:underline">
                  Create Account
                </a>
              </p>
            </motion.div>
          </form>
        </motion.div>

        {/* Absolute Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-6 text-center text-sm text-gray-400"
        >
          © 2025 Almalik Herbel. All rights reserved.
        </motion.div>
      </div>
    </div>
  );
}

// Reusable Google SVG Icon matching standard branding
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);