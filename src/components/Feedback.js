import React, { useState, useEffect, useRef } from "react";
import FeedbackChart from ".//Chart";
import ProChart from ".//lineChart";
import LineChart from "./cateline";

const Feedback = ({
  todos,
  addFeedback,
  feedback,
  todoLoading,
  modiTodo,
  onSendMessage,
  messages,
}) => {
  const titleStyle = "text-xl text-gray-darkest font-semibold mt-4 mb-2 pt-3";
  const inputStyle =
    " border-y-[1px] border-gray-darkest bg-gray-lightest w-full px-4 pb-2 pt-2 no-scrollbar h-[44px] justify-self-end ";
  const tableCategory =
    "py-2 font-semibold text-gray-darkest border-b-[1px] border-gray-darkest";
  const tableCell =
    " py-2 text-sm border-b-[1px] border-gray-dark text-gray-darkest";
  const [score, setscore] = useState(0);
  const [reflection, setReflection] = useState("");
  const [finish, setfinish] = useState("");
  const date = new Date().toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });

  const handleModiTodo = (
    modid,
    _content,
    _category,
    _timeStart,
    _timeEnd,
    _progress
  ) => {
    // progress 값을 0, 1, 2, 3에서 순환하도록 계산
    const updatedProgress = (_progress + 1) % 4;
    modiTodo(modid, _content, _category, _timeStart, _timeEnd, updatedProgress);
  };

  const todayTodos = todos.filter((todo) => {
    const todoDate = new Date(todo.timeEnd);
    const formattedDate = todoDate.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });
    return formattedDate === date;
  });

  const yesTodo = todos.filter((todo) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const todoDate = new Date(todo.timeEnd);
    const formattedDate = todoDate.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });
    return (
      formattedDate ===
      yesterday.toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
      })
    );
  });
  // console.log(yesTodo)

  const calPro = (todo) => {
    const progressList = todo.map((item) => item.progress);
    const sum = progressList.reduce((acc, cur) => acc + cur, 0);
    const average = sum / progressList.length;
    return average;
  };

  const prosum = [calPro(yesTodo), calPro(todayTodos)];

  const transformData = (data) => {
    const catelist = data.map((item) => item.category);
    const transformed = catelist.reduce((acc, item) => {
      if (item === "학업") {
        acc["학업"] = (acc["학업"] || 0) + 1;
      } else if (item === "대외활동") {
        acc["대외활동"] = (acc["대외활동"] || 0) + 1;
      } else if (item === "인턴") {
        acc["인턴"] = (acc["인턴"] || 0) + 1;
      } else if (item === "자격증") {
        acc["자격증"] = (acc["자격증"] || 0) + 1;
      } else {
        acc[item] = (acc[item] || 0) + 1;
      }
      return acc;
    }, {});

    return transformed;
  };

  const tocate = transformData(todayTodos);

  const calProByCategory = (todo) => {
    const categoryMap = {
      학업: [],
      대외활동: [],
      인턴: [],
      자격증: [],
      기타: [],
    };

    // 카테고리별로 분류
    todo.forEach((item) => {
      const category = categoryMap.hasOwnProperty(item.category)
        ? item.category
        : "기타";
      categoryMap[category].push(item.progress);
    });

    // 각 카테고리별로 평균 계산
    const categoryAverages = {};
    for (const category in categoryMap) {
      const progressList = categoryMap[category];
      const sum = progressList.reduce((acc, cur) => acc + cur, 0);
      const average = sum / progressList.length;
      categoryAverages[category] = average;
    }

    return categoryAverages;
  };

  const yescatepro = calProByCategory(yesTodo);
  const tocatepro = calProByCategory(todayTodos);

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
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
    }
  }, [reflection]);

  const areaRef = useRef(null);
  useEffect(() => {
    if (areaRef && areaRef.current) {
      areaRef.current.style.height = "inherit";
      areaRef.current.style.height = `${areaRef.current?.scrollHeight}px`;
    }
  }, [finish]);

  const todayFeedback = feedback.find((item) => item.date === date);
  useEffect(() => {
    if (todayFeedback) {
      setscore(todayFeedback.score);
      setReflection(todayFeedback.reflection);
      setfinish(todayFeedback.finish);
    }
    console.log(yescatepro);
    console.log(tocatepro);
  }, []);

  // // (지윤) TodoList 목록 정렬을 위한 css 설정

  const handleSend = () => {
    if (!reflection) {
      alert("메시지를 입력하세요.");
      return;
    }
    //프롬프트 수정했습니다. 관련 요청에 대해서 json 형식으로 return하고
    //index의 re_f에서 인식하여 줄바꿈 뒤의 문장이 추가됩니다. 참고해주세요.
    const feedPrompt = [
      {
        role: "system",
        content: `Write in Markdown, Write only JSON format.
        return {"method":"reflection","content":feedback content}
        feedback content should be based on following rules.
        너는 아주 유능한 일정관리 전문가 역할을 연기해야해.
        사용자가 자신의 하루에 대해서 성찰한 것에 대해서 피드백을 하면 돼.
        어떤 점을 잘했고, 어떤 점이 부족했는지.
        이와 더불어서 부족한 점에 대해서는 어떤 것을 보완할 수 있는지에 대한 조언까지 간단하게 해줘.
        존댓말로 작성하고 인사치레는 필요없어.
        "}
        .`,
      },
    ];
    onSendMessage(feedPrompt, reflection, 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSend();
    }
  };

  //메시지 불러오는 기능 추가
  useEffect(() => {
    // 메시지 트리거
    const trigger = "★제가";
    const lastMessage = messages[messages.length - 1]["content"];
    if (lastMessage.includes(trigger) && finish === "") {
      //해당 트리거 직전까지 자르기
      const startIndex = lastMessage.indexOf(trigger);
      setfinish(lastMessage.slice(0, startIndex - 1));
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full p-5 overflow-y-scroll no-scrollbar ">
      <p
        className={`border-gray-darkest border-b-[1px] pb-3 font-bold text-2xl text-gray-darkest w-full left-align`}
      >
        {date} 일정 마무리하기
      </p>
      <p className={titleStyle}>✔ 진행도 정리하기</p>
      {!todoLoading && ( //todos를 불러올때까지
        <div className="pb-4">
          <table className="table-auto w-full pb-4">
            <thead>
              <tr>
                <th className={`${tableCategory} w-16`}>진행도</th>
                <th className={`${tableCategory} w-14`}>분류</th>
                <th className={`${tableCategory} w-4/12 text-left`}>할 일</th>
                <th className={`${tableCategory} w-2/12 text-left`}>
                  시작시간
                </th>
                <th className={`${tableCategory} w-1/24 text-left`}>-</th>
                <th className={`${tableCategory} w-3/12 pl-2 text-left`}>
                  종료시간
                </th>
              </tr>
            </thead>
            <tbody>
              {todayTodos.map((item, index) => (
                <tr key={index}>
                  <td className={`${tableCell} text-center`}>
                    <button
                      className=""
                      style={getButtonStyle(item.progress)}
                      onClick={() =>
                        handleModiTodo(
                          item.id,
                          item.content,
                          item.category,
                          item.timeStart,
                          item.timeEnd,
                          item.progress
                        )
                      }
                      disabled={todayFeedback}
                    >
                      {item.progress}
                    </button>
                  </td>
                  <td className={`${tableCell} text-center`}>
                    {item.category}
                  </td>
                  <td className={tableCell}>{item.content}</td>
                  <td className={`${tableCell}`}>
                    {item.timeStart.toLocaleTimeString("en-EN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className={tableCell}>-</td>
                  <td className={`${tableCell} pl-2`}>
                    {item.timeEnd.toLocaleTimeString("en-EN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className={`${titleStyle}`}>✔ 어제와 오늘 비교하기</p>
      <div className="flex w-auto pb-4">
        <div
          className="mr-2 w-1/3 border-b-[1px]"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <td className="w-full ">
            <p className="mb-3 text-center">오늘의 분류 분포</p>
            <FeedbackChart cate={tocate} />
          </td>
        </div>
        <div className="pl-1 mr-2 w-1/3 border-b-[1px] border-gray-darkest items-center">
          <p className="mb-3 text-center">분류별 진행도 비교</p>
          <LineChart yescatepro={yescatepro} tocatepro={tocatepro} />
        </div>
        <div className="mr-2 w-1/3 border-b-[1px] border-gray-darkest ">
          <p className="mb-2 text-center">전체 진행도 비교</p>
          <ProChart prosum={prosum} />
        </div>
      </div>
      <p className={titleStyle}>{`✔ 오늘 하루 별점은? ${
        score > 0 ? `: ${score}점` : ""
      }`}</p>
      {/* <p className={titleStyle}>{score}</p> */}
      <div class="flex flex-row-reverse justify-center my-4">
        <button
          className={`bg-gray-light border-[1px] border-gray-darkest peer ${
            todayFeedback ? "" : "peer-hover:bg-orange hover:bg-orange"
          } focus:bg-orange peer-focus:bg-orange rounded-full w-12 h-12 mx-2 ${
            score >= 5 ? "bg-orange" : ""
          }`}
          onClick={() => setscore(5)}
          disabled={todayFeedback}
        ></button>
        <button
          className={`bg-gray-light border-[1px] border-gray-darkest peer ${
            todayFeedback ? "" : "peer-hover:bg-orange hover:bg-orange"
          } focus:bg-orange peer-focus:bg-orange rounded-full w-12 h-12 mx-2 ${
            score >= 4 ? "bg-orange" : ""
          }`}
          onClick={() => setscore(4)}
          disabled={todayFeedback}
        ></button>
        <button
          className={`bg-gray-light border-[1px] border-gray-darkest peer ${
            todayFeedback ? "" : "peer-hover:bg-orange hover:bg-orange"
          } focus:bg-orange peer-focus:bg-orange rounded-full w-12 h-12 mx-2 ${
            score >= 3 ? "bg-orange" : ""
          }`}
          onClick={() => setscore(3)}
          disabled={todayFeedback}
        ></button>
        <button
          className={`bg-gray-light border-[1px] border-gray-darkest peer ${
            todayFeedback ? "" : "peer-hover:bg-orange hover:bg-orange"
          } focus:bg-orange peer-focus:bg-orange rounded-full w-12 h-12 mx-2 ${
            score >= 2 ? "bg-orange" : ""
          }`}
          onClick={() => setscore(2)}
          disabled={todayFeedback}
        ></button>
        <button
          className={`bg-gray-light border-[1px] border-gray-darkest peer ${
            todayFeedback ? "" : "peer-hover:bg-orange hover:bg-orange"
          } focus:bg-orange peer-focus:bg-orange rounded-full w-12 h-12 mx-2 ${
            score >= 1 ? "bg-orange" : ""
          }`}
          onClick={() => setscore(1)}
          disabled={todayFeedback}
        ></button>
      </div>
      <p className={titleStyle}>
        {`✔ 칭찬할 점과 아쉬운 점, 개선할 점 작성하기`}
      </p>

      <textarea
        ref={textareaRef}
        style={{ resize: "none" }}
        className={`${inputStyle} `}
        value={reflection}
        placeholder={`칭찬할 점: \n아쉬운 점: \n개선할 점:`}
        onChange={(e) => setReflection(e.target.value)}
        rows={3}
        disabled={todayFeedback}
        onKeyDown={handleKeyDown}
      />
      <p className="text-right mt-1">Tip : Ctrl+Enter를 눌러 GPT의 조언받기</p>
      <p className={titleStyle}>✔ GPT 조언 중 참고할 점 작성하기</p>
      <textarea
        ref={areaRef}
        value={finish}
        style={{ resize: "none" }}
        className={`${inputStyle} `}
        onChange={(e) => setfinish(e.target.value)}
        rows={2}
        disabled={todayFeedback}
      />
      <div className="flex justify-end mt-3 ">
        <button
          className={`mt-4  w-1/5 p-1 bg-orange font-semibold text-[#ffffff] border-[1px] border-orange rounded-[20px] hover:bg-gray-lightest hover:font:bold hover:text-orange focus:border-2 ${
            todayFeedback ? "hidden" : ""
          }`}
          onClick={() => {
            if (score && reflection && finish) {
              const confirmed = window.confirm(
                "저장하시겠습니까? 저장 후에는 다시 수정할 수 없습니다"
              );
              if (confirmed) {
                addFeedback(date, score, reflection, finish);
              }
            } else {
              alert("모든 문항을 채운 후 다시 시도해주세요.");
              return;
            }
          }}
        >
          저장하기
        </button>
      </div>
    </div>
  );
};
export default Feedback;
