const validator = {
    numeric: (num, opt) =>{
        // 좌우 trim(공백제거)을 해준다.
        try{
            num = String(num).replace(/^\s+|\s+$/g, "");
            let regex
            if(typeof opt == "undefined" || opt == "1"){
                // 모든 10진수 (부호 선택, 자릿수구분기호 선택, 소수점 선택)
                regex = /^[+\-]?(([0-9]{0,3}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]*)?$/g;
            }else if(opt == "2"){
                // 부호 미사용, 자릿수구분기호 선택, 소수점 선택
                regex = /^(([0-9]{0,3}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]*)?$/g;
            }else if(opt == "3"){
                // 부호 미사용, 자릿수구분기호 미사용, 소수점 선택
                regex = /^[0-9]+(\.[0-9]*)?$/g;
            }else{
                // only 숫자만(부호 미사용, 자릿수구분기호 미사용, 소수점 미사용)
                regex = /^[0-9]$/g;
            }

            if( regex.test(num) ){
                num = num.replace(/,/g, "");
                return isNaN(num) ? false : Number(num);
            }else{ return false;  }
        }catch(err){
            return false
        }
    }
}

export default validator
