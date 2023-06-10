import React from "react";
import Modal from "react-modal";
import react, { useEffect, useState } from "react";

import { IBM_Plex_Sans_KR } from 'next/font/google';
const ibmplex = IBM_Plex_Sans_KR({
  // preload: true, 기본값
  subsets: ["latin"], // 또는 preload: false
  weight: ["300", "400", "500", "700"], // 가변 폰트가 아닌 경우, 사용할 fontWeight 배열
});

const ModiModal = ({
  isOpen,
  closeModal,
  modifunc,
  handleAdd,
  todos,
  id_moditodo,
}) => {
  const [modi, setModi] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [progress, setProgress] = useState(0);

  //날짜 변환기
  const dateToString = (date) => {
    const dateObj = new Date(date);
    // console.log(dateObj);
    const y = dateObj.getFullYear();
    const m = dateObj.getMonth() + 1;
    const d = dateObj.getDate();
    const h = dateObj.getHours();
    const mi = dateObj.getMinutes();
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(
      2,
      "0"
    )}T${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`;
  };

  const findTodo = (_todos, id) => {
    const _modi = _todos.find((todo) => todo.id === id);
    if (_modi) {
      setContent(_modi?.content);
      setCategory(_modi?.category);
      setTimeStart(dateToString(_modi?.timeStart));
      setTimeEnd(dateToString(_modi?.timeEnd));
      setProgress(_modi?.progress);
    }
    return _modi;
  };

  //날짜 수정 시 따라가기
  const cmpTodo = () => {
    if (timeStart > timeEnd) {
      const stStr = dateToString(timeStart);
      const edStr = dateToString(timeEnd);
      //날짜가 달라질 경우
      if (
        stStr.slice(8, 10) !== edStr.slice(8, 10) ||
        stStr.slice(5, 7) !== stStr.slice(5, 7) ||
        stStr.slice(0, 4) !== edStr.slice(0, 4)
      ) {
        setTimeEnd(stStr.slice(0, 10) + edStr.slice(10));
      }
      //시간이 달라질 경우
      else {
        setTimeEnd(stStr);
      }
    }
  };

  const dateToStart = () => {
    const stStr = dateToString(timeStart);
    const edStr = dateToString(timeEnd);
    setTimeEnd(stStr.slice(0, 10) + edStr.slice(10));
  };

  const allDay = () => {
    const stStr = dateToString(timeStart);
    setTimeStart(stStr.slice(0, 10) + "T00:00");
    setTimeEnd(stStr.slice(0, 10) + "T23:59");
  };
  useEffect(() => {
    setModi(findTodo(todos, id_moditodo));
  }, [isOpen]);

  useEffect(() => {
    cmpTodo();
  }, [timeStart]);

  const modi_todo = () => {
    modifunc(id_moditodo, content, category, timeStart, timeEnd, progress);
  };

  const buttonStyle =
    "justify-items-end w-14 h-10 ml-3 p-1 rounded-full text-sm text-gray-darkest font-semibold\
                    border border-[1px] border-gray-darkest bg-neutral hover:bg-gray-dark hover:text-gray-lightest hover:font-bold";

  // 버튼 스타일 생성 함수
  const getButtonStyle = (progress) => {
    switch (progress) {
      case 0:
        return {
          backgroundColor: "#F3F3F3",
          border: "1px solid #2A2A2A",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        };
      case 1:
        return {
          backgroundColor: "#D8D8D8",
          border: "1px solid #2A2A2A",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        };
      case 2:
        return {
          backgroundColor: "#FFA08D",
          border: "1px solid #2A2A2A",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        };
      case 3:
        return {
          backgroundColor: "#FF645C",
          border: "1px solid #2A2A2A",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        };
      default:
        return {
          backgroundColor: "#F3F3F3",
          border: "1px solid black",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        };
    }
  };

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(128,128,128, 0.3)",
    },
    content: {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "400px",
      height: "480px",
      transform: "translate(-50%,-50%)",
      backgroundColor: "gray-lightest",
      boxShadow: "10px 20px 10px -10px rgba(0, 0, 0, 0.2)",
      padding: 0,
      border: 0,
      borderRadius: "20px",
    },
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
      shouldCloseOnOverlayClick={false}
      contentLabel="Modal for modification"
    >
      <div className={`bg-gray-lightest w-full h-full flex flex-col rounded-t-[20px] ${ibmplex.className}`}>
        <div className="w-full bg-red-500">
          <p className="px-5 py-3 bg-orange text-gray-lightest text-2xl font-semibold">
            일정 수정하기
          </p>
        </div>

        <div className="grid gap-4 grid-cols-3 mx-10 my-5 place-content-center">
          <p className="align-middle text-end font-semibold p-1">
            일정 이름 :{" "}
          </p>
          <input
            type="text"
            className="col-span-2 align-middle p-1 border-b-[1px] border-gray-darkest bg-gray-lightest"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <p className="align-middle text-end font-semibold p-1">카테고리 : </p>
          <input
            type="text"
            className="col-span-2 align-middle p-1 border-b-[1px] border-grat-darkest bg-gray-lightest"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <p className="align-middle text-end font-semibold p-1">
            시작 날짜 :{" "}
          </p>
          <input
            type="datetime-local"
            className="col-span-2 align-middle p-1 border-b-[1px] border-grat-darkest bg-gray-lightest"
            value={timeStart}
            onChange={(e) => {
              setTimeStart(e.target.value);
            }}
          />
          <p className="align-middle text-end font-semibold p-1">
            종료 날짜 :{" "}
          </p>
          <input
            type="datetime-local"
            className="col-span-2 align-middle p-1 border-b-[1px] border-grat-darkest bg-gray-lightest"
            value={timeEnd}
            onChange={(e) => {
              setTimeEnd(e.target.value);
            }}
          />
          <div></div>
          <div className="col-span-2 col-end-4">
            <button
              className="justify-items-end w-14 h-10 p-1 rounded-full text-sm text-gray-darkest font-semibold
                            border border-[1px] border-gray-darkest bg-neutral hover:bg-gray-dark hover:text-gray-lightest hover:font-bold"
              onClick={allDay}
            >
              {`종일`}
            </button>
            <button
              className="justify-items-end w-36 h-10 ml-2  p-1 rounded-full text-sm text-gray-darkest font-semibold
              border border-[1px] border-gray-darkest bg-neutral hover:bg-gray-dark hover:text-gray-lightest hover:font-bold"
              onClick={dateToStart}
            >
              {`시작 날짜와 맞추기`}
            </button>
          </div>
          <p className="align-middle text-end font-semibold p-1">진행도 : </p>
          <button
            style={getButtonStyle(progress)}
            onClick={() => {
              setProgress((progress + 1) % 4);
            }}
          >
            {progress}
          </button>
        </div>
        <div className="flex flex-row mb-5 mx-10 place-items-center justify-end">
          <button className={`${buttonStyle}`} onClick={closeModal}>
            취소
          </button>
          <button
            className={`${buttonStyle}`}
            onClick={() => {
              modi_todo();
              closeModal();
              handleAdd(
                "assistant",
                `"${modi.content}" 일정이 수정되었습니다.`
              );
            }}
          >
            확인
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModiModal;
