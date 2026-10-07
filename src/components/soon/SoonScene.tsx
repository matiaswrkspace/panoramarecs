import "./soon.css";

// Pagina "coming soon": solo la scritta, illuminata da un lampione nella notte
// che si accende e ogni tanto sfarfalla.
export default function SoonScene() {
  return (
    <main className="soon">
      <div className="soon-lamp" aria-hidden="true" />
      <h1 className="soon-text">Coming soon...</h1>
    </main>
  );
}
