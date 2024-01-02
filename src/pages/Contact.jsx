import React, {useState, useRef} from 'react'
import emailjs from '@emailjs/browser'

const Contact = () => {
  const formRef = useRef(null);
  const [form, setForm] = useState({name: '', email: '', message: ''});
  const [isLoading, setIsLoading] = useState(false);
  
  //Take key press event and updates all properties from form
  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value})
  };
  const handleFocus = () => {};
  const handleBlur = () => {};
  
  //gets key press event
  const handleSubmit = (event) => {
    event.preventDefault(); //to not reload page when submit
    setIsLoading(true);
    
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
      
      //SHOW ALERT SUCCESS, HIDE ALERT
      setForm({name: '', email: '', message: ''})
    }).catch((error) => {
      setIsLoading(false);
      console.log(error);
      //SHOW ERROR MESS
      setForm({name: '', email: '', message: ''})
    })
  };

  return (
    <section className="relative flex lg:flex-row flex-col max-container">
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
    </section>
  )
}

export default Contact