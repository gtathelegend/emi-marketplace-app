import React from 'react';
import { SegmentedSelector, OptionItem } from '../ui/SegmentedSelector';

export interface VariantSelectorProps {
  colorOptions?: OptionItem<string>[];
  selectedColor?: string;
  onColorChange?: (color: string) => void;
  storageOptions?: OptionItem<string>[];
  selectedStorage?: string;
  onStorageChange?: (storage: string) => void;
  className?: string;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  colorOptions = [],
  selectedColor,
  onColorChange,
  storageOptions = [],
  selectedStorage,
  onStorageChange,
  className,
}) => {
  return (
    <div className={`space-y-4 ${className || ''}`}>
      {colorOptions.length > 0 && selectedColor && onColorChange && (
        <SegmentedSelector
          label="Color"
          options={colorOptions}
          value={selectedColor}
          onChange={onColorChange}
          variant="pills"
        />
      )}

      {storageOptions.length > 0 && selectedStorage && onStorageChange && (
        <SegmentedSelector
          label="Storage"
          options={storageOptions}
          value={selectedStorage}
          onChange={onStorageChange}
          variant="pills"
        />
      )}
    </div>
  );
};
