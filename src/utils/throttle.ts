export default function throttle<T extends (...args: unknown[]) => void>(
  call: T,
  timeout: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function perform(...args: Parameters<T>): void {
    if (timer) return;

    timer = setTimeout(() => {
      call(...args);

      clearTimeout(timer as ReturnType<typeof setTimeout>);
      timer = null;
    }, timeout);
  };
}
