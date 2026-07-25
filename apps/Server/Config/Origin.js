const allowed=["*","http://localhost:3500"];

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