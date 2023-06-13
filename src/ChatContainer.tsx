import { Icon } from "@iconify/react";
import { useState } from "react";
import React from 'react';
import '../tailwind.css';

export enum chatTypeEnum {
  ai  ,
  human
}

export class chat {
  type: chatTypeEnum
  content: string

  constructor(type: chatTypeEnum, content: string) {
    this.type = type;
    this.content = content;
  }
}

type chatContainerProps = {
  chats: chat[]
  inputCallback: (input: string) => void
}

export function ChatContainer(props: chatContainerProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="absolute bottom-0 right-5 z-10">
      <div className="bg-blue-500 w-96 h-10 rounded-tl-lg rounded-tr-lg flex cursor-pointer" onClick={() => {
        setOpen(!open);
      }}>
        <div className="text-white m-auto ml-3 font-semibold">
          AI Copilot
        </div>
        <div
          className="flex-1"
        />
        <Icon
          className="text-white m-auto mr-3"
          icon={open ? 'fa-solid:angle-down' : 'fa-solid:angle-up'}
          width="22" height="22"
        />
      </div>
      {
        open &&
          <>
            <div className="w-96 h-96 border-l border-r overflow-auto pt-3">
              {
                props.chats.map((c, i) => {
                  if (c.type === chatTypeEnum.ai) {
                    return (
                      <AIResponse key={i} message={c.content} />
                    )
                  }
                  if (c.type === chatTypeEnum.human) {
                    return (
                      <HumanResponse key={i} message={c.content} />
                    )
                  }
                  return null;
                })
              }
            </div>
            <div className="border-l border-r">
              <label htmlFor="chat" className="sr-only">Your message</label>
              <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                <textarea id="chat" rows={1}
                          value={message}
                          onChange={(mess) => setMessage(mess.target.value)}
                          autoFocus
                  className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Your message..."/>
                <button className="ml-3 inline-flex justify-center p-2 text-blue-500 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
                        onClick={() => {
                          props.inputCallback(message);
                          setMessage("");
                        }}
                >
                  <svg aria-hidden="true" className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20"
                       xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                  </svg>
                  <span className="sr-only">Send message</span>
                </button>
              </div>
            </div>
          </>
      }
    </div>
  )
}

type chatProps = {
  message: string
}

function AIResponse(props: chatProps) {
  return (
    <div className="flex w-fit h-fit pl-3 pb-3">
      <div className="w-80 bg-blue-500 text-white rounded-tl-xl rounded-tr-xl rounded-br-xl p-2">
        {props.message}
      </div>
    </div>
  );
}

function HumanResponse(props: chatProps) {
  return (
    <div className="flex w-auto h-fit pr-3 pb-3">
      <div className="flex-1"/>
      <div className="w-80 bg-neutral-400 text-white rounded-bl-xl rounded-tl-xl rounded-tr-xl p-2">
        {props.message}
      </div>
    </div>
  );
}