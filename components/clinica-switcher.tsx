"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle, Store } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useParams, useRouter } from "next/navigation"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface ClinicaSwitcherProps extends PopoverTriggerProps {
  items: Record<string, any>[];
}

export default function ClinicaSwitcher({ className, items = [] }: ClinicaSwitcherProps) {
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id
  }));

  const currentClinica = formattedItems.find((item) => item.value === params.clinicaId);

  const [open, setOpen] = React.useState(false)

  const onClinicaSelect = (clinica: { value: string, label: string }) => {
    setOpen(false);
    router.push(`/${clinica.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a clinica"
          className={cn("w-[200px] justify-between", className)}
        >
          <Store className="mr-2 h-4 w-4" />
          {currentClinica?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Procurar Clínica..." />
            <CommandEmpty>No clinica found.</CommandEmpty>
            <CommandGroup heading="Clinicas">
              {formattedItems.map((clinica) => (
                <CommandItem
                  key={clinica.value}
                  onSelect={() => onClinicaSelect(clinica)}
                  className="text-sm"
                >
                  <Store className="mr-2 h-4 w-4" />
                  {clinica.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentClinica?.value === clinica.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Adicionar Clínica
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
