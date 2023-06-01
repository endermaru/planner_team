//component 가져오기
import TodoList from "../components/TodoList";
import Calendar from "../components/Calendar";
import Feedback from "../components/Feedback";
import { Chat } from "@/components/Chat";
import ModiModal from "@/components/ModiModal";

import Modal from "react-modal";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

import { db } from "@/firebase";
import {
  collection,
  query,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";

//일정 db - 필드 이름(타입) : userId(str) / userName(str) / content(str) / timeStart(timestamp) / timeEnd(timestamp) / progress(int)
const todoDB = collection(db, "todoDB");
//메시지 로그 db - 필드 이름(타입) : who(str) / log(str) / time(timestamp)
const messageDB = collection(db, "messageDB");

export default function Home() {
  //주소를 이동시킬 라우터
  const router = useRouter();
  //현재 사용자 세션 정보
  const { data } = useSession({
    required: true,
    onUnauthenticated() {
      //로그인이 되어있지 않으면 auth/signin 페이지로 이동
      router.replace("/auth/signin");
    },
  });

  //일정 배열 생성
  const [todos, setTodos] = useState([]);
  const [todoLoading, settodoLoading] = useState(true);

  //db 가져오기
  const getTodos = async () => {
    // 유저별로 가져올 때 사용
    if (!data?.user?.name) return; //세션정보가 있고/유저가 있고/이름이 있으면 통과
    const q = query(todoDB, where("userId", "==", data?.user?.id));
    settodoLoading(true);
    const results = await getDocs(q);
    const newTodos = [];

    results.docs.forEach((doc) => {
      const _timeStart = doc.data().timeStart.toDate();
      const _timeEnd = doc.data().timeEnd.toDate(); //firebase의 timestamp를 javascript 형식으로 변환
      newTodos.push({
        id: doc.id,
        ...doc.data(),
        timeStart: _timeStart,
        timeEnd: _timeEnd,
      });
    });
    setTodos(newTodos);
    settodoLoading(false);
  };
  //db 추가하기(Id,이름,내용,시작날짜,종료날짜,진행도)
  const addTodos = async ({ _content, _timeStart, _timeEnd }) => {
    const docRef = await addDoc(todoDB, {
      userId: data?.user?.id,
      userName: data?.user?.name,
      content: _content,
      timeEnd: Timestamp.fromDate(new Date(_timeEnd)),
      timeStart: Timestamp.fromDate(new Date(_timeStart)),
      progress: 0,
    });
    _timeStart = Timestamp.fromDate(new Date(_timeStart)).toDate();
    _timeEnd = Timestamp.fromDate(new Date(_timeEnd)).toDate();
    const newTodos = [
      ...todos,
      {
        id: docRef.id,
        userId: data?.user?.id,
        userName: data?.user?.name,
        content: _content,
        timeStart: _timeStart,
        timeEnd: _timeEnd,
        progress: 0,
      },
    ].sort(
      (a, b) =>
        new Date(a.timeStart).getTime() - new Date(b.timeStart).getTime()
    );
    setTodos(newTodos);
  };

  //db 수정
  const modiTodo = (modid, _content, _timeStart, _timeEnd, _progress) => {
    const newTodos = todos.map((todo) => {
      if (todo.id == modid) {
        const todoDoc = doc(todoDB, modid);
        _timeStart = Timestamp.fromDate(new Date(_timeStart)).toDate();
        _timeEnd = Timestamp.fromDate(new Date(_timeEnd)).toDate();
        updateDoc(todoDoc, {
          content: _content,
          timeStart: _timeStart,
          timeEnd: _timeEnd,
          progress: _progress,
        });
        return {
          ...todo,
          content: _content,
          timeStart: _timeStart,
          timeEnd: _timeEnd,
          progress: _progress,
        };
      } else {
        return todo;
      }
    });
    setTodos(newTodos);
  };

  //수정 모달창
  const [isOpen, setIsOpen] = useState(false);
  const [id_moditodo, setid_moditodo] = useState("");
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  //db 수정 - 모달 창에 넘기는 기능
  const openModimodal = (id) => {
    setid_moditodo(id);
    openModal();
  };
  //모달 창 root 설정
  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  //db삭제 - todos 배열 안에서 특정 속성으로 원하는 item을 찾는 함수 필요
  const delTodo = (id) => {
    const todoDoc = doc(todoDB, id);
    deleteDoc(todoDoc);
    setTodos(
      todos.filter((todo) => {
        return todo.id !== id;
      })
    );
  };
  //todos 배열 출력(확인용)
  const printTodos = (_todos) => {
    // setid_moditodo(_todos[0]?.id)
    // console.log(id_moditodo);
    setIsOpen(!isOpen);
  };

  //챗봇
  const [messages, setMessages] = useState([]); //메시지 로그 배열
  const [loading, setLoading] = useState(false); //메시지 로딩 중

  //정규표현식 함수
  const re_f = async (sent) => {
    const sentence = sent.replace(/\n/g, "");
    const pattern = /\{.*?\}/;
    const match = sentence.match(pattern);
    if (match) {
      const jStr = JSON.parse(match[0]);

      if (jStr.method === "add") {
        addTodos({
          _content: jStr.content,
          _timeStart: jStr.timeStart,
          _timeEnd: jStr.timeEnd,
        });
        handleAdd("assistant", "일정이 추가되었습니다!");
      } else if (jStr.method === "delete") {
        const resultFind = findSchedule(jStr);
        console.log("result", resultFind);
        if (resultFind === 0) {
          handleAdd(
            "assistant",
            "해당 조건을 만족하는 일정을 찾을 수 없습니다."
          );
        } else if (resultFind === -1) {
          handleAdd(
            "assistant",
            "조건에 맞는 일정이 2개 이상 존재합니다. 날짜와 시간을 정확히 작성해주세요."
          );
        } else {
          delTodo(resultFind.id);
          handleAdd("assistant", "일정이 삭제되었습니다.");
        }
      } else if (jStr.method === "modification") {
        const resultFind = findSchedule(jStr);
        if (resultFind === 0) {
          handleAdd(
            "assistant",
            "해당 조건을 만족하는 일정을 찾을 수 없습니다."
          );
        } else if (resultFind === -1) {
          handleAdd(
            "assistant",
            "조건에 맞는 일정이 2개 이상 존재합니다. 날짜와 시간을 정확히 작성해주세요."
          );
        } else {
          openModimodal(resultFind);
          handleAdd("assistant", "일정 수정페이지로 이동합니다.");
        }
      } else {
        //정규표현식은 작동했으나 명령 수행 불가
        handleAdd(
          "assistant",
          "명령이 제대로 수행되지 않았습니다. 다시 시도해주세요."
        );
      }
    } else {
      //정규표현식 작동 안함
      console.log("re_f failed");
      return -1;
    }
  };

  const findSchedule = (jStr) => {
    const timeStart = jStr.timeStart;
    const content = jStr.content;
    const exact_todo = [];
    //따로 시간까지 지정되었을 경우
    if (timeStart != "0") {
      const _timeStart = Timestamp.fromDate(new Date(timeStart))
        .toDate()
        .toString();
      const close_todo = []; //근사치 배열
      for (const item of todos) {
        if (
          item.content.includes(content) &&
          _timeStart === item.timeStart.toString()
        ) {
          exact_todo.push(item);
        } else if (
          item.content.includes(content) &&
          _timeStart.slice(0, 16) === item.timeStart.toString().slice(0, 16)
        ) {
          close_todo.push(item);
        }
      }
      if (exact_todo.length == 0 && close_todo.length > 0) {
        for (const item of close_todo) {
          exact_todo.push(item);
        }
      }
    } else {
      //시간없이 찾을 경우
      for (const item of todos) {
        if (item.content.includes(content)) {
          exact_todo.push(item);
        }
      }
    }
    //2개 이상인지 확인
    if (exact_todo.length === 1) {
      return exact_todo[0].id;
    } else if (exact_todo.length > 1) {
      //일정중복
      return -1;
    } else {
      //일정없음
      return 0;
    }
  };

  //메시지 전달 함수 (메시지와 사전규칙)
  const handleSend = async (_systemPrompt, message, isSave) => {
    console.log("handleSend", message);
    message = { role: "user", content: message }; //규칙맞게 가공
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages); //로그 추가
    setLoading(true); //로딩 시작

    const response = await fetch("/api/openApi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [message], //input하나만 보냄
        systemPrompt: _systemPrompt, //규칙을 보냄
      }),
    });

    if (!response.ok) {
      setLoading(false);
      console.log("response", response);
      throw new Error(response.statusText);
    }

    //firebase에 요청 메시지 추가(기본)
    // var now=new Date();
    // await addDoc(messageDB,{
    //   userId:data?.user?.id,
    //   userName:data?.user?.name,
    //   role:message.role,
    //   content:message.content,
    //   date:now,
    // });

    const result = await response.json();
    if (!result) {
      return;
    }
    console.log("result", result);

    //messages에 요청 메시지 추가
    setLoading(false);

    //정규표현식을 통과하면 메시지 표시 없이 내부 처리
    isSave = 0;
    const cnt = await re_f(result.content);
    if (cnt == -1) {
      isSave = 1;
    }

    //응답값 저장
    if (isSave) {
      console.log(result);
      //messges배열에
      setMessages((messages) => [...messages, result]);
      //firebase배열에
      // now=new Date();
      // await addDoc(messageDB,{
      // userId:data?.user?.id,
      // userName:data?.user?.name,
      // role:result.role,
      // content:result.content,
      // date:now,
      // });
    } else {
      return result; //대답을 반환해 별도 처리
    }
  };

  //조정된 메시지 출력
  const handleAdd = async (_role, _content) => {
    const result = { role: _role, content: _content };
    //messges배열에
    setMessages((messages) => [...messages, result]);
    //firebase배열에
    // const now=new Date();
    // await addDoc(messageDB,{
    //   userId:data?.user?.id,
    //   userName:data?.user?.name,
    //   role:_role,
    //   content:_content,
    //   date:now,
    // });
  };

  //메시지 로그 불러오기
  const handleReset = async () => {
    if (!data?.user?.name) {
      return;
    }
    const q = query(
      messageDB,
      where("userName", "==", data?.user?.name),
      orderBy("date", "asc")
    );

    // const q=query(messageDB,orderBy("date","asc"));
    const logs_data = await getDocs(q);
    const logs_arr = [];
    logs_data.docs.forEach((doc) => {
      logs_arr.push({
        role: doc.data()["role"],
        content: doc.data()["content"],
      });
    });
    setMessages([
      ...logs_arr,
      {
        role: "assistant",
        content: "무엇을 도와드릴까요?",
      },
    ]);
  };

  //로그 삭제
  const deletelog = async () => {
    const q = query(messageDB);
    const logs_data = await getDocs(q);
    logs_data.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    setMessages([
      {
        role: "assistant",
        content: "무엇을 도와드릴까요?",
      },
    ]);
  };

  //탭 바꾸기
  const [tab, setTab] = useState(1);

  useEffect(() => {
    getTodos();
    handleReset();
    console.log("completed");
  }, [data?.user?.name]); //세션이 불러와지면 실행

  //스타일 지정

  const buttonStyle =
    "h-15 mr-3 p-3 bg-neutral text-white font-semibold\
                    border rounded-md border-2 border-white\
                    hover:bg-white hover:text-orange";

  const activeStyle =
    "w-10 h-32\
    justify-center items-start pt-3 flex bg-gray-dark border-b-[1px] text-gray-lightest border-gray-darkest";
  const grayStyle =
    "w-10 h-32\
    flex justify-center items-start pt-3 bg-gray-lightest text-gray-darkest font-semibold\
                    hover:bg-gray-light border-b-[1px] border-gray-darkest";

  const topbuttonStyle =
    "h-4 text-sm text-gray-lightest justify-self-bottom hover:font-semibold pl-2";

  const circleDark = "flex mx-auto h-3 w-3 bg-orange rounded-full";
  const circleLight = "flex mx-auto h-3 w-3 bg-gray rounded-full";

  return (
    <div className="">
      <div className="mx-auto max-w-4xl h-xl pt-6 pb-24 no-scrollbar">
        <div className="relative isolate overflow-hidden bg-gray-lightest shadow-xl rounded-3xl  ">
          <div id="root" className=" font-ibm">
            {/*수정 시 나오는 모달창*/}
            <ModiModal
              isOpen={isOpen}
              closeModal={closeModal}
              modifunc={modiTodo}
              handleAdd={handleAdd}
              todos={todos}
              id_moditodo={id_moditodo}
            />
            {!todoLoading && (
              <div className="max-h-13 w-full flex bg-orange items-center p-3 pt-6 pr-5 border-b-[1px] border-gray-dark">
                <div className="flex items-center flex-grow">
                  <div className="text-gray-lightest tracking-tight font-bold text-2xl pl-2">{`PLANNER : ${data?.user?.name}'s page`}</div>
                  {/*테스트용 버튼*/}
                </div>
                <div className="flex items-center space-x-2">
                  <button className={topbuttonStyle} onClick={signOut}>
                    로그아웃
                  </button>
                  <button className={topbuttonStyle} onClick={deletelog}>
                    챗 로그 삭제
                  </button>
                  <button
                    className={topbuttonStyle}
                    onClick={() => {
                      printTodos(todos);
                    }}
                  >
                    array 출력
                  </button>
                </div>
              </div>
            )}

            {/*각 컴포넌트-getTodos가 배열을 가져올 때까지 렌더링되지 않습니다.*/}
            {!todoLoading && (
              <div className="flex flex-1 flex-row h-3xl">
                {/*챗봇 컴포넌트*/}
                <div className="flex w-1/3">
                  <div className="h-full w-full">
                    <Chat
                      messages={messages}
                      loading={loading}
                      onSendMessage={handleSend}
                    />
                  </div>
                </div>

                {/*탭에 따른 컴포넌트-데이터와 함수를 전달*/}
                {/*대체 왜 아래에 붙어서 나오는 걸까요?...뭐가 문제인지 모르겠습니다...*/}
                <div className="flex flex-row w-2/3 h-full">
                  {/*탭버튼*/}
                  <div className="flex flex-col place-content-start border-x-[1px] border-x-gray-darkest">
                    <button
                      className={tab == 1 ? activeStyle : grayStyle}
                      onClick={() => setTab(1)}
                    >
                      {tab == 1 ? (
                        <div>
                          <div className={circleDark} />
                          <p className="mt-7 text-base font-bold rotate-90">
                            Calendar
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div className={circleLight} />
                          <p className="mt-7 text-base font-normal rotate-90">
                            Calendar
                          </p>
                        </div>
                      )}
                      {}
                    </button>
                    <button
                      className={tab == 2 ? activeStyle : grayStyle}
                      onClick={() => setTab(2)}
                    >
                      {tab == 2 ? (
                        <div>
                          <div className={circleDark} />
                          <p className="mt-6 text-base font-bold rotate-90">
                            Todolist
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div className={circleLight} />
                          <p className="mt-6 text-base font-normal rotate-90">
                            Todolist
                          </p>
                        </div>
                      )}
                    </button>
                    <button
                      className={tab == 3 ? activeStyle : grayStyle}
                      onClick={() => setTab(3)}
                    >
                      {tab == 3 ? (
                        <div>
                          <div className={circleDark} />
                          <p className="mt-7 text-base font-bold rotate-90">
                            Feedback
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div className={circleLight} />
                          <p className="mt-7 text-base font-normal rotate-90">
                            Feedback
                          </p>
                        </div>
                      )}
                    </button>
                  </div>
                  {tab == 1 && (
                    <Calendar
                      className="w-fit"
                      todos={todos}
                      printTodos={printTodos}
                    />
                  )}
                  {tab == 2 && (
                    <TodoList
                      className="w-2/3"
                      data={data}
                      todoLoading={todoLoading}
                      todos={todos}
                      addTodo={addTodos}
                      delTodo={delTodo}
                      openModi={openModimodal}
                    />
                  )}
                  {tab == 3 && (
                    <Feedback
                      className="w-2/3"
                      todos={todos}
                      todoList={
                        <TodoList
                          className="w-2/3"
                          data={data}
                          todoLoading={todoLoading}
                          todos={todos}
                          addTodo={addTodos}
                          modiTodo={modiTodo}
                          delTodo={delTodo}
                        />
                      }
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
