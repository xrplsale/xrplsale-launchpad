import { Navigation } from '@/components/shared/Navigation';

interface HeaderProps {
  variant?: 'default' | 'transparent' | 'elevated';
}

export function Header({ variant = 'default' }: HeaderProps) {
  return (
    <Navigation variant={variant} />
  );
}