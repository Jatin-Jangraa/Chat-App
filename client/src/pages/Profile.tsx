import React, { useState, type FormEvent } from 'react'
import type { userinfo } from './Login'
import { useAuth } from '../Context/AuthContect'
import api from '../Api/Axios'
import Loader from '../components/Loader'

const Profile = () => {

  const {user , restoreuser} = useAuth()

  const [selectedimage,setselectediamge] =useState<any>(null)
  const [previewimage , setpreviewimage] = useState<string>(user?.avatar || "")
  const [changeIamge  , setchangeIamge] = useState<boolean>(false)
  const [loading , setloading] = useState<boolean>(false)
  const [userinfo , setuserimfo] = useState<userinfo>(user || {})

  

  const submithandler = async (e:FormEvent) =>{
    e.preventDefault()

    try {
      setloading(true)
      
    const formdata = new FormData()
    formdata.append("name" , userinfo.name || "")
    formdata.append("about" , userinfo.about || "")
    if(changeIamge){
      formdata.append("avatar" , selectedimage)
    } 
      await api.post("/api/user/update",formdata,{
        headers:{
          'Content-Type': 'multipart/form-data'
        }
      })
      setloading(false)
      restoreuser()
      
    } catch (error) {
      
    }
  }


  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      {loading ? <Loader/> : ""}
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={submithandler} action="" className='flex flex-col gap-5 p-10 overflow-y-scroll h-full flex-1'> 
          <h3>Profile</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input type="file" name="" id="avatar" onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{{setselectediamge(e.target.files![0])} ;setpreviewimage(URL.createObjectURL(e.target.files![0])) ; setchangeIamge(true)}} accept='.png , .jpg , .jpeg' hidden />
            <img src={ previewimage} alt="" className="w-12 h-12  rounded-full" />
            Upload Image
          </label>
          <label>Name</label>
          <input onChange={(e) =>setuserimfo({...userinfo,name:e.target.value})} value={userinfo?.name} type="text" required placeholder='Your Name'  className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'/>
          <label>About</label>
          <textarea onChange={(e) =>setuserimfo({...userinfo,about:e.target.value})} value={userinfo?.about} name="" id="" placeholder='About Yourself' rows={3} required  className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'></textarea>
          <button type='submit' className='bg-linear-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'> Save</button>
        </form>
        <img className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ' src={previewimage} alt="" />
      </div>
    </div>
  )
}

export default Profile


// https://xhamster.com/videos/how-sexy-and-hot-you-are-stepmother-xh9n02m