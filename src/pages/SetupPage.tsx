import { missingSupabaseConfig } from '../lib/supabase/client'
import { DOVE_HERO_IMAGE } from '../data/constants'

export function SetupPage() {
  return (
    <section className="page-band auth-band">
      <div className="shell-inner auth-layout">
        <div className="auth-copy">
          <p className="eyebrow">Hosted setup needed</p>
          <h1>This build is waiting for hosted credentials.</h1>
          <p className="lede">
            The ready-to-run local backend is not part of this deployment, so
            hosted sign-in needs its Supabase connection before storage can
            work.
          </p>
          <p className="storage-note">
            Add the missing environment variables, run the Supabase SQL in the
            repo, and redeploy to turn on hosted accounts and saved progress.
          </p>
          <div className="code-card">
            <pre>
              <code>
                VITE_SUPABASE_URL=
                {'\n'}
                VITE_SUPABASE_PUBLISHABLE_KEY=
              </code>
            </pre>
          </div>
          <p className="setup-copy">
            Missing in this build: {missingSupabaseConfig.join(', ')}
          </p>
        </div>

        <figure className="setup-figure">
          <img
            src={DOVE_HERO_IMAGE}
            alt="White dove in flight against a blue sky"
          />
        </figure>
      </div>
    </section>
  )
}
