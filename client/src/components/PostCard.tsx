import React from "react";
import { Post } from "../types";
import { HiArrowUp, HiArrowDown } from "react-icons/hi2";
import classNames from "classnames";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { FaCommentAlt } from "react-icons/fa";
import { useAuthState } from "../context/auth";
import { useRouter } from "next/router";
import axios from "axios";

interface PostCardProps {
  post: Post;
  subMutate?: () => void;
  mutate?: () => void;
}

const PostCard = ({ post, subMutate, mutate }: PostCardProps) => {
  const {
    identifier,
    slug,
    body,
    title,
    subName,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    url,
    username,
    sub,
  } = post;

  const { authenticated } = useAuthState();
  const router = useRouter();
  const isInSubPage = router.pathname === `/r/[sub]`;

  const vote = async (value: number) => {
    if (!authenticated) return router.push("/login");

    if (value === userVote) value = 0;

    try {
      await axios.post("/votes", { identifier, slug, value });
      if (subMutate) subMutate();
      if (mutate) mutate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex mb-4 bg-white rounded' id={identifier}>
      {/* 좋아요 싫어요 기능 */}
      <div className='flex-shrink-0 w-10 py-2 text-center rounded-l'>
        <div
          className='w-6 mx-auto text-gray-500 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500 mb-1'
          onClick={() => vote(1)}
        >
          <i
            className={classNames({
              "text-red-500": userVote === 1,
            })}
          >
            <HiArrowUp className='inline-block' />
          </i>
        </div>
        <p className='text-xs font-bold'>{voteScore}</p>
        <div
          className='w-6 mx-auto text-gray-500 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500'
          onClick={() => vote(-1)}
        >
          <i
            className={classNames({
              "text-blue-500": userVote === -1,
            })}
          >
            <HiArrowDown className='inline-block' />
          </i>
        </div>
      </div>

      {/* 게시글 */}
      <div className='w-full p-2'>
        <div className='flex items-center'>
          {!isInSubPage && (
            <div className='flex items-center'>
              {/* <Link href={`/r/${subName}`}>
            <a>
            <Image
            src={sub!.imageUrl}
            alt='sub'
            className='rounded-full cursor-pointer'
            width={12}
            height={12}
            />
            </a>
        </Link> */}
              <Link href={`/r/${subName}`}>
                <a className='ml-2 text-xs font-bold cursor-pointer hover:underline'>
                  /r/{subName}
                </a>
              </Link>
              <span className='mx-1 text-xs text-gray-400'>·</span>
            </div>
          )}

          <p className='text-xs text-gray-400'>
            Posted by{" "}
            <Link href={`/u/${username}`}>
              <a className='mx-1 hover:underline'>/u/{username}</a>
            </Link>
            <Link href={url}>
              <a className='mx-1 hover:underline'>
                {dayjs(createdAt).format("YYYY-MM-DD HH:mm")}
              </a>
            </Link>
          </p>
        </div>
        <Link href={url}>
          <a className='my-1 text-lg font-medium'>{title}</a>
        </Link>
        {body && <p className='my-1 text-sm'>{body}</p>}
        <div className='flex'>
          <Link href={url}>
            <a>
              <FaCommentAlt className='inline-block' />
              <span> {commentCount}</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
