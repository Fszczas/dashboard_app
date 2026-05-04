import { useEffect } from 'react';
import { getSocket } from '../services/socket';
import { useStore } from '../store/store';

export function useSocket() {
  const { setConnected, updateMetrics, appendHistory, setHistory, setServices, setEvents, prependEvent } = useStore();

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    const onInit = ({ history, services, events }) => {
      setHistory(history);
      setServices(services);
      setEvents(events);
    };

    const onMetricsUpdate = ({ metrics, timestamp }) => {
      updateMetrics(metrics);
      for (const [key, value] of Object.entries(metrics)) {
        appendHistory(key, { value, timestamp });
      }
    };

    const onServicesUpdate = (services) => setServices(services);
    const onEventNew = (event) => prependEvent(event);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('init', onInit);
    socket.on('metrics:update', onMetricsUpdate);
    socket.on('services:update', onServicesUpdate);
    socket.on('event:new', onEventNew);

    if (socket.connected) setConnected(true);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('init', onInit);
      socket.off('metrics:update', onMetricsUpdate);
      socket.off('services:update', onServicesUpdate);
      socket.off('event:new', onEventNew);
    };
  }, [setConnected, updateMetrics, appendHistory, setHistory, setServices, setEvents, prependEvent]);
}
