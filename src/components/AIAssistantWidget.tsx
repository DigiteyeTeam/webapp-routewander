import { useLocation } from 'react-router-dom';
import PortalAIChatWidget from './chat/PortalAIChatWidget';

/** แชท AI มุมขวาล่าง — หน้าตลาดเส้นทาง (/) เท่านั้น */
export default function AIAssistantWidget() {
  const location = useLocation();
  if (location.pathname !== '/') return null;
  return <PortalAIChatWidget role="marketplace" />;
}
