import {useLocalStorageToggle} from "../hooks/useLocalStorageToggle";
import {useRenderTrigger} from "../hooks/useRenderTrigger.tsx";

interface ToggleProps {
    storageKey: string;
    label?: string;
    disabled?: boolean;
    className?: string;
    onChange?: (value: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({
                                                  storageKey,
                                                  label,
                                                  disabled = false,
                                                  className = '',
                                                  onChange
                                              }) => {
    const { value, toggle } = useLocalStorageToggle(storageKey);
    const { value: glassMode  } = useLocalStorageToggle('glass')
    const { rerender } = useRenderTrigger();

    const handleToggle = () => {
        if (!disabled) {
            toggle();
            rerender();
            onChange?.(value);
        }
    };

    return (
        <div className={`flex items-center gap-3 my-2 ${className}`}>
            {label && (
                <label
                    htmlFor={`toggle-${storageKey}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                >
                    {label}
                </label>
            )}
            { glassMode && (
                <button
                    id={`toggle-${storageKey}`}
                    type="button"
                    role="switch"
                    aria-checked={value}
                    disabled={disabled}
                    onClick={handleToggle}
                    className={`
                      glass-toggle
                      ${value ? 'active' : ''}
                      ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
                    `}
                >
                </button>
            )}
            { !glassMode && (
                <button
                    id={`toggle-${storageKey}`}
                    type="button"
                    role="switch"
                    aria-checked={value}
                    disabled={disabled}
                    onClick={handleToggle}
                    className={`
                  relative w-12 h-6 border-none rounded-full cursor-pointer 
                  transition-all duration-200 ease-in-out outline-none p-0
                  focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
                  ${value ? 'bg-blue-500' : 'bg-gray-300'}
                  ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-80'}
                `}
                >
                <span
                    className={`
                    absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white
                    transition-transform duration-200 ease-in-out
                    shadow-sm
                    ${value ? 'transform translate-x-6' : 'transform translate-x-0'}
                  `}
                />
                </button>
            )}

        </div>
    );
};