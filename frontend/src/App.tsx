import { createEffect, createSignal, For } from 'solid-js'
import './App.css'

type EmojiResponse = {
  description: string;
  edition: number;
  emoji: string;
  name: string;
  score?: number;
}

function App() {
  const [results, setResults] = createSignal<EmojiResponse[]>([]);
  const [pending, setPending] = createSignal(false);
  const [searchTerm, setSearchTerm] = createSignal<string>("");

  createEffect(async () => {
    const query = searchTerm();

    if (query) {
      const qp = new URLSearchParams({ query })
      setPending(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}?${qp.toString()}`);

        const emojis = await response.json()

        setResults(emojis);
      } finally {
        setPending(false);
      }
    }
  });

  const submit = (event: Event & { currentTarget: HTMLFormElement }) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget).get("query");

    setSearchTerm(data?.toString() ?? "");
  }

  const numberFormatter = new Intl.NumberFormat(undefined, { style: 'percent' })

  return (
    <>
      <h1>Emoji Search</h1>
      <form onSubmit={submit} inert={pending()}>
        <input type="search" name="query" />
        <button type="submit">{pending() ? "Loading..." : "Search"}</button>
      </form>
      <ul class="results">
        <For each={results()}>{(emoji) =>
          <li>
            <div>
              <span class="icon">{emoji.emoji}</span>
              ({emoji.name})
            </div>
            <p>{emoji.description}</p>
            <p> Released in V{emoji.edition}</p>
            {emoji.score && <p>Vector Score: {numberFormatter.format(emoji.score)}</p>}
          </li>
        }</For>
      </ul>
    </>
  )
}

export default App
