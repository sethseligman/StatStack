import React from 'react';

const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

interface QwertyKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  isDisabled?: boolean;
}

export const QwertyKeyboard: React.FC<QwertyKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onEnter,
  isDisabled
}) => {
  return (
    <div className="w-full max-w-[540px] mx-auto px-1 sm:px-2 mt-4">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex justify-center gap-[6px] mb-[6px]"
        >
          {rowIndex === 2 && (
            <button
              onClick={onEnter}
              disabled={isDisabled}
              className="keyboard-key keyboard-key-special bg-slate-300 dark:bg-neutral-600 font-medium"
            >
              Enter
            </button>
          )}
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              disabled={isDisabled}
              className="keyboard-key flex-1 bg-slate-200 dark:bg-neutral-700"
            >
              {key}
            </button>
          ))}
          {rowIndex === 2 && (
            <button
              onClick={onBackspace}
              disabled={isDisabled}
              className="keyboard-key keyboard-key-special bg-slate-300 dark:bg-neutral-600 font-medium"
            >
              ←
            </button>
          )}
        </div>
      ))}
      
      {/* Space Bar */}
      <div className="flex justify-center">
        <button
          onClick={() => onKeyPress(' ')}
          disabled={isDisabled}
          className="keyboard-key bg-slate-200 dark:bg-neutral-700 w-[calc(100%-100px)]"
        >
          space
        </button>
      </div>

      <style>{`
        .keyboard-key {
          height: 58px;
          min-width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          font-weight: 500;
          font-size: 14px;
          text-transform: uppercase;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
        }

        .keyboard-key-special {
          flex: 2;
          min-width: 65px;
        }

        @media (max-width: 639px) {
          .keyboard-key {
            height: 52px;
            min-width: 32px;
            font-size: 13px;
          }

          .keyboard-key-special {
            min-width: 50px;
            width: 50px;
            flex: none;
          }
        }

        .keyboard-key:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .keyboard-key:not(:disabled):active {
          background-color: var(--color-neutral-400) !important;
        }
      `}</style>
    </div>
  );
} 