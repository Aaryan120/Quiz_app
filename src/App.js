import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import quizdata from "../src/data/quizData.json"
import './App.css'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

import { Thead,Table,Th,Tr, Tbody, Td } from 'react-super-responsive-table';


function App() {
  
  const [quizData,setQuizData] = useState(null);
  const [loading,setLoading] = useState(false);
  const [currentQuestionIndex,setCurrentQuestionIndex] = useState(0);
  const [userAnswers,setUserAnswers] = useState([]);
  const [completedQuiz,setCompletedQuiz] = useState(false);
  const [quizStarted,setQuizStarted] = useState(false);
  const [duration,setDuration] = useState(0);

  useEffect(() =>{
    
    const fetchQuizData = async () =>{
      setLoading(true);
      try {
        const response = await fetch('/api.jsonserve.com/Uw5CrX') //Your Api Here
        if(!response.ok){
          throw new Error()
        }
        // console.log(response);
        // const response = quizdata;
        setQuizData(response);
        setDuration(response.duration);
        console.log(response);
        setUserAnswers(Array(response.questions.length).fill(null));
      } catch (error) {
        console.log("Error while fetching data",error);
        toast.error("Error Loading Quiz Data");
      }
      setLoading(false);
    }
    fetchQuizData();
  },[])

  if(!quizData || loading){
    return <span className="loader place-items-center mt-60"></span>
  }

  const handleSelectAnswers = (id,currentQuestionIndex) =>{
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = id;
    setUserAnswers(updatedAnswers);
    console.log(updatedAnswers);
  }

  const nextQuestionHandler = () =>{
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  const previousQuestionHandler = () =>{
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  }

  const calculateScore = () =>{
    let score = 0;
    quizData.questions.forEach((element,index) => {
      const userOption = userAnswers[index]
      const correctOption = element.options.find((option) => option.is_correct);
      if(userOption == null){
      }
      else if(correctOption.id === userOption){
        score += 4;
      }else{
        score -= 1;
      }
    });
    return score;
  }
  const submitHandler = () =>{
    setCompletedQuiz(true);
  }

  const resetQuiz = () =>{
    setQuizStarted(false);
    setCompletedQuiz(false);
    setCurrentQuestionIndex(0);
    setUserAnswers(Array(quizData.questions.length).fill(null));
  }
  if(completedQuiz){
    const score = calculateScore();
    return (
      <div class="bg-blue-100 h-screen">
        <div className='w-11/12 mx-auto pt-5'>
          <div className='place-items-center mb-5'>
            <h1 className='text-4xl font-bold'>Quiz Completed</h1>
            <h2 className='text-2xl mt-3 font-medium'>Your Score: {score}/{quizData.questions.length*4}</h2>
          </div>


          <Table className='border border-black/60'>
            <Thead className='border p-2 border-zinc-600/40 bg-blue-500'>
              <Tr>
                <Th className='border-r border-black'>
                  Question
                </Th>
                <Th className='border-r border-black'>
                  Status
                </Th>
                <Th className='border-r border-black'>
                  Correct Answer
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                quizData.questions.map((question,index) =>{
                  const correctAnswer = question.options.find(option => option.is_correct)
                  const userAns = userAnswers[index];
                  return (
                    <Tr className='border-b border-black'>
                        <Td className='border-r border-black p-2 bg-pink-300'>
                          {question.description}
                        </Td>
                        <Td className={`${userAns === null ? "bg-purple-400": userAns === correctAnswer.id ? "bg-green-400" : "bg-red-500" } border-r border-black p-2`}>
                          {
                            userAns ? (
                              <div>
                                {
                                  userAns === correctAnswer.id ? (
                                    <div>
                                      Correct
                                    </div>
                                  ) :
                                  (
                                    <div>
                                      Incorrect
                                    </div>
                                  )
                                }
                              </div>
                            ) :
                            (
                              <div>
                                Not Attempted
                              </div>
                            )
                          }
                        </Td>
                        <Td className='p-2 bg-green-300'>
                          {correctAnswer.description}
                        </Td>
                    </Tr>
                  )
                })
              }
            </Tbody>
          </Table>

          <div
          className='px-[24px] py-[8px] border bg-gradient-to-r from-[#158e8c] from-0% to-[#2b275d] to-100% text-white w-fit rounded-s-full rounded-e-full mt-5 mx-auto cursor-pointer'
          onClick={() =>{
            resetQuiz();
          }}>
            StartOver
          </div>
        </div>
        
      </div>
    )
  }

  let currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className='place-items-center h-screen w-screen bg-blue-100'>
      {
        
        (
          <>
            {
              !quizStarted ? 
              (
                <div className='flex flex-col items-center justify-items-center pt-20 p-5'> 
                  <div className='p-5 pr-10 rounded-t-md bg-gradient-to-r from-[#158e8c] from-0% to-[#2b275d] to-100%'>
                    <div>
                      <p className='text-md text-white font-semibold'>Duration {duration} min</p>
                    </div>
                    <h3 className='text-2xl mt-3 text-white font-semibold'>
                      {
                        quizData.title
                      }
                    </h3>
                    <p className='text-xl font-semibold text-white mt-2'>
                      {
                        quizData.topic
                      }
                    </p>
                  </div>
                  <div className='py-6 px-10 bg-gray-600/50 rounded-b-lg flex justify-center items-center w-full '>
                    <button 
                    // onClick={() => startTest()}
                    onClick={() => setQuizStarted(true)}
                    className='bg-[#158e8c] text-white font-medium text-lg px-10 py-2 rounded-s-full rounded-e-full'>
                      Start Test
                    </button>
                  </div>
                </div>
              ): 
              (
                
                  <div className="bg-gradient-to-b from-cyan-500 to-blue-500 w-screen h-screen flex items-center justify-center">
                      <div>
                        <div>
                          {/* timer div */}
                        </div>
                        <div className="bg-gray-100 w-[400px] max-w-lg min-h-[500px] rounded-lg p-5 flex flex-col justify-between">
                          {/* question */}
                          <div className="text-lg font-semibold mb-5 break-words text-wrap">
                            {
                              currentQuestion && currentQuestion.description
                            }
                          </div>
                          {/* options */}
                          <div className="flex flex-col items-start gap-y-5">
                            {
                              currentQuestion && currentQuestion.options.map((option,index) =>{
                                return (
                                  <div 
                                  className={`${option.id === userAnswers[currentQuestionIndex] ? "bg-blue-700/70" : "bg-gray-100"} border border-zinc-500/50 w-full rounded-s-full rounded-e-full px-2 py-3 cursor-pointer`}
                                  onClick={() =>{
                                    handleSelectAnswers(option.id,currentQuestionIndex);
                                  }}
                                  key={index}>
                                    <button>
                                      {
                                        index+1
                                      }
                                      :{" "}
                                      {
                                        option.description
                                      }
                                    </button>
                                  </div>
                                )
                              })
                            }
                          </div>

                          <div className={`mt-16 flex ${currentQuestionIndex === 0 ? "justify-end" : "justify-between"}`}>
                            {
                              currentQuestionIndex > 0 && currentQuestionIndex < 10 ?
                              <button
                              onClick={() => previousQuestionHandler()}
                              className='px-[12px] py-[8px] bg-yellow-800 rounded-md text-white'>Previous</button> : 
                              null
                            }
                            {
                              currentQuestionIndex < 9 && currentQuestionIndex >= 0 ?
                              <button 
                              onClick={() => nextQuestionHandler()}
                              className='px-[12px] py-[8px] bg-green-800 rounded-md text-white'>Next</button> :
                              (
                                <button
                                onClick={() =>{
                                  submitHandler()
                                }}
                                className='px-[12px] py-[8px] bg-blue-800 rounded-md text-white'>
                                  Submit Quiz
                                </button>
                              )
                            }
                          </div>
                        </div>
                      </div>
                  </div>
              )
            }
          </>
          
        )
      }
      
        
    </div>
  )
}

export default App