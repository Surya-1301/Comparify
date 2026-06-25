// Mappls (MapmyIndia) — returns auth header value for Static Key auth
function getMapplsKey() {
  return process.env.MAPPLS_STATIC_KEY || null;
}

module.exports = { getMapplsKey };
