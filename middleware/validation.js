const validationMiddleware = (schema) => {
    return (req, res, next) => {
      try {
        const { error } = schema.validate(req.body);
  
        if (error) {
          console.log("Validation error:", error.details);
          return res.status(400).json({ message: "Validation failed", details: error.details });
        }
  
        console.log("Validation successful");
        next(); 
      } catch (err) {
        console.error("Validation error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
    };
  };
  
  export default validationMiddleware;