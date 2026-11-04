const APPAREL: [string, string, string][] = [
  ['XS', '50', '68'],
  ['S', '54', '70'],
  ['M', '58', '72'],
  ['L', '62', '74'],
  ['XL', '66', '76'],
  ['XXL', '70', '78'],
];

export function SizeGuide({ sizes }: { sizes: string[] }) {
  if (sizes.includes('M')) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[280px] text-left text-sm">
          <caption className="mb-2 text-left">Garment measurements in centimetres. Our fits are relaxed; size down for a closer fit.</caption>
          <thead>
            <tr className="border-b border-ink/15 text-ink">
              <th scope="col" className="py-2 pr-4 font-semibold">Size</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Half chest</th>
              <th scope="col" className="py-2 font-semibold">Body length</th>
            </tr>
          </thead>
          <tbody>
            {APPAREL.map(([s, c, l]) => (
              <tr key={s} className="border-b border-ink/10">
                <th scope="row" className="py-2 pr-4 font-medium text-ink">{s}</th>
                <td className="py-2 pr-4 tabular-nums">{c}</td>
                <td className="py-2 tabular-nums">{l}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (sizes.includes('32')) {
    return <p>Waist sizes are in inches. All cargos have a 31-inch inseam and adjustable toggle hems, so length is easy to tune.</p>;
  }
  if (sizes.includes('S/M')) {
    return <p>S/M fits US shoe sizes 5 to 8.5 (EU 36 to 41). L/XL fits US 9 to 12.5 (EU 42 to 46).</p>;
  }
  if (sizes.includes('Junior')) {
    return <p>Junior fits ages 7 to 12 (shoe EU 31 to 37). Adult fits EU 38 to 46.</p>;
  }
  return <p>Choose the letter you want printed on your keychain. Each one is printed to order.</p>;
}
