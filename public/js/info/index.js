window.onload =()=>{
    console.log(123);
    let init = new XMLHttpRequest() || new ActiveXObject('Micorsoft.XMLHTTP') 
    init.open('get','http://localhost:3000/api/info',true)
    init.send()
    init.onreadystatechange = ()=>{
        if(init.readyState == 4 && init.status==200){
            let res = JSON.parse(init.responseText)
        }
    }
}