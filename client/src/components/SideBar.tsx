import  { useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAuth, type IUser } from '../Context/AuthContect'
import { useChat } from '../Context/Chat.context'

const SideBar = () => {

    const {setselecteduser,selecteduser, chatusers, getusers,  unseenMessages} = useChat()

    const {logout , onlineusers} = useAuth()
    const [open, setOpen] = useState(false);

    const [search  , setsearch] = useState<string>()

    const filteredUsers:IUser[] =  search ? chatusers.filter((user:IUser) =>
        user.name.toLowerCase().includes((search).toLowerCase())
    ) : chatusers;


    useEffect(() => {
        getusers()
    }, [onlineusers])


    const Navigate = useNavigate()

    return (
        <div className={`  bg-[#8185B2]/10 h-full p-5 rounded-r-x1 overflow-y-scroll text-white ${selecteduser ? "max-md:hidden" : ""} `}>
            <div className='pb-5 flex flex-col gap-5'>
                <div className='flex justify-between items-center'>
                    <img src={assets.logo} alt="logo" className='max-w-40' />
                    {/* <div className="relative py-2 group">
                        <img src={assets.menu_icon} alt="Menu" className='max-h-5
cursor-pointer' />
                        <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
                            <p onClick={() => Navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
                            <hr className="my-2 border-t border-gray-500" /> <p onClick={() => logout()} className='cursor-pointer text-sm'>Logout</p>
                        </div>
                    </div> */}
                     <div className="flex justify-between items-center">

      <div className="relative">
        <img
          src={assets.menu_icon}
          alt="Menu"
          className="max-h-5 cursor-pointer"
          onClick={() => setOpen(!open)}
        />

        {open && (
          <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100">
            <p
              onClick={() => {
                Navigate("/profile");
                setOpen(false);
              }}
              className="cursor-pointer text-sm"
            >
              Edit Profile
            </p>

            <hr className="my-2 border-t border-gray-500" />

            <p
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="cursor-pointer text-sm"
            >
              Logout
            </p>
          </div>
        )}
      </div>
    </div>
                </div>

                <div className='flex  bg-[#282142] rounded-full items-center gap-2 py-3 px-5 '>
                    <img src={assets.search_icon} className='w-3'/>
                    <input type="text" className='bg-transparent border-none outline-none text-white text-xs placeholder:[#c8c8c8] flex-1' placeholder='Search User' onChange={(e) => setsearch(e.target.value)}/>
                </div>

                <div className=' flex flex-col'>
                    {filteredUsers?.map((user,index)=>(
                        <div  onClick={()=>{setselecteduser(user)}} key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selecteduser?._id === user._id && "bg-[#282142]/50"}`}> 
                            <img src={user.avatar ?user.avatar : assets.avatar_icon} alt=""  className='w-8.75 aspect-square rounded-full'/>
                            <div className='flex flex-col leading-5'>
                                <p >{user.name}</p>
                                <p >{user.username}</p>

                                {onlineusers.includes(user._id!) ?
                                 <p className='text-green-400 text-xs'>Online</p>:
                                 <param className='text-netural-400 text-xs'>Offline</param>}
                            </div>
                            {unseenMessages[user._id!] > 0 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>{unseenMessages[user._id!]}</p>}
                        </div>
                    ))}
                </div>

            </div>
        </ div>
    )
}

export default SideBar