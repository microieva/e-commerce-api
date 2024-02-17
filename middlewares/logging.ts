import chalk from "chalk";
import { NextFunction, Request, Response } from "express"

export function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const currentTime = new Date();

  const formattedDate = currentTime.toISOString();
  console.log("\n-------------------------------------------------");
  console.log(`${req.method} ${req.url} ${formattedDate}`);
  
  res.once("finish", () => {
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log(chalk.green(`${res.statusCode} ${res.statusMessage}`));
    } else {
      console.log(chalk.red(`${res.statusCode} ${res.statusMessage}`));
    }
  });

  next();
}
