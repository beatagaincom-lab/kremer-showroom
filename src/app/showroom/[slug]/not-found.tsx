import Link from "next/link";

export default function ShowroomNotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5 text-center">
      <div>
        <p className="text-sm text-sky-strong">Kremer Showroom</p>
        <h1 className="mt-4 font-serif text-6xl">Diese Präsentation ist nicht verfügbar.</h1>
        <p className="mx-auto mt-5 max-w-xl text-muted">Der Link ist möglicherweise abgelaufen oder wurde noch nicht veröffentlicht.</p>
        <Link className="button-primary mt-8" href="/">Zur Startseite</Link>
      </div>
    </main>
  );
}
