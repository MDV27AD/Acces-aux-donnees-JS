import express from "express";
import { body, matchedData, query, validationResult } from "express-validator";

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get("/hello", (_, res) => {
  res.json("Hello, world !");
});

app.post(
  "/hello",
  body("name")
    .notEmpty()
    .withMessage("Missing name")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
    }

    const data = matchedData(req);
    res.json(`Hello, ${data.name}!`);
  }
);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
