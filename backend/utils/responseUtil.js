function successResponse(res, data, message = 'OK') {
  return res.status(200).json({ success: true, message, data });
}

function errorResponse(res, error, status = 400) {
  return res.status(status).json({ success: false, message: error });
}

module.exports = { successResponse, errorResponse };
