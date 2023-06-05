import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSession, signIn, signOut} from "next-auth/react";
import { RiKakaoTalkFill } from "react-icons/ri";
import { AiOutlineGoogle } from "react-icons/ai";

export default function Signin() {
  const router = useRouter();
  const { data: session } = useSession();
  
  //로그인이 이미 되어 있으면 메인 페이지로 이동
  if (session){
    router.push('/');
  };
  useEffect(()=>{
    console.log(session);
  })

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div id="root" className="w-[650px] h-[400px] bg-gray-lightest shadow-xl rounded-3xl flex justify-center">
        {session?
        <div className="flex flex-col justify-center text-center space-y-10">
          <div className="font-semibold text-xl">로그인 중입니다.<br/><br/>잠시 기다려주세요.</div>
        </div>
          :
        <div className="flex flex-col justify-center text-center space-y-10">
          <div className="font-semibold text-xl">서비스 이용을 위해서<br/>로그인을 해주세요.</div>
          <div className="flex justify-center space-x-4">
            <button
              className={`flex items-center justify-center font-bold
                        p-4 bg-blue text-gray-lightest
                        border border-blue-500 rounded
                        hover:bg-gray-lightest hover:text-blue`}
              onClick={() => signIn('google')}
            >
              <AiOutlineGoogle className="mr-2 text-2xl" /> {/*구글 아이콘*/}
              <span className="text-xl">구글로 로그인</span>
            </button>
            <button
              className={`flex items-center justify-center font-bold
                        p-4 bg-yellow text-gray-lightest
                        border border-yellow-300 rounded
                        hover:bg-gray-lightest hover:text-yellow`}
              onClick={() => signIn('kakao')}
            >
              <RiKakaoTalkFill className="mr-2 text-2xl" /> {/*카카오 아이콘*/}
              <span className="text-xl">카카오로 로그인</span>
            </button>
          </div>
        </div>}
        
      </div>
    </div>
  );
}