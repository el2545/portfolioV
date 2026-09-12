export function prepareStyle(style, sourceUrl) {
  const absolute = (value) =>
    new URL(value, sourceUrl).href
      .replaceAll("%7B", "{")
      .replaceAll("%7D", "}");
  const filter = (expression) => {
    if (!Array.isArray(expression)) return expression;
    // Missing road-reference lengths must exclude shields, as the provider intended.
    if (
      expression[0] === "<=" &&
      expression[1]?.[0] === "get" &&
      expression[1][1] === "ref_length" &&
      expression[2] === 6
    ) {
      return ["<=", ["number", ["get", "ref_length"], 7], 6];
    }
    return expression.map(filter);
  };
  const result = {
    ...style,
    sources: {},
    layers: style.layers.map((layer) =>
      layer.filter ? { ...layer, filter: filter(layer.filter) } : layer,
    ),
  };
  for (const [id, source] of Object.entries(style.sources)) {
    result.sources[id] = { ...source };
    if (source.url) result.sources[id].url = absolute(source.url);
    if (source.tiles) result.sources[id].tiles = source.tiles.map(absolute);
  }
  if (typeof style.sprite === "string") result.sprite = absolute(style.sprite);
  else if (Array.isArray(style.sprite))
    result.sprite = style.sprite.map((sprite) => ({
      ...sprite,
      url: absolute(sprite.url),
    }));
  if (style.glyphs) result.glyphs = absolute(style.glyphs);
  return result;
}
