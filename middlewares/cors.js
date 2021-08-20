const allowedCors = [
  'https://kuzinartemiy.nomoredomains.monster',
  'http://kuzinartemiy.nomoredomains.monster',
  'http://localhost:3000',
];

function setCors(req, res, next) {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (allowedCors.includes(origin)) {
    console.log(origin);
    res.header('Access-Control-Allow-Origin', '*');
    console.log(res.header);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
}

module.exports = {
  setCors,
};
