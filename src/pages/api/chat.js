import { Configuration,OpenAIApi } from "openai";

const configuration = new Configuration({
    organization:process.env.OPENAI_ORGANIZATION,
    apiKey:process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration); //api 객체 생성

const systemPrompt="Hello, world";

//fetch로 호출됨->req.body에 messages,systempPrompt 등의 속성을 받아와 사용 가능
export default async (req,res) => {
    //POST로만 처리
    if (req.method!=="POST"){
        res.status(405).json({error:"Method not allowed"});
        return;
    }
    const {messages}=req.body; //req.body의 message속성 {role:"user",content:"요청사항"}
    console.log(messages)

    //req에 대한 res 받아오기
    const completion=await openai.createChatCompletion({
        model:"gpt-3.5-turbo",
        temperature:0.7, //답변 랜덤성
        max_tokens:512, //문답 토큰 길이
        messages:[{ role: "system", content: systemPrompt },...messages.slice(-6),], //사전규칙과 메시지 전달
    })

    //res 반환
    res.status(200).json({
        role:"assistant",
        content:completion.data.choices[0].message.content,
    });
}