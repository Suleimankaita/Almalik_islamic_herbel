const allowed=["*","http://localhost:3500",'http://localhost:5173'];

export const option ={
    origin:(origin,cb)=>{
        if(allowed.includes(origin)||!origin){
            cb(null,true)
        }else{
            throw new Error("Not Allowed By cors")
        }
    },
        credentials: true,
    
}