'use client'
import React, { FormEvent, useState } from 'react';
import { Github, Globe, Mail, Phone, Send } from 'lucide-react';
import { resumeData } from '@/data/resumeData';

const ContactPage: React.FC = () => {
  const { personalInfo } = resumeData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [name,setName] =useState('')
  const [email,setEmail] =useState('')
  const [message,setMessage] =useState('')

  const handleSubmit =async (e:FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/mailer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setSuccess('Your message has been sent successfully!');
      setEmail('')
      setMessage('')
      setName('')
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-2">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/90">
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-800 dark:text-white">Let&apos;s Build Something Great</h2>
        <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-300">Open to AI engineering, product, and full-stack collaboration opportunities.</p>
        <ul className="mb-6 grid gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300">
          <li>
            <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
              <Mail size={14} /> {personalInfo.email}
            </a>
          </li>
          <li>
            <a href={`tel:${personalInfo.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
              <Phone size={14} /> {personalInfo.phone}
            </a>
          </li>
          <li>
            <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
              <Globe size={14} /> {personalInfo.website}
            </a>
          </li>
          <li>
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
              <Github size={14} /> {personalInfo.github}
            </a>
          </li>
        </ul>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-blue-400"
              placeholder="Your Name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-blue-400"
              placeholder="Your Email"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={message}
              onChange={(e)=>setMessage(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-blue-400"
              placeholder="Your Message"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <button
            type="submit"
            className={`flex items-center justify-center w-full rounded-md bg-blue-500 px-4 py-2 text-white shadow-sm hover:bg-blue-600 transition-colors duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
            <Send className="ml-2" size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
