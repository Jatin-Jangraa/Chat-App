import  {  useState, type FormEvent } from 'react'
import assets from '../assets/assets';
import {  useAuth } from '../Context/AuthContect';
import { useNavigate } from 'react-router-dom';
import api from '../Api/Axios';
import Loader from '../components/Loader';

export interface userinfo {
  name? : string,
  about? : string
  username? : string,
  password? : string ,
}
const Login = () => {

  const {login,restoreuser , loading} = useAuth()
  const Navigate = useNavigate()

  const resetform = () => setuserinfo({})

  const [currentstate,setcurrentstate] = useState<"Sign Up" | "Sign In">("Sign In")
  const [userinfo,setuserinfo] = useState<userinfo>()
  
  const [issubmitted, setissubbmitted] = useState<boolean>(false)

  const submithandler = async (e:FormEvent) =>{
    e.preventDefault()
    if(currentstate === "Sign Up" && !issubmitted ) {
      setissubbmitted(true)
      return ;
    }

    if(currentstate === "Sign In"  ) {
      login(userinfo) 
      Navigate("/")
      resetform()
    }else{
      try {
            const res = await api.post("/api/user/signup",userinfo,{
              headers:{
                'Content-Type': 'multipart/form-data'
              }
            })
            localStorage.setItem("accessToken",res.data.accessToken)
            restoreuser()
            Navigate("/")
            resetform()
            setcurrentstate("Sign In")
      } catch (error: any) {
        const message = error.response?.data?.message
        console.error(error)
        alert(message);
      }
    }


  }

  return (
    <div className='min-h-screen bg-cover flex items-center justify-center gap-8 sm:justify-evenly max-md:flex-col backdrop-blur-2xl '>
        <img src={assets.logo_big} alt=""  className='w-[min(30vw,250px)]'/>

        <form onSubmit={submithandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col rounded-lg shadow-lg gap-6'>
            <h2 className='font-medium text-2xl flex justify-between items-center'>
              {currentstate}
              {issubmitted &&
              <img onClick={()=>setissubbmitted(false)} src={assets.arrow_icon} className='w-5 cursor-pointer' alt="" />
              }
            </h2>
            {currentstate === "Sign Up" && !issubmitted && (
              <input type="text" placeholder='Full Name' onChange={(e)=>setuserinfo({...userinfo,name:e.target.value})} required   className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'/>)}
            {!issubmitted && (
              <>
              <input value={userinfo?.username} onChange={(e)=>setuserinfo({...userinfo,username:e.target.value})} type="text" placeholder='Email Address' required  className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'/>
              <input value={userinfo?.password} onChange={(e)=>setuserinfo({...userinfo,password:e.target.value})} type="password" placeholder='Password' required  className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'/>
              
              </>
            )}

            {
              currentstate === "Sign Up"  && issubmitted && (
                <>
                <label>About</label>
                <textarea rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500  text-white placeholder-gray-300'  placeholder='About ...'  required onChange={(e) => setuserinfo({...userinfo,about:e.target.value})} ></textarea>
                </>
              )
            }

            <button type='submit' className='py-3 bg-linear-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
              {loading ? <Loader/> :
              currentstate === "Sign Up" ? "Sign Up" :"Sign In"
              }
            </button>

            <div className='flex flex-col gap-2'>
              {currentstate === "Sign Up" ? (
              <p className='text-sm text-gray-600'>Already have an account ? <span onClick={()=>{setcurrentstate("Sign In");setissubbmitted(false)}} className='font-medium text-violet-500 cursor-pointer'>Login Here</span></p>) :
              (<p className='text-sm text-gray-600'>Create an Account . <span onClick={()=>setcurrentstate('Sign Up')} className='font-medium text-violet-500 cursor-pointer'>Click Here</span></p>)}
            </div>

            <div>
              
            </div>

        </form>

    </div>
  )
}

export default Login;