import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import useSWR from "swr";
import { Sub } from "../types";
import axios from "axios";
import { useAuthState } from "../context/auth";

export default function Home() {
  const { authenticated } = useAuthState();

  const address = "http://localhost:4000/api/subs/sub/topSubs";
  const { data: tobSubs } = useSWR<Sub[]>(address);

  return (
    <div className='flex max-w-5xl px-4 mx-auto'>
      {/* 포스트 리스트 */}
      <div className='w-full md:mr-3 md:w-8/12'></div>
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
