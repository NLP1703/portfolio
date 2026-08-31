import { useState, type FormEvent } from 'react'
import { FiSend } from 'react-icons/fi'
import { site } from '../data/site'

type Status = 'idle' | 'sending' | 'composed' | 'sent' | 'error'

/** Au-delà, certains clients de messagerie tronquent l'URL mailto. */
const MESSAGE_MAX = 1500

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Champ invisible : seul un robot le remplit.
    if (honeypot) return

    setStatus('sending')

    if (!site.formEndpoint) {
      const subject = `Portfolio — message de ${name}`
      const body = `${message}\n\n—\n${name}\n${email}`
      window.location.href =
        `mailto:${site.links.email}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`
      setStatus('composed')
      return
    }

    try {
      const response = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (!response.ok) throw new Error(String(response.status))
      setStatus('sent')
      setName('')
      setEmail('')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  const feedback: Record<Status, string> = {
    idle: '',
    sending: 'Envoi en cours…',
    composed: `Votre logiciel de messagerie s'ouvre avec le message pré-rempli. S'il ne s'ouvre pas, écrivez-moi à ${site.links.email}.`,
    sent: 'Message envoyé. Je vous réponds sous quelques jours.',
    error: `L'envoi a échoué. Écrivez-moi directement à ${site.links.email}.`,
  }

  return (
    <form onSubmit={handleSubmit} className="card mx-auto w-full max-w-xl text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-nom" className="field-label">
            Nom
          </label>
          <input
            id="contact-nom"
            name="nom"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="field-input"
            placeholder="Votre nom"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="field-label">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="field-input"
            placeholder="vous@exemple.com"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="contact-message" className="field-label">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          maxLength={MESSAGE_MAX}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="field-input resize-y"
          placeholder="Décrivez votre projet ou votre proposition."
        />
        <p className="mt-2 text-right text-tag text-ink-muted">
          {message.length} / {MESSAGE_MAX}
        </p>
      </div>

      {/* Piège à robots : masqué visuellement et retiré de la navigation. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-site">Ne pas remplir</label>
        <input
          id="contact-site"
          name="site"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-primary" disabled={status === 'sending'}>
          <FiSend size={16} aria-hidden="true" />
          {status === 'sending' ? 'Envoi…' : 'Envoyer le message'}
        </button>
      </div>

      <p role="status" aria-live="polite" className="mt-4 min-h-[1.5em] text-caption text-ink-secondary">
        {feedback[status]}
      </p>
    </form>
  )
}
