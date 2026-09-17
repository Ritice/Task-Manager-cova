import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { extractErrorMessage, extractFieldErrors } from '../api/client';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      await register({ fullName, email, password });
      navigate('/tasks');
    } catch (err) {
      setError(extractErrorMessage(err, 'Inscription impossible'));
      setFieldErrors(extractFieldErrors(err) ?? {});
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout tagline="Commence ton registre aujourd'hui.">
      <h1 className="font-display text-2xl text-ink">Créer un compte</h1>
      <p className="mt-1 text-sm text-ink-soft">Quelques secondes suffisent.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Input
          label="Nom complet"
          autoComplete="name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={fieldErrors.fullName}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />
        <Input
          label="Mot de passe"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />
        {error && <p className="text-sm text-clay">{error}</p>}
        <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
          Créer mon compte
        </Button>
      </form>

      <p className="mt-6 text-sm text-ink-soft">
        Déjà inscrit ?{' '}
        <Link to="/login" className="font-medium text-moss hover:underline">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}
