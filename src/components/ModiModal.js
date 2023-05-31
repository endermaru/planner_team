import React from 'react';
import Modal from 'react-modal';
import react,{useEffect,useState} from "react";

const ModiModal=({isOpen,closeModal,modifunc,handleAdd,todos,id_moditodo})=>{
  const [modi,setModi]=useState('');
  const [content,setContent]=useState('');
  const [timeStart,setTimeStart]=useState('');
  const [timeEnd,setTimeEnd]=useState('');
  const [progress,setProgress]=useState(0);


  const findTodo=(_todos,id)=>{
    const _modi=_todos.find(todo=>todo.id===id);
    if (_modi){
      setContent(_modi?.content);
      var _timeStart=new Date(_modi?.timeStart);
      _timeStart.setUTCHours(_timeStart.getUTCHours() + 9);
      _timeStart=_timeStart.toISOString().slice(0,-2);
      setTimeStart(_timeStart);
      var _timeEnd=new Date(_modi?.timeEnd);
      _timeEnd.setUTCHours(_timeEnd.getUTCHours() + 9);
      _timeEnd=_timeEnd.toISOString().slice(0,-2);
      setTimeEnd(_timeEnd);
    }
    return _modi;
  }
  useEffect(()=>{
    setModi(findTodo(todos,id_moditodo));
    console.log(id_moditodo);
  },[isOpen]);

  const modi_todo=()=>{
    modifunc(id_moditodo,content,timeStart,timeEnd,progress);
  };

  const buttonStyle='justify-items-end w-32 p-1 mx-3 rounded text-black font-semibold\
                    border border-2 boder-gray-400 bg-white hover:bg-gray-200 focus:ring-1 focus:ring-gray-400'

  const customStyles={
    content:{
      position:'absolute',
      top:'50%',
      left:'50%',
      width:'30vw',
      height:'45vh',
      transform: 'translate(-50%,-50%)',
      backgroundColor:'white',
      padding:0,
      borderRadius:'10px',
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
      <div className='bg-white h-full flex flex-col'>

        <div className='w-full bg-red-500'>
          <p className='px-5 py-3 text-white text-2xl font-semibold'>일정 수정 페이지</p>
        </div>

        <div className='flex flex-col h-full place-content-center'>
          <div className='flex flex-row items-center place-content-center my-2'>
            <p className='text-end w-1/6 font-semibold'>일정 이름 : </p>
            <input
              type="text"
              className="w-1/2 p-1 ml-4 border border-gray-300 rounded shadow-lg"
              value={content}
              onChange={(e)=>setContent(e.target.value)}
            />
          </div>
          <div className='flex flex-row items-center place-content-center my-2'>
            <p className='text-end w-1/6 font-semibold'>시작 날짜 : </p>
            <input
              type="datetime-local"
              className="w-1/2 ml-4 p-1 border border-gray-300 rounded shadow-lg"
              value={timeStart}
              onChange={(e)=>{setTimeStart(e.target.value)}}
            />
          </div>
          <div className='flex flex-row items-center place-content-center my-2'>
            <p className='text-end w-1/6 font-semibold'>종료 날짜 : </p>
            <input
              type="datetime-local"
              className="w-1/2 p-1 ml-4 border border-gray-300 rounded shadow-lg"
              value={timeEnd}
              onChange={(e)=>{setTimeEnd(e.target.value)}}
            />
          </div>
          <div className='flex flex-row items-center place-content-center my-2'>
            <p className='text-end w-1/6 font-semibold'>진행도 : </p>
            <input
              type="integer"
              className="w-1/2 p-1 ml-4 border border-gray-300 rounded shadow-lg"
              value={progress}
              onChange={(e)=>{setProgress(e.target.value)}}
            />
          </div>
        </div>
        <div className='flex flex-row h-1/6 place-items-center justify-end'>
          <button className={`${buttonStyle}`} onClick={closeModal}>취소</button>
          <button className={`${buttonStyle}`} onClick={()=>{
            modi_todo();
            closeModal();
            handleAdd("assistant","일정이 수정되었습니다.")
          }}>확인</button>
        </div>
      </div>
    </Modal>
  )
};

export default ModiModal;