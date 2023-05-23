import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { RiKakaoTalkFill } from "react-icons/ri";
import { AiOutlineGoogle } from "react-icons/ai";

export default function Signin() {
  const router = useRouter();
  const { data: session } = useSession();
  
  //로그인이 이미 되어 있으면 메인 페이지로 이동
  if (session){
    router.push('/');
  };

  return (
    <div className="flex justify-center h-screen">
      <div className="flex flex-col justify-center text-center space-y-4">
        <div>서비스 이용을 위해서<br/>로그인을 해주세요.</div>
        <div className="flex justify-center space-x-4">
        <button
          className={`flex items-center justify-center
                    p-4 bg-blue-500 text-white
                    border border-blue-500 rounded
                    hover:bg-white hover:text-blue-500`}
          onClick={() => signIn('google')}
        >
          <AiOutlineGoogle className="mr-2 text-2xl" /> {/*구글 아이콘*/}
          <span className="text-xl">구글로 로그인</span>
        </button>
        <button
          className={`flex items-center justify-center
                    p-4 bg-yellow-300 text-amber-950
                    border border-yellow-300 rounded
                    hover:bg-white hover:text-yellow-300`}
          onClick={() => signIn('kakao')}
        >
          <RiKakaoTalkFill className="mr-2 text-2xl" /> {/*카카오 아이콘*/}
          <span className="text-xl">카카오로 로그인</span>
        </button>
        </div>
      </div>
    </div>
  );
}