import { LiveData } from '../../utils/custom-classes/LiveData';
import { Event } from '../../utils/custom-classes/Event';

export interface ToastData {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

export class EventListener {
  // Events — not state
  static readonly globalToastLD = new LiveData<ToastData | null>(null);
  static readonly navigateToChatLD = new LiveData<Event<string>>(new Event(''));
  static readonly reloadInboxLD = new LiveData<Event<boolean>>(new Event(false));

  static showSuccessToast(message: string, duration = 3000): void {
    this.globalToastLD.setValue({ message, type: 'success', duration });
  }

  static showErrorToast(message: string, duration = 3000): void {
    this.globalToastLD.setValue({ message, type: 'error', duration });
  }
}

export class LoaderService {
  static readonly visibleLD = new LiveData<boolean>(false);

  static show(): void {
    this.visibleLD.setValue(true);
  }

  static dismiss(): void {
    this.visibleLD.setValue(false);
  }

  static subscribe(cb: (visible: boolean) => void): void {
    this.visibleLD.subscribe(cb);
  }

  static unsubscribe(cb: (visible: boolean) => void): void {
    this.visibleLD.unsubscribe(cb);
  }
}
