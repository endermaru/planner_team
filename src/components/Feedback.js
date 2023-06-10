import React, { useState, useEffect, useRef } from "react";
import FeedbackChart from ".//Chart";
import ProChart from ".//lineChart";

const Feedback = ({
  todos,
  addFeedback,
  feedback,
  todoLoading,
  modiTodo,
  onSendMessage,
}) => {
  const titleStyle = "text-xl font-semibold mt-7 mb-2 border-t-4 pt-3 border-double border-gray";
  const inputStyle = " border border-2 w-full px-4 pb-3 pt-2 no-scrollbar h-[44px] justify-self-end";
  const tableCategory ="py-2 font-semibold text-gray-darkest border-b-[1px] border-gray-darkest";
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
    return (
      formattedDate === date
    );
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
    const progressList = todo.map(item => item.progress);
    const sum = progressList.reduce((acc, cur) => acc + cur, 0);
    const average = sum / progressList.length;
    return average;
  };
  
  const prosum = [calPro(yesTodo),calPro(todayTodos)];

  const transformData = (data) => {
    const catelist = data.map(item => item.category)
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
        acc["기타"] = (acc["기타"] || 0) + 1;
      }
      return acc;
    }, {});
  
    return transformed;
  };
  
  const tocate = transformData(todayTodos);
  const yescate = transformData(yesTodo);


  const getButtonStyle = (progress) => {
    switch (progress) {
      case 0:
        return {
          backgroundColor: "white",
          border: "1px solid #2A2A2A",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        };
      case 1:
        return {
          backgroundColor: "#B9B9B8",
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
          backgroundColor: "#9EB6EF",
          border: "1px solid #2A2A2A",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        };
      default:
        return {
          backgroundColor: "white",
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


  const todayFeedback = feedback.find(item => item.date === date);
  useEffect(()=> {
  if (todayFeedback) {
    setscore(todayFeedback.score);
    setReflection(todayFeedback.reflection);
    setfinish(todayFeedback.finish);
  }
  }, []);

  // // (지윤) TodoList 목록 정렬을 위한 css 설정
 
  const handleSend = () => {

    if (!reflection) {
      alert("메시지를 입력하세요.");
      return;
    }
    const feedPrompt = [
      {
        role: "system",
        content: `너는 아주 유능한 학습관리 전문가야.
        학생들이 자신의 하루에 대해서 성찰한 것에 대해서 피드백을 하면 돼.
        어떤 점을 잘했고, 어떤 점이 부족했는지.
        이와 더불어서 부족한 점에 대해서는 어떤 것을 보완할 수 있는지에 대한 조언까지 간단하게 해줘.
        그리고 마지막 말로 "★제가 조언해드린 내용을 바탕으로 참고할 점을 작성한 후 마무리하세요!★"라는 문장을 반드시 줄바꿈하여 덧붙여야 해.
        너의 답변도 보기 좋게 줄바꿈해주면 더욱 좋을 것 같아.`,
      },
    ];
    onSendMessage(feedPrompt, reflection, 1);
  
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSend();
    }
  };








  return (
    <div className="flex flex-col w-full p-5 overflow-y-scroll no-scrollbar">
      <p className={`border border-[#000000] border-2 py-3 my-3 font-bold text-2xl text-blue w-full text-center`}>
        {date} 일정 마무리하기
        </p>
      <p className={titleStyle}>1. 진행도 표시하기</p>
      {!todoLoading && ( //todos를 불러올때까지 기다림
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className={`${tableCategory} w-16`}>진행도</th>
              <th className={`${tableCategory} w-14`}>분류</th>
              <th className={`${tableCategory} w-4/12 text-left`}>할 일</th>
              <th className={`${tableCategory} w-2/12 text-left`}>시작시간</th>
              <th className={`${tableCategory} w-1/24 text-left`}>-</th>
              <th className={`${tableCategory} w-2/12 text-left`}>종료시간</th>

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
                <td className={`${tableCell} text-center`}>{item.category}</td>
                <td className={tableCell}>{item.content}</td>
                <td className={`${tableCell}`}>
                  {item.timeStart.toLocaleTimeString("en-EN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className={tableCell}>-</td>
                <td className={tableCell}>
                  {item.timeEnd.toLocaleTimeString("en-EN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className={`${titleStyle}`}>2. 어제와 비교한 오늘 확인하기</p>
      <div className="flex w-auto">

        <div className="mr-2 pr-2 w-[35%] border-r-2 border-dashed border-gray ">
          <p className="mb-2 text-center">전체 진행도 비교</p>
          <ProChart prosum={prosum}/>
          <p className="font-bold text-center"style={{ whiteSpace: 'pre-line' }}>
                {prosum.includes(NaN)?`일정이 없습니다`:
                prosum[1]-prosum[0] > 0 ?`어제보다 ${((prosum[1]-prosum[0])/prosum[0]*100).toFixed(0)}% 증가`
                : prosum[1]-prosum[0] < 0 ?`어제보다 ${((prosum[0]-prosum[1])/prosum[1]*100).toFixed(0)}% 감소`
                :prosum} 
          </p>
        </div>       
        
        {/* <div className="mr-2 w-4/12 pr-2 border-r-2 border-dashed border-gray" style={{ display: 'flex', justifyContent: 'center' }}>
                <td>
                  <p className="mb-3 text-center">분류별 진행도 비교</p>
                  <ProChart 
                  cate={yescate} 
                  cat={tocate}
                  />
                </td>
        </div> */}
     
        <div className=" mr-2 w-4/12" style={{ display: 'flex', justifyContent: 'center' }}>
                <td>
                  <p className="mb-3 text-center">오늘의 분류 분포</p>
                  <FeedbackChart cate={tocate} />
                </td>
        </div>
      </div>
      <p className={titleStyle}>{`3. 오늘 하루에 대한 총점수 매기기 ${score > 0 ? `: ${score}점` : ''}`}</p>
      {/* <p className={titleStyle}>{score}</p> */}
      <div class="flex flex-row-reverse justify-center my-4">
        <button
          className={`bg-gray-light peer ${
            todayFeedback ? "" : "peer-hover:bg-orange hover:bg-orange"
          } focus:bg-orange peer-focus:bg-orange rounded-full w-12 h-12 mx-2 ${
            score >= 5 ? "bg-orange" : ""
          }`}
          onClick={() => setscore(5)}
          disabled={todayFeedback} 
        ></button>
        <button
          className={`bg-gray-light peer ${
            todayFeedback ? "" : "peer-hover:bg-orange hover:bg-orange"
          } focus:bg-orange peer-focus:bg-orange rounded-full w-12 h-12 mx-2 ${
            score >= 4 ? "bg-orange" : ""
          }`}
          onClick={() => setscore(4)}
          disabled={todayFeedback} 
        ></button>
        <button
          className={`bg-gray-light peer ${
            todayFeedback ? "" : "peer-hover:bg-orange hover:bg-orange"
          } focus:bg-orange peer-focus:bg-orange rounded-full w-12 h-12 mx-2 ${
            score >= 3 ? "bg-orange" : ""
          }`}
          onClick={() => setscore(3)}
          disabled={todayFeedback} 
        ></button>
        <button
          className={`bg-gray-light peer ${
            todayFeedback ? "" : "peer-hover:bg-orange hover:bg-orange"
          } focus:bg-orange peer-focus:bg-orange rounded-full w-12 h-12 mx-2 ${
            score >= 2 ? "bg-orange" : ""
          }`}
          onClick={() => setscore(2)}
          disabled={todayFeedback} 
        ></button>
        <button
          className={`bg-gray-light peer ${
            todayFeedback ? "" : "peer-hover:bg-orange hover:bg-orange"
          } focus:bg-orange peer-focus:bg-orange rounded-full w-12 h-12 mx-2 ${
            score >= 1 ? "bg-orange" : ""
          }`}
          onClick={() => setscore(1)}
          disabled={todayFeedback} 
        ></button>
      </div>
      <p className={titleStyle}>
        {`4. 오늘 하루 칭찬할 점과 아쉬운 점, 개선할 점 작성하기`}
      </p>

      <textarea 
      ref={textareaRef} 
      style={{ resize: "none",}} 
      className={`${inputStyle} `} 
      value={reflection}
      placeholder={`칭찬할 점: \n아쉬운 점: \n개선할 점:`}
      onChange={(e) => setReflection(e.target.value)}  
      rows={3}
      disabled={todayFeedback} 
      onKeyDown={handleKeyDown} 
      />
      <p className="text-right mt-1">
        Tip : Ctrl+Enter를 눌러 GPT의 조언받기
      </p>
      <p className={titleStyle}>5. 조언 중 참고할 점 작성하기</p>
      <textarea 
      ref={areaRef} 
      value={finish}
      style={{ resize: "none",}} 
      className={`${inputStyle} `} 
      onChange={(e) => setfinish(e.target.value)}  
      rows={2}
      disabled={todayFeedback} 
      />
      <div className="flex justify-end mt-3 ">
      <button
        className={`mt-4  w-1/5 p-1 bg-orange text-white border border-orange rounded hover:bg-[#FFFFFF] hover:text-orange ${todayFeedback ? 'hidden' : ''}`}
        onClick={() => {
          if (score && reflection && finish) {
            const confirmed = window.confirm('저장하시겠습니까? 저장 후에는 다시 수정할 수 없습니다');
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
