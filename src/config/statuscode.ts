const statusCode = {
  // 1xx Informational
  processing: 102,

  // 2xx Success
  success: 200,
  created: 201,
  accepted: 202,
  nonAuthoritativeInformation: 203,

  // 3xx Redirection
  notModified: 304,
  temporaryRedirect: 307,
  permanentRedirect: 308,

  // 4xx Client Errors
  badRequest: 400,
  unauthorized: 401,
  paymentRequired: 402,
  forbidden: 403,
  notFound: 404,
  methodNotAllowed: 405,
  requestTimeout: 408,

  // 5xx Server Errors
  internalServerError: 500,
  notImplemented: 501,
  badGateway: 502,
  serviceUnavailable: 503,
  gatewayTimeout: 504,
} as const;

type StatusCodeKeys = keyof typeof statusCode;
type StatusCodeValues = (typeof statusCode)[StatusCodeKeys];

const statusMessage: Record<StatusCodeKeys, string> = {
  processing: 'Processing',

  success: 'OK',
  created: 'Created Successfully',
  accepted: 'Accepted',
  nonAuthoritativeInformation: 'Non-Authoritative Information',

  notModified: 'Not Modified',
  temporaryRedirect: 'Temporary Redirect',
  permanentRedirect: 'Permanent Redirect',

  // 4xx Client Errors
  badRequest: 'Bad Request',
  unauthorized: 'Unauthorized',
  paymentRequired: 'Payment Required',
  forbidden: 'Forbidden',
  notFound: 'Not Found',
  methodNotAllowed: 'Method Not Allowed',
  requestTimeout: 'Request Timeout',

  // 5xx Server Errors
  internalServerError: 'Internal Server Error',
  notImplemented: 'Not Implemented',
  badGateway: 'Bad Gateway',
  serviceUnavailable: 'Service Unavailable',
  gatewayTimeout: 'Gateway Timeout',
};

export { statusCode, statusMessage, StatusCodeKeys, StatusCodeValues };
