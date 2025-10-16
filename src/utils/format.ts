import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatPhoneNumber(value?: string | null) {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(-10);
  if (digits.length < 10) return value;
  const area = digits.slice(0, 3);
  const exchange = digits.slice(3, 6);
  const subscriber = digits.slice(6);
  return `(${area}) ${exchange}-${subscriber}`;
}

export function formatTime(isoString: string) {
  return dayjs(isoString).format('h:mm A');
}

export function formatDateHeading(isoString: string) {
  const date = dayjs(isoString).startOf('day');
  const today = dayjs().startOf('day');
  const diff = date.diff(today, 'day');

  if (diff === 0) return 'Today';
  if (diff === -1) return 'Yesterday';
  return date.format('MMMM D, YYYY');
}

export function formatElapsed(start: string) {
  return dayjs(start).fromNow(true);
}

export function formatCountdown(start: string, durationMinutes: number) {
  const end = dayjs(start).add(durationMinutes, 'minute');
  const now = dayjs();
  if (now.isAfter(end)) {
    return {
      value: now.to(end, true),
      overdue: true
    };
  }
  return {
    value: end.toNow(true),
    overdue: false
  };
}

export function matchesQuery(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}
