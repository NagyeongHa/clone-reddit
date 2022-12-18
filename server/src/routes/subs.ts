import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import User from "../entities/User";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import { isEmpty } from "class-validator";
import { AppDataSource } from "../data-source";
import Sub from "../entities/Sub";

const router = Router();

const createSub = async (req: Request, res: Response, next: NextFunction) => {
  const { name, title, description } = req.body;

  //유저 정보가 있다면 sub 이름과 제목이 이미 있는 것인지 확인
  try {
    let errors: any = {};
    if (isEmpty(name)) errors.name = "이름은 비워둘 수 없습니다.";
    if (isEmpty(title)) errors.title = "제목은 비워둘 수 없습니다";

    const sub = await AppDataSource.getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name)=:name", { name: name.toLowerCase() })
      .getOne();

    if (sub) errors.name = "같은 이름이 이미 존재합니다.";

    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다" });
  }

  //sub 디비에 저장
  try {
    const user: User = res.locals.user;

    const sub = new Sub();
    sub.name = name;
    sub.title = title;
    sub.description = description;
    sub.user = user;

    await sub.save();
    return res.json(sub);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다" });
  }
};
router.post("/", userMiddleware, authMiddleware, createSub);

export default router;
