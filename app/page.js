'use client'
import Image from "next/image";
import {useState} from 'react'

export default function Home() {
  const [messages, setMessages] = useState({
    role: 'assistant',
    content: `Hi I'm the HeadStarter Support Agent, how can I assist you today?`
  })

  const [message, setMessage] = useState('')

  return 
}