import { Languages } from 'lucide-react';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { useTranslation } from '../../hooks/useTranslation';

export function LanguageToggle() {
  const { changeLanguage, getCurrentLanguage, getAvailableLanguages, getLanguageLabel } = useTranslation();
  const currentLanguage = getCurrentLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Languages className="h-4 w-4 mr-2" />
          {getLanguageLabel(currentLanguage)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {getAvailableLanguages().map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => changeLanguage(lang)}
            className={currentLanguage === lang ? 'bg-accent' : ''}
          >
            {getLanguageLabel(lang)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 