import { createContext, createRef, ReactNode, RefObject, useContext, useRef, useState } from "react";
import { chat, ChatContainer, chatTypeEnum } from "./ChatContainer";
import { automation, getAutomation } from "./automation";
import axiosCC from "./chat";
import React from "react";

type AssistantProps = {
  children: ReactNode
}

type indexedObject = {[propKey: string]: any}

type assistantContextType = {
  state: { [propKey: string]: any },
  setState: (o: any) => void,
  ref: RefObject<indexedObject>
}

const assistantContextDefaultValues: assistantContextType = {
  state: {},
  setState: () => {},
  ref: createRef<indexedObject>()
}

let navigationCallback: callbackFunction;

const AssistantContext = createContext<assistantContextType>(assistantContextDefaultValues);

export function AssistantProvider(props: AssistantProps) {
  const [assistedStates, setAssistedStates] = useState<indexedObject>({});
  let navigate: callbackFunction;
  const ref = useRef<indexedObject>({});

  const [chats, setChats] = useState<chat[]>([]);

  async function automate(auto: automation) {
    let as = { ...assistedStates };
    for (const a of auto) {
      switch (a.type) {
        case "goto": {
          console.log(navigate);
          navigationCallback(a.path as string);
          break;
        }
        case "click": {
          if (ref.current !== null) {
            ref.current[a.id as string].click();
          }
          break;
        }
        case "state": {
          as = { ...as, [a.id as string]: a.value };
          break;
        }
        case "delay": {
          setAssistedStates(as);
          await delay(a.value);
          break;
        }
      }
    }
    setAssistedStates(as);
  }

  function setState(o: any) {
    setAssistedStates(o);
  }

  const v: assistantContextType = {
    setState: setState,
    state: assistedStates,
    ref: ref
  }

  return (
    <AssistantContext.Provider value={v}>
      {props.children}
      <ChatContainer inputCallback={(message) => {
        setChats([...chats, new chat(chatTypeEnum.human, message)]);
          axiosCC.put("", { message: message })
            .then(async r => {
              if (r.status === 200) {
                let cR: chatResponse = r.data;
                await automate(getAutomation(cR.id, cR.vars));
                setChats((chats) => ([...chats, new chat(chatTypeEnum.ai, "Created, do you need anything else?")]));
              }
            });
        }} chats={chats}
      />
    </AssistantContext.Provider>
  )
}

type chatResponse = {
  id: string,
  vars: indexedObject
}

type assistedStateType = [
  state: any,
  setState: (o: any) => void
]

export function useAssistedState(id: string, initialState: any) {
  let c = useContext(AssistantContext);

  if (c.state[id] === undefined) {
    c.setState({...c.state, [id]: initialState});
  }

  let a: assistedStateType = [
    c.state[id],
    (o: any) => {
      c.setState({...c.state, [id]: o})
    }
  ];

  return a;
}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

export function useAssistedRef(id: string) {
  let c = useContext(AssistantContext);

  return (e: any) => {
    if (c.ref.current !== null) {
      c.ref.current[id] = e;
    }
  };
}

export type callbackFunction = (path: string) => void

export function setNavigationCallback(c: callbackFunction) {
  navigationCallback = c;
}
