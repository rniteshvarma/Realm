// Story text for a chapter. Each beat is visible while `step` equals its
// index. The outer layer is a full-area flex box that places the card
// (left / right / center / low) — no CSS `translate`, so it lays out the
// same in every browser; the inner card does the reveal animation.
export default function Beats({ beats, step }) {
  return (
    <div className="v-beats">
      {beats.map((b, i) => (
        <div key={i} className={`v-beat v-beat--${b.side ?? 'left'} ${step === i ? 'is-on' : ''}`} aria-hidden={step !== i}>
          <div className="v-beat__card">
            {b.kicker && <span className="v-kicker">{b.kicker}</span>}
            {b.title && <h2 className={`v-title ${b.xl ? 'v-title--xl' : ''}`}>{b.title}</h2>}
            {b.body && <p className="v-body">{b.body}</p>}
            {b.metric && <span className="v-metric">{b.metric}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

// Step thresholds from a beats array ({ at } = progress where it begins)
export const stepsOf = (beats) => beats.map((b) => b.at)
