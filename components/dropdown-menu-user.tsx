import {
    LogOut,
  } from "lucide-react"
  
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  

  export function DropdownMenuUser({
    usuario,
    onClickLogout,
    children
  }: {
    usuario: { nome: string },
    onClickLogout: () => void,
    children: React.ReactNode
  }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>{usuario.nome}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onClickLogout()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  