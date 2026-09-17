import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { extractErrorMessage } from '../api/client';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate('/tasks');
    } catch (err) {
      setError(extractErrorMessage(err, 'Connexion impossible'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout tagline="Ce qui compte, noté simplement.">
      <h1 className="font-display text-2xl text-ink">Se connecter</h1>
      <p className="mt-1 text-sm text-ink-soft">Retrouve tes tâches là où tu les as laissées.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Mot de passe"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-clay">{error}</p>}
        <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
          Se connecter
        </Button>
      </form>

      <p className="mt-6 text-sm text-ink-soft">
        Pas encore de compte ?{' '}
        <Link to="/register" className="font-medium text-moss hover:underline">
          Créer un compte
        </Link>
      </p>
    </AuthLayout>
  );
}
