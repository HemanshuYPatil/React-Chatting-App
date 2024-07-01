import { useChatContext } from "@/context/chatContext";
import { useUserContext } from "@/context/userContext";
import { IMessage } from "@/types/type";
import React, { use, useEffect, useLayoutEffect, useRef, useState } from "react";
import Sender from "../Sender/Sender";
import Recever from "../Receiver/Recever";
import ContextMenu from "../../other/customcontext";
import { useGlobalContext } from "@/context/globalContext";

function Body() {
  const messageBodyRef = useRef(null) as any;

  const { messages, arrivedMessage } = useChatContext();
  const userId = useUserContext().user?._id;

  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, key: number } | null>(null);
  const [menuKey, setMenuKey] = useState(0);
  const { allChatsData, handleSelectedChat, selectedChat } = useChatContext();
  const { showProfile, handleProfileToggle, handleViewChange, currentView } = useGlobalContext();

  const closechat = () => {
    handleProfileToggle(false); // Close any open profile or chat view
    handleSelectedChat(null); // Clear the selected chat
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    setMenuKey((prevKey) => prevKey + 1); 
    setContextMenu({
      x: clientX,
      y: clientY,
      key: menuKey
    });
  };

  const handleClick = () => {
    if (contextMenu) {
      setContextMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [contextMenu]);

  const scrollToBottom = (behavior: string = "smooth") => {
    if (messageBodyRef.current) {
      messageBodyRef.current.scrollTo({
        top: messageBodyRef.current.scrollHeight,
        behavior,
      });
    }
  };

  // scroll to bottom on initial page load
  useLayoutEffect(() => {
    scrollToBottom("auto");
  }, []);

  useEffect(() => {
    if (arrivedMessage && arrivedMessage.sender !== userId) {
      scrollToBottom("smooth");
    }
  }, [arrivedMessage]);

  // scroll to bottom on when a new message is sent
  useEffect(() => {
    scrollToBottom("auto");
  }, [messages]);

  return (
    <div
      ref={messageBodyRef}
      className="message-body relative flex-1 p-4 overflow-y-auto"
      onContextMenu={handleContextMenu}
    >
       {/* <div onContextMenu={handleContextMenu} style={{ height: '100vh', background: '#f0f0f0' }}> */}
      {/* <h1>Right-click to open the context menu</h1> */}
      {contextMenu && (
        <ContextMenu closechat={closechat} x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)} key={contextMenu.key} />
      )}
    {/* </div> */}
      <div className="relative flex flex-col">
        {messages.map((message: IMessage) =>
          message.sender === userId ? (
            <div key={message?._id} className="self-end mb-2">
              <Sender
                status={message.status}
                content={message.content}
                createdAt={message.createdAt}
              />
            </div>
          ) : (
            <div key={message?._id}>
              <Recever
                messageId={message?._id}
                content={message.content}
                createdAt={message.createdAt}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Body;
