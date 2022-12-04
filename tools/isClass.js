module.exports = (v) => {
  return typeof v === 'function' && v.prototype.constructor === v;
}
