import { useEffect, useMemo, useState } from 'react';
import { AssistantFab } from './components/AssistantFab';
import { BrandMark } from './components/BrandMark';
import { IconButton } from './components/IconButton';
import { StepCard } from './components/StepCard';
import { fetchAssistantReply, fetchDashboard, registerUser } from './api';
import { defaultActivities, defaultAudits, defaultPayments } from './data';
import type { AppUser, StepId, SystemHealth } from './types';

type DashboardState = {
  metrics: {
    revenueToday: number;
    expensesToday: number;
    auditsReviewed: number;
    activitiesToday: number;
  };
  activities: typeof defaultActivities;
  audits: typeof defaultAudits;
  payments: typeof defaultPayments;
};

const initialUser: AppUser = {
  fullName: 'Denise Vargas',
  email: 'denise@venbrax.com',
  phone: '+58 412 000 0000',
  avatarUrl: '',
  locale: 'es-VE'
};

const onboardingCopy: Record<StepId, { title: string; subtitle: string }> = {
  welcome: {
    title: 'Bienvenida, Denise',
    subtitle: 'Vamos a dejar tu sistema listo en pocos pasos.'
  },
  profile: {
    title: 'Tus datos',
    subtitle: 'Necesitamos tu nombre, correo y teléfono para activar tu cuenta.'
  },
  credentials: {
    title: 'Tu clave',
    subtitle: 'Crea una contraseña fuerte para proteger el acceso.'
  },
  biometric: {
    title: 'Huella o FaceID',
    subtitle: 'Si tu teléfono lo permite, activamos acceso con biometría.'
  },
  home: {
    title: 'Sistema listo',
    subtitle: 'Ya puedes entrar al panel principal.'
  }
};

const defaultDashboardState: DashboardState = {
  metrics: { revenueToday: 12500, expensesToday: 990, auditsReviewed: 3, activitiesToday: 3 },
  activities: defaultActivities,
  audits: defaultAudits,
  payments: defaultPayments
};

function App() {
  const [step, setStep] = useState<StepId>('welcome');
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [health, setHealth] = useState<SystemHealth>('todo-bien');
  const [user, setUser] = useState<AppUser>(initialUser);
  const [message, setMessage] = useState('');
  const [assistantText, setAssistantText] = useState('Escríbeme lo que necesites y te lo explico paso a paso.');
  const [onboarded, setOnboarded] = useState(false);
  const [dashboardState, setDashboardState] = useState<DashboardState>(defaultDashboardState);
  const [password, setPassword] = useState('VenBraX123!');
  const [confirmPassword, setConfirmPassword] = useState('VenBraX123!');
  const [credentialError, setCredentialError] = useState('');

  useEffect(() => {
    const stored = window.localStorage.getItem('venbrax-profile');
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as AppUser;
      setUser(parsed);
      setOnboarded(true);
      setStep('home');
    } catch {
      window.localStorage.removeItem('venbrax-profile');
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHealth((current) => (current === 'todo-bien' ? 'recuperando' : 'todo-bien'));
    }, 12000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!onboarded) return;
    fetchDashboard()
      .then((payload) => {
        const data = payload as DashboardState;
        if (data?.metrics) {
          setDashboardState(data);
        }
      })
      .catch(() => {
        setDashboardState(defaultDashboardState);
      });
  }, [onboarded]);

  const systemLabel = useMemo(() => {
    if (health === 'todo-bien') return 'Todo bien';
    if (health === 'recuperando') return 'El sistema se está recuperando solo';
    return 'Atención requerida';
  }, [health]);

  function continueOnboarding(next: StepId) {
    setStep(next);
  }

  function advanceFromCredentials() {
    if (password !== confirmPassword) {
      setCredentialError('Las contraseñas no coinciden. Revisa y prueba otra vez.');
      return;
    }
    setCredentialError('');
    continueOnboarding('biometric');
  }

  function saveProfile() {
    if (password !== confirmPassword) {
      setCredentialError('Las contraseñas no coinciden. Revisa y prueba otra vez.');
      setStep('credentials');
      return;
    }
    setCredentialError('');
    window.localStorage.setItem('venbrax-profile', JSON.stringify(user));
    setOnboarded(true);
    setStep('home');
    registerUser({
      ...user,
      password,
      confirmPassword
    }).catch(() => undefined);
  }

  async function askAssistant() {
    const text = message.trim().toLowerCase();
    if (!text) {
      setAssistantText('Escríbeme lo que necesites y te lo explico paso a paso.');
      return;
    }

    try {
      const response = await fetchAssistantReply(message);
      setAssistantText(response.reply);
      return;
    } catch {
      // Fallback local so the app still works if the API is offline.
    }

    if (text.includes('no entiendo') || text.includes('qué significa') || text.includes('que significa')) {
      setAssistantText(
        'Te lo explico sencillo: es una alerta o una acción del sistema traducida a palabras normales.'
      );
      return;
    }

    if (text.includes('fall') || text.includes('error')) {
      setAssistantText('Todo está bien, el sistema se está recuperando solo. No necesitas hacer nada.');
      return;
    }

    setAssistantText('Entendido. Te ayudo con eso de forma simple y sin tecnicismos.');
  }

  if (!onboarded || step !== 'home') {
    return (
      <main className="app app--onboarding">
        <section className="hero-shell">
          <BrandMark />
          <div className="onboarding-panel">
            <div className="onboarding-panel__copy">
              <span className="status-pill">Configuración inicial</span>
              <h1>{onboardingCopy[step].title}</h1>
              <p>{onboardingCopy[step].subtitle}</p>
            </div>

            {step === 'welcome' && (
              <div className="onboarding-actions">
                <button className="primary-button" type="button" onClick={() => continueOnboarding('profile')}>
                  Comenzar
                </button>
                <button className="ghost-button" type="button" onClick={() => continueOnboarding('home')}>
                  Ya tengo acceso
                </button>
              </div>
            )}

            {step === 'profile' && (
              <StepCard title="Completa tus datos" description="Una sola vez. Después la app te recuerda siempre.">
                <div className="form-grid">
                  <label>
                    Nombre completo
                    <input value={user.fullName} onChange={(e) => setUser({ ...user, fullName: e.target.value })} />
                  </label>
                  <label>
                    Correo electrónico
                    <input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                  </label>
                  <label>
                    Número de teléfono
                    <input value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} />
                  </label>
                </div>
                <div className="step-actions">
                  <button className="ghost-button" type="button" onClick={() => continueOnboarding('welcome')}>
                    Volver
                  </button>
                  <button className="primary-button" type="button" onClick={() => continueOnboarding('credentials')}>
                    Seguir
                  </button>
                </div>
              </StepCard>
            )}

            {step === 'credentials' && (
              <StepCard title="Protege tu acceso" description="Usa una clave que solo tú recuerdes.">
                <div className="form-grid">
                  <label>
                    Contraseña
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </label>
                  <label>
                    Confirmación
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </label>
                </div>
                {credentialError && <p className="form-error">{credentialError}</p>}
                <div className="step-actions">
                  <button className="ghost-button" type="button" onClick={() => continueOnboarding('profile')}>
                    Volver
                  </button>
                  <button className="primary-button" type="button" onClick={advanceFromCredentials}>
                    Seguir
                  </button>
                </div>
              </StepCard>
            )}

            {step === 'biometric' && (
              <StepCard title="Activa biometría" description="Huella o FaceID, si tu teléfono lo permite.">
                <div className="biometric-card">
                  <p>Tu teléfono puede abrir la app con tu huella o con FaceID.</p>
                  <button className="primary-button" type="button" onClick={saveProfile}>
                    Activar y entrar
                  </button>
                </div>
              </StepCard>
            )}

            {step === 'home' && !onboarded && (
              <StepCard title="Acceso existente" description="Si ya tienes cuenta, entra al panel principal.">
                <div className="biometric-card">
                  <p>La app recordará este dispositivo cuando Denise complete el registro inicial.</p>
                  <button className="primary-button" type="button" onClick={saveProfile}>
                    Entrar al dashboard
                  </button>
                </div>
              </StepCard>
            )}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app app--home">
      <aside className="sidebar">
        <BrandMark />
        <nav className="sidebar-nav">
          <IconButton label="Inicio" active icon={<span>⌂</span>} />
          <IconButton label="Auditorías" icon={<span>✓</span>} />
          <IconButton label="Firmas" icon={<span>✦</span>} />
          <IconButton label="Pagos" icon={<span>$</span>} />
          <IconButton label="Ajustes" icon={<span>⚙</span>} />
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="status-pill">Panel principal</span>
            <h1>Bienvenida, Denise</h1>
            <p>{systemLabel}.</p>
          </div>
          <div className="topbar__meta">
            <div className="mini-stat">
              <strong>{dashboardState.metrics.auditsReviewed}</strong>
              <span>Alertas hoy</span>
            </div>
            <div className="mini-stat">
              <strong>{dashboardState.metrics.activitiesToday}</strong>
              <span>Actividades</span>
            </div>
          </div>
        </header>

        <section className="dashboard-grid">
          <article className="hero-card">
            <div className={`health-card health-card--${health}`}>
              <span>Estado del sistema</span>
              <strong>{systemLabel}</strong>
              <p>
                {health === 'todo-bien'
                  ? 'Todos los servicios están activos y respondiendo.'
                  : 'Si algo falla, se recupera solo y Denise no necesita intervenir.'}
              </p>
            </div>
          </article>

          <article className="metric-card">
            <span>Métricas del día</span>
            <strong>BRL {dashboardState.metrics.revenueToday.toLocaleString()}</strong>
            <p>Ingresos confirmados</p>
          </article>

          <article className="metric-card">
            <span>Gastos del día</span>
            <strong>BRL {dashboardState.metrics.expensesToday.toLocaleString()}</strong>
            <p>Pagos operativos</p>
          </article>
        </section>

        <section className="content-grid">
          <StepCard title="Últimas actividades" description="Lo más reciente del sistema.">
            <div className="list-stack">
              {dashboardState.activities.map((item) => (
                <article key={item.id} className="list-row">
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </div>
                  <span>{item.time}</span>
                </article>
              ))}
            </div>
          </StepCard>

          <StepCard title="Auditorías" description="Revisión clara, sin tecnicismos.">
            <div className="list-stack">
              {dashboardState.audits.map((item) => (
                <article key={item.id} className="audit-row">
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.summary}</p>
                  </div>
                  <span className={`badge badge--${item.status}`}>{item.status}</span>
                </article>
              ))}
            </div>
          </StepCard>

          <StepCard title="Pagos" description="Entradas y salidas del día.">
            <div className="payment-summary">
              {dashboardState.payments.map((item) => (
                <div key={item.id} className={`payment-item payment-item--${item.type}`}>
                  <span>{item.label}</span>
                  <strong>{item.type === 'ingreso' ? '+' : '-'} BRL {item.amount.toLocaleString()}</strong>
                  <p>{item.date}</p>
                </div>
              ))}
            </div>
          </StepCard>
        </section>

        <section className="settings-strip">
          <StepCard title="Configuración" description="Ajustes simples para Denise.">
            <div className="settings-row">
              <div className="avatar" aria-hidden="true">
                {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : user.fullName.slice(0, 1)}
              </div>
              <div>
                <strong>{user.fullName}</strong>
                <p>{user.email}</p>
              </div>
              <button className="ghost-button" type="button">
                Cambiar foto
              </button>
            </div>
          </StepCard>
        </section>
      </section>

      <AssistantFab onOpen={() => setAssistantOpen((current) => !current)} pulse />

      {assistantOpen && (
        <aside className="assistant-panel">
          <div className="assistant-panel__head">
            <strong>Asistente</strong>
            <button className="icon-close" type="button" onClick={() => setAssistantOpen(false)}>
              Cerrar
            </button>
          </div>
          <p>{assistantText}</p>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe aquí lo que no entiendes..."
          />
          <div className="step-actions">
            <button className="ghost-button" type="button" onClick={() => setMessage('')}>
              Limpiar
            </button>
            <button className="primary-button" type="button" onClick={askAssistant}>
              Preguntar
            </button>
          </div>
        </aside>
      )}
    </main>
  );
}

export { App };
