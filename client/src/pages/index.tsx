import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import useSWR from "swr";
import { Post, Sub } from "../types";
import axios from "axios";
import { useAuthState } from "../context/auth";
import useSWRInfinite from "swr/infinite";
import PostCard from "../components/PostCard";
import { useEffect, useState } from "react";

export default function Home() {
  const [observedPost, setObservedPost] = useState("");
  const { authenticated } = useAuthState();

  const address = "http://localhost:4000/api/subs/sub/topSubs";
  const { data: tobSubs } = useSWR<Sub[]>(address);

  const getKey = (pageIndex: number, previousPageData: Post[]) => {
    console.log("previousPageData", previousPageData);
    console.log("pageIndex", pageIndex);
    console.log("=====", previousPageData && !previousPageData.length);

    if (previousPageData && !previousPageData.length) return null; //끝에 도달
    return `/posts?page=${pageIndex}`; //SWR key
  };

  const {
    data,
    error,
    size: page,
    setSize: setPage,
    isValidating,
    mutate,
  } = useSWRInfinite<Post[]>(getKey);

  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? ([] as Post[]).concat(...data) : [];

  useEffect(() => {
    //포스트가 없다면 return
    if (!posts || !posts.length) return;
    //posts 배열안에 마지막 post.id를 가져옴
    const id = posts[posts.length - 1].identifier;
    //posts 배열에 posts가 추가돼서 마지막 posts가 바뀌었다면
    //바뀐 post 중 마지막 post를 ovservedPost 로 변경

    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);

  const observeElement = (element: HTMLElement | null) => {
    console.log(element);

    if (!element) return;

    //브라우저 뷰포트(ViewPort)와 설정한 요소(element)의 교차점을 관찰
    //entries는 IntersectionObserverEntry 인스턴스의 배열
    //isIntersecting : 관찰 대상의 교차 상태( Boolean )
    const observer = new IntersectionObserver(
      entries => {
        console.log("entries", entries);

        if (entries[0].isIntersecting) {
          console.log("마지막 포스트에 왔습니다");
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 }
    );
    //대상 요소의 관찰을 시작
    observer.observe(element);
  };
  console.log("data", data, "page", page);

  return (
    <div className='flex max-w-5xl px-4 mx-auto'>
      {/* 포스트 리스트 */}
      <div className='w-full md:mr-3 md:w-8/12'>
        {isInitialLoading && (
          <p className='text-lg text-center'>로딩중입니다...</p>
        )}
        {posts?.map(post => (
          <PostCard key={post.identifier} post={post} mutate={mutate} />
        ))}
      </div>

      {/*사이드바*/}
      <div className='hidden w-4/12 ml-3 md:block'>
        <div className='bg-white border rounded'>
          <div className='p-4 border-b'>
            <p className='text-lg font-semibold text-center'>상위 커뮤니티</p>
          </div>

          {/* 커뮤니티 리스트 */}
          <div>
            {tobSubs?.map(sub => (
              <div
                key={sub.name}
                className='flex items-center px-4 py-2 text-xs border-b'
              >
                <Link href={`/r/${sub.name}`}>
                  <a>
                    <Image
                      src={sub.imageUrl}
                      alt='subs'
                      className='rounded-full cursor-pointer'
                      width={24}
                      height={24}
                    />
                  </a>
                </Link>
                <Link href={`/r/${sub.name}`}>
                  <a className='ml-2 font-bold hover:cursor-pointer'>
                    /r/{sub.name}
                  </a>
                </Link>
                <p className='ml-auto font-md'>{sub.postCount}</p>
              </div>
            ))}
          </div>
          {authenticated && (
            <div className='w-full py-6 text-center'>
              <Link href='/subs/create'>
                <a className='w-full p-2 text-center text-white bg-gray-400 rounded'>
                  커뮤니티 만들기
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
