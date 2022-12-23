import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import User from "../entities/User";
import Post from "../entities/Post";
import Comment from "../entities/Comment";

const getUSerData = async (req: Request, res: Response) => {
  try {
    //유저정보 가져오기
    const user = await User.findOneOrFail({
      where: { username: req.params.username },
      select: ["username", "createdAt"],
    });

    //유저가 쓴 포스트 정보 가져오기
    // 여기서 comments 와 votes를  relations으로 넣어주는 이유는
    // Post Entity에서 commentCount의 this.comments 와
    // voteScore의 this.votes를 가져오기 위해서이다
    const posts = await Post.find({
      where: { username: user.username },
      relations: ["comments", "votes", "sub"],
    });

    //유저가 쓴 댓글 정보 가져오기
    const comments = await Comment.find({
      where: { username: user.username },
      relations: ["post"],
    });

    //userVote 정보 가져오기
    if (res.locals.user) {
      const { user } = res.locals;
      posts.forEach(p => p.setUserVote(user));
      comments.forEach(c => c.setUserVote(user));
    }

    //userData에 post 와 comment 정보 담기
    let userData: any[] = [];

    //toJSON() 해주는 이유는?
    // spread operator를 이용해서 새로운 객체로 복사를 할 때 인스턴스 상태로 하면
    // @Expose 를 이용한 getter는 들어가지 않는다 그래서 객체로 바꾼 후 복사해준다
    posts.forEach(p => userData.push({ type: "Post", ...p.toJSON() }));
    comments.forEach(c => userData.push({ type: "Comment", ...c.toJSON() }));

    //최신 정보가 먼저 오도록 순서 정렬
    userData.sort((a, b) => {
      if (b.createdAt > a.createdAt) return 1;
      if (b.createdAt < a.createdAt) return -1;
      return 0;
    });
    return res.json({ user, userData });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "getUSerData에서 문제가 발생했습니다" });
  }
};
const router = Router();
router.get("/:username", userMiddleware, getUSerData);
export default router;
