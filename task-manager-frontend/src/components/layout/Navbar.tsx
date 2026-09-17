import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-2xl text-ink">Tâches</span>
          <span className="hidden text-sm text-ink-soft sm:inline">— votre registre du jour</span>
        </div>
        <div className="flex items-center gap-4">
          {user && <span className="hidden text-sm text-ink-soft sm:inline">{user.fullName}</span>}
          <Button variant="secondary" onClick={logout}>
            Se déconnecter
          </Button>
        </div>
      </div>
    </header>
  );
}
