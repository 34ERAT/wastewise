import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import img1 from '../assets/img.png'
const Signup =()=>{
    const [form , setForm] = useState({name:'',email: '',password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(
            'http://127.0.0.1:8000/api/register/',
            JSON.stringify({  // Add JSON.stringify
                name: form.name,
                email: form.email,
                password: form.password,
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        navigate('/login');
    } 
    catch (err) {
        console.error("Registration error:", err.response?.data);
        alert(err.response?.data?.error || "Registration failed");
    }
    }

    

    return(
        
     <div className="bg-gray-100 min-h-screen" >
        
        <div className="flex min-h-full flex-col justify-center mt-10 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img src={img1} alt="Your Company" className="mx-auto h-10 w-auto mt-2" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to wastewise</h2>
      </div>
    
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6" onSubmit={handleSubmit}>
         
          <div>
            <label for="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
            <div className="mt-2">
              <input id="email" type="email" name="email" required autocomplete="email" className="block w-full rounded-md bg-orange-50 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-50 sm:text-sm/6" 
              value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
            </div>
          </div>
    
          <div>
            <div className="flex items-center justify-between">
              <label for="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
              
            </div>
            <div className="mt-2">
              <input id="password" type="password" name="password" required autocomplete="current-password" className="block w-full rounded-md bg-orange-50 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-50 sm:text-sm/6" 
              value={form.password} onChange={e => setForm({...form, password: e.target.value})}/>
            </div>
          </div>
           <div>
            <label for="email" className="block text-sm/6 font-medium text-gray-900">Name(optional)</label>
            <div className="mt-2">
              <input id="email" type="text" name="name" required autocomplete="text" className="block w-full rounded-md bg-orange-50 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-50 sm:text-sm/6" 
              value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
            </div>
          </div>
          <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-[#FFA500] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">Signup</button>
          </div>
        </form>
    
        
      </div>
    </div>
    
        </div>
);
};
export default Signup;