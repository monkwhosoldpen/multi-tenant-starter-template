'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Option {
  value: string;
  label: string;
  image?: string;
}

interface AutoCompleteProps {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
}

export function AutoComplete({
  options,
  value,
  onValueChange,
  placeholder = "Search...",
  emptyText = "No results found.",
  disabled = false
}: AutoCompleteProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
          disabled={disabled}
        >
          {value ? (
            <div className="flex items-center gap-2">
              {options.find((option) => option.value === value)?.image && (
                <img
                  src={options.find((option) => option.value === value)?.image}
                  alt=""
                  className="w-6 h-6 rounded-full"
                />
              )}
              {options.find((option) => option.value === value)?.label}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => {
                  onValueChange(option.value);
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  {option.image && (
                    <img
                      src={option.image}
                      alt=""
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  {option.label}
                </div>
                <Check
                  className={cn(
                    'ml-auto h-4 w-4',
                    value === option.value ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 