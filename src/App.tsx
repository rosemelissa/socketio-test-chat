import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:4000");

interface IIDMessage {
  id: number;
  message: string;
}

function App(): JSX.Element {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messages, setMessages] = useState<IIDMessage[]>([]);

  socket.on("connect", () => {
    console.log(socket.connected); // true
  });

 

  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const allMessages = await axios.get("http://localhost:4000/all");
        console.log(allMessages.data)
      } catch (error) {
        console.error(error);
      }
    }
    getAllMessages();

    socket.on("messages updated", (updatedMessages) => {
      setMessages(updatedMessages.allMessages);
    })
    return () => {
      socket.off("messages updated");
    };
  }, [])

  const handleSubmit = async () => {
    await axios.post("http://localhost:4000/message", { message: currentMessage})
    setCurrentMessage("")
  }

  return (
    <>
    <input type="text" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)}/>
    <button onClick={handleSubmit}>Submit</button>
    <h1>Messages:</h1>
    <ul>
      {messages.map((message) => {
        return(
      <li key={message.id}>{message.message}</li>)
    })}
    </ul>
    
  </>)
  ;
}

export default App;
