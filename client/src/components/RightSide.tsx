import assets from '../assets/assets'
import { useChat } from '../Context/Chat.context'

const RightSide = () => {

  const {selecteduser,messages} = useChat()

  return selecteduser && (
    <div className={`bg-[#818582]/10 h-full text-white w-full relative overflow-y-scroll ${selecteduser?"max-md:hidden" :""}`}>
      <div className='pt-5 flex flex-col items-center gap-2 text-xs font-light'>
        <img src={selecteduser?.avatar || assets.avatar_icon} alt=""  className='w-20 aspect-auto-[1/1] rounded-full'/>
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          
          {selecteduser?.name}
          </h1>
          <p className='px-10 mx-auto text-center'>{selecteduser?.about}</p>
      </div>
      <hr className='border-[#fffff50] my-4'/>

      <div className='px-5 text-xs '>
        <p>Media</p>
        <div className='mt-2 max-h-180 overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {messages?.map((msg:any,index:any)=>(
            msg.image && <img key={index} src={msg.image ? msg.image : ""} alt="" className='h-auto  rounded-md'/>
          ))}
        </div>
      </div>

        

    </div>
  )
}

export default RightSide