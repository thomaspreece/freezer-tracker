export const applyStringFilterToItem = (array, text) => {
  const ltext = text.trim().toLowerCase()
  if (ltext.length === 0) {
    return array
  }
  if (ltext.length > 0 && ltext.length < 3) {
    return array.filter((item) => item.name.toLowerCase().slice(0, ltext.length) === ltext)
  }
  return array.filter((item) => item.name.toLowerCase().indexOf(ltext) !== -1)
}
