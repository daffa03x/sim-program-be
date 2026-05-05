const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // Assign validated and typed data back to req
    req.body = parsed.body;
    req.query = parsed.query;
    req.params = parsed.params;
    
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors
    });
  }
};

module.exports = validate;
