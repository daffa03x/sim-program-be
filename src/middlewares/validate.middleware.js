const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.passthrough().parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // Only overwrite with validated data if the schema defined it
    if (parsed.body !== undefined) req.body = parsed.body;
    if (parsed.query !== undefined) req.query = parsed.query;
    if (parsed.params !== undefined) req.params = parsed.params;
    
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
