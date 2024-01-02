import React, {Suspense, useState, useRef} from 'react'
import emailjs from '@emailjs/browser'
import {Canvas} from '@react-three/fiber'
import Fox from '../models/Fox'
import Loader from '../components/Loader'
import useAlert from '../hooks/useAlert'
import Alert from '../components/Alert'

const Contact = () => {
  const formRef = useRef(null);
  const [form, setForm] = useState({name: '', email: '', message: ''});
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState('IDLE');
  
  const {alert, showAlert, hideAlert} = useAlert();

  //Take key press event and updates all properties from form
  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value})
  };

  const handleFocus = () => setCurrentAnimation("walk");
  const handleBlur = () => setCurrentAnimation("idle");

  const handleSubmit = (event) => {
    event.preventDefault();//to not reload page when submit
    setLoading(true);
    setCurrentAnimation("hit");
    
    emailjs.send(
      import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
      {
        from_name: form.name,
        to_name: "Victoria Mazilu",
        from_email: form.email,
        to_email: "vmazilu@uwaterloo.ca",
        message: form.message,
      },
      import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
    ).then(() => {
      setIsLoading(false);
    
      showAlert({show: true, text: 'Message sent successfully!', type: 'success'})
      
      //Timeout after 3 seconds reset message and fox to idle
      setTimeout(() => {
        hideAlert();
        setCurrentAnimation('idle');
        setForm({name: '', email: '', message: ''});
      }, [3000])
      
    }).catch((error) => {
      setIsLoading(false);
      setCurrentAnimation('idle');
      console.log(error);
      
      showAlert({show: true, text: 'Error during send. ', type: 'danger'})

    })
  };

  return (
    <section className="relative flex lg:flex-row flex-col max-container">
      {alert.show && <Alert {...alert} />}

      <div className="flex-1 min-w-[50%] flex flex-col">
        <h1 className="head-text">Get in Touch</h1>

        <form className="w-full flex flex-col gap-7 mt-14" onSubmit={handleSubmit}>
          <label className="text-black-500 font-semibold">
            Name
            <input 
              type="text"
              name="name"
              className="input"
              placeholder="Your name"
              required
              value={form.name}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label className="text-black-500 font-semibold">
            Email
            <input 
              type="email"
              name="email"
              className="input"
              placeholder="yourname@gmail.com"
              required
              value={form.email}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label className="text-black-500 font-semibold">
            Your Message
            <textarea 
              name="message"
              rows={4}
              className="textarea"
              placeholder="Let me know how I can help!"
              required
              value={form.message}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <button 
            type="submit"
            className="btn"
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
      <div className="lg:w-1/2 w-full lg:h-auto">
        <Canvas camera={{postion: [0, 0, 5], fov: 75, near: 0.1, far: 1000}}>
          <directionalLight intensity={2.5} position={[0, 0, 1]} />
          <ambientLight intensity={1} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
          />

          <Suspense fallback={<Loader />}>
            <Fox
              currentAnimation={currentAnimation}
              position={[0.5, 0.35, 0]}
              rotation={[12.629, -0.6, 0]}
              scale={[0.5, 0.5, 0.5]}
            />
          </Suspense>
        </Canvas>
      </div>
    </section>
  )
}

export default Contact