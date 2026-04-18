import { missingSupabaseConfig } from '../lib/supabase/client'
import { DOVE_HERO_IMAGE } from '../data/constants'

export function SetupPage() {
  return (
    <section className="page-band auth-band">
      <div className="shell-inner auth-layout">
        <div className="auth-copy">
          <p className="eyebrow">Backend setup needed</p>
          <h1>Dove&apos;s sync space is almost ready.</h1>
          <p className="lede">
            This build is waiting for its backend connection, so practice
            history cannot sync across browsers yet.
          </p>
          <p className="storage-note">
            Add the missing environment variables, run the Supabase SQL in the
            repo, and redeploy to turn on cross-device history and resume.
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
