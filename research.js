(() => {
  "use strict";
  const explorer = document.getElementById("carbon-explorer");
  const table = document.getElementById("carbon-source");
  const i18n = window.PORTFOLIO_I18N;
  if (!explorer || !table || !i18n) return;

  // The accessible source table is the only data source. This displays the
  // paper's four reported scenarios; it does not run or interpolate the model.
  const rows = [...table.querySelectorAll("tbody tr")];
  const scenarios = rows.map((row) => ({
    row,
    price: Number(row.dataset.price),
    changed: Number(row.dataset.changed),
    movement: Number(row.dataset.movement),
  }));
  const radios = [...explorer.querySelectorAll('input[name="carbon-price"]')];
  if (
    scenarios.length !== 4 ||
    scenarios.some(
      (s) =>
        !Number.isFinite(s.price) ||
        !Number.isInteger(s.changed) ||
        s.changed < 0 ||
        s.changed > 25 ||
        !Number.isFinite(s.movement) ||
        s.movement < 0,
    ) ||
    radios.some((r) => !scenarios.some((s) => s.price === Number(r.value)))
  )
    return;

  const cells = [...explorer.querySelectorAll(".di-carbon-cells span")];
  function render() {
    const checked = radios.find((r) => r.checked);
    const selected = scenarios.find((s) => s.price === Number(checked?.value));
    if (!selected) return;
    document.getElementById("carbon-count").textContent =
      i18n.number(selected.changed, 0) + " / " + i18n.number(25, 0);
    document.getElementById("carbon-price-value").textContent = i18n.number(
      selected.price,
      0,
    );
    document.getElementById("carbon-movement").textContent = i18n.number(
      selected.movement,
      2,
    );
    cells.forEach((cell, index) =>
      cell.classList.toggle("is-changed", index < selected.changed),
    );
    rows.forEach((row) => {
      row.dataset.selected = String(row === selected.row);
    });
  }
  explorer.addEventListener("change", render);
  render();
  table.closest("details").open = false;
  explorer.hidden = false;
})();
