import { useState, useEffect, CSSProperties } from 'react';
import { onMessage } from '@/utils/messaging';
import { Copy } from 'lucide-react';
import getResponse from '@/utils/ai.ts';

export function App() {
  const getSelectedPosition = (): DOMRect | null => {
    const element = document.activeElement as Element | null;
    return isTextField(element)
      ? (element as HTMLElement).getBoundingClientRect()
      // Test on iframe
      // I got: Uncaught (in promise) Error: Selection.getRangeAt: 0 is out of
      // range
      // https://stackoverflow.com/questions/22935320/uncaught-indexsizeerror-failed-to-execute-getrangeat-on-selection-0-is-not
      : window.getSelection?.() && window.getSelection()!.rangeCount > 0
        ? (() => {
          const rect = window.getSelection()!.getRangeAt(0).getBoundingClientRect();
          return rect.width || rect.height ? rect : null;
        })()
        : null;
  };

  const isTextField = (el: Element | null): el is HTMLInputElement | HTMLTextAreaElement =>
    !!el &&
    (el.tagName === 'TEXTAREA' ||
      (el.tagName === 'INPUT' &&
        /^(text|search|password|tel|url)$/i.test((el as HTMLInputElement).type))) &&
    typeof (el as HTMLInputElement | HTMLTextAreaElement).selectionStart === 'number';

  const getSelectedText = (): string => {
    // https://stackoverflow.com/q/5379120/2172151
    const el = document.activeElement as Element | null;
    if (isTextField(el)) {
      return (el as HTMLInputElement | HTMLTextAreaElement).value.slice(
        (el as HTMLInputElement | HTMLTextAreaElement).selectionStart!,
        (el as HTMLInputElement | HTMLTextAreaElement).selectionEnd!,
      );
    }
    return window.getSelection?.()?.toString() || '';
  };

  const [response, setResponse] = useState<string>('');

  const [containerStyle, setContainerStyle] = useState<CSSProperties>({
    display: 'none',
  });

  useEffect(() => {
    window.addEventListener('click', ({ target }) => {
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const isContentArea =
        target.tagName.toLowerCase() === 'quick-quill' ||
        target.closest('quick-quill');

      if (!isContentArea) {
        setContainerStyle({
          display: 'none',
        });
      }
    });

    const removeListener = onMessage('qqClickOnSelection', (message) => {
      const selectedText = getSelectedText();

      if (!selectedText) {
        return;
      }

      const selectedPosition = getSelectedPosition();

      setContainerStyle({
        display: 'block',
        left: `${selectedPosition?.left || 0}px`,
        top: `${(selectedPosition?.bottom || 0) + window.scrollY + 10}px`,
      });

      setResponse(`Working on "${message.data.name}"...`);

      getResponse(selectedText, message.data).then((response: string) => {
        setResponse(response);
      });
    });
    return () => removeListener();
  }, []);

  return (
    <>
      <div style={containerStyle}
           className="prose absolute z-50 bg-black text-white rounded-sm h-auto w-auto p-2.5 shadow-md">
        <div
             className="mr-8 max-w-md max-h-52 overflow-y-auto"
              dangerouslySetInnerHTML={{__html: response.replace(/\n/g, '<br>')}}></div>
        <Copy className="text-white cursor-pointer absolute top-1 right-1"
              onClick={() => {
                navigator.clipboard.writeText(response);
                setContainerStyle({
                  display: 'none',
                });
              }}/>
      </div>
    </>
  );
}