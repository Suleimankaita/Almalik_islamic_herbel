import { CheckField } from "../types/logic";


const Checkfields=(field:any)=>{

        if(!field|| typeof field!=='object'||Array.isArray(field)){
            return {success:false}
        }

        for(let key in field){
            
            const Value=field[key];
            if(Value.startsWith('_'))continue;
            
            if(String(Value).trim()===""||Value===null||Value===null|| Value===undefined){
                return {
                success:false,
                message:`All field is require ${key}`
                }
            }

            return {
                success:true
            }
        }
}

export default Checkfields