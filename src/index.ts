import { AssistantProvider, setNavigationCallback, useAssistedRef, useAssistedState, callbackFunction } from "./AssistantContext";
import { setBaseUrl } from "./chat";
import { setAutomations, rawAutomation } from "./automation";
import '../tailwind.css';

export { AssistantProvider, setNavigationCallback, useAssistedRef, useAssistedState, setBaseUrl, setAutomations, rawAutomation as automation, callbackFunction };