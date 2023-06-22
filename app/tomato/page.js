import styles from './page.module.css'
import { kv } from '@vercel/kv';

export default async function Tomato() {
  const visitorCount = await kv.incr("visitors")

  return (
    <main className="main tomato">
      <div className={styles.tomatoMeter}>
        {"🍅".repeat(visitorCount)}
      </div>
    </main>
  )
}
