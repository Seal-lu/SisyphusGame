window.onload = ()=>{
  //#region 轮播图
  var mySwiper = new Swiper ('.swiper', {
      direction: 'horizontal', // 垂直切换选项
      
      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination',
      },
      
      // 如果需要前进后退按钮
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
  })
  //#endregion

  //#region 界面初始化
  let game = new XMLHttpRequest() || new ActiveXObject('Microsoft.XMLHTTP')
  game.open('get','http://localhost:3000/api/gameInfo',true)
  game.send()
  game.onreadystatechange=()=>{
    if(game.readyState == 4){
      if(game.status == 200){
        let data = JSON.parse(game.responseText)
        bannerShow(data)
        recome(data)
      }
    }
  }
  let comment_req = new XMLHttpRequest() || new ActiveXObject('Microsoft XMLHTTP')
  comment_req.open('get','http://localhost:3000/api/comments',true)
  comment_req.send()
  comment_req.onreadystatechange=()=>{
    if (comment_req.readyState == 4){
      if(comment_req.status == 200){
        let data = JSON.parse(comment_req.responseText)
          comments(data)
      }
    }
  }
  //#endregion

  // <-------------方法区------------------>
  let ajax = (method='get',url,target,targetBg)=>{
    let list = new XMLHttpRequest () || new ActiveXObject('Microsoft XMLHTTP')
    list.open(method,`http://localhost:3000/${url}`,true)
    list.send()
    list.onreadystatechange =()=>{
      if(list.readyState == 4){
        if(list.status == 200){
          let props = JSON.parse(list.responseText)
          // 渲染数据
          render(target,targetBg,props)
        }
      }
    } 
  }
  // 今日推荐与轮播
  let bannerShow =(targets)=>{
    for(let shower = 0;shower<5;shower++){
      if(targets[shower].nowPrice != null){
        let{name,imgUrl,price,nowPrice} = targets[shower]
        // 今日推荐
        banner_list.innerHTML += `
          <li>
              <img src="${imgUrl}" alt="">
              <div class="t_info">
                  <p>${name}</p>
                  <div class="cost">
                      <span class="newCost">￥${nowPrice}</span><span class="oldCost">￥${price}</span>
                  </div>
              </div>
          </li>
        `
        // 轮播图图片
        document.getElementsByClassName('swiper-wrapper')[0].innerHTML += `
        <div class="swiper-slide"><img src="${imgUrl}" alt=""></div>
        `
      }
    }
  }
  // 促销
  let recome = (targets) => {
    // 对数据进行过滤
    let priceArr = []
    targets.filter((item)=>{
      if(item.nowPrice != null) priceArr.push(item);
    })
    // 对目标进行降序排序
    for(let out = 0;out<priceArr.length;out++){
      for(let inner = 0;inner<priceArr.length;inner++){
        if (priceArr[out].nowPrice > priceArr[inner].nowPrice){
          let A = priceArr[out]
          priceArr[out] = priceArr[inner]
          priceArr[inner] = A
        }
      }
    }
    // 渲染数据
    for(let render = 0;render<4;render++){
      document.getElementsByClassName('discount')[0].innerHTML += `
        <div>
            ${priceArr[render].type == '史低' ? '<p class="min">史低</p>':''}
            <img src="${priceArr[render].imgUrl}" alt="">
            <p>${priceArr[render].name}</p>
            <div class="cost">
                <span>￥${priceArr[render].nowPrice}</span>
                <span>￥${priceArr[render].price}</span>
            </div>
        </div>
      `
    }
  }
  // 安利墙
  let comments = (targets) =>{
    let count = 0
    targets.forEach(item => {
      if(count<4 && item.stars==5){
        document.getElementsByClassName('commonets')[0].innerHTML += `
          <div class="commonet">
              <img src="${item.imgUrl}" alt="" class="bg">
              <div class="c_name">
                  <p>${item.gameName}</p>
                  <p>8888人推荐</p>
              </div>
              <div>
                  <div class="comInfo">
                      <p>${item.info}</p>
                      <div>
                          <div><span>${item.userName}</span><i class="fa fa-star" aria-hidden="true"></i></div>
                          <span>${item.date.slice(0,10)}</span>
                      </div>
                  </div>
              </div>
          </div>
        `
        count++
      }
    });
  }
  // 最受欢迎
  let popular = ()=>{
    ajax('get','api/popular','popular','popular bg')
  }
  popular()
  // 最新上架
  let newGame = ()=>{
    ajax('get','api/issue','issue','issue bg')
  }
  newGame()
  // 销量
  let sales = () =>{
    ajax('get','api/sales','sales','sales bg')
  }
  sales()
  // 渲染数据
  let render = (target,targetBg,props) =>{
    for (let top = 0; top < 4; top++) {
      document.getElementsByClassName(targetBg)[0].setAttribute('src',props[0].imgUrl)
      document.getElementById(target).innerHTML += `
        <li class="game">
          <div class='p_left'>
            <img src="${props[top].imgUrl}">
            <div>
              <p class='gameName'>${props[top].name}</p>
              <div class='cost'>
                ${props[top].nowPrice != null ? `<span>￥${props[top].nowPrice}</span>`:''}
                <span>￥${props[top].price}</span>
              </div>
            </div>
          </div>
          <div id='score'>${props[top].score}</div>
        </li>
      `
    }
  }
  let findGame = new Promise((resolve,reject)=>{
    
    let sear = new XMLHttpRequest() || new ActiveXObject('Microsoft.XMLHTTP')
    sear.open('get',`http://localhost:3000/api/gameInfo`,true)
    sear.send()
    sear.onreadystatechange=()=>{
      if(sear.readyState == 4 && sear.status == 200){
        let res = JSON.parse(sear.responseText)
        resolve(res)
      }
    }
  })
  let findComment = new Promise((resolve,reject)=>{
    let commentArr = new XMLHttpRequest() || new ActiveXObject('Micorsoft.XMLHTTP')
    commentArr.open('get','http://localhost:3000/api/comments',true)
    commentArr.send()
    commentArr.onreadystatechange=()=>{
      if(commentArr.readyState == 4 && commentArr.status == 200){
        let commentRes = JSON.parse(commentArr.responseText)
        resolve(commentRes)
      }
    }
  })

  // 查询
  search.onchange =()=>{
    let value = search.value
    let search_banner = document.getElementById('search_res')
    search_banner.style.display = 'block'
    search_banner.innerHTML = ''
    findGame.then((res)=>{
      res.forEach((item)=>{
        if(item.name == value){
          search_banner.innerHTML += `
            <li class="game">
              <div class='p_left'>
                <img src="${item.imgUrl}">
                <div>
                  <p class='gameName'>${item.name}</p>
                  <div class='cost'>
                    ${item.nowPrice != null ? `<span>￥${item.nowPrice}</span>`:''}
                    <span>￥${item.price}</span>
                  </div>
                </div>
              </div>
              <div id='score'>${item.score}</div>
            </li>
          `
        }
      })
    })
  }
  let time = setTimeout(()=>{
    let gameArr = document.getElementsByClassName('game')
    closer.onclick = ()=>{
      game_banner.style.display = 'none'
    }
    for(let num = 0 ;num<gameArr.length;num++){
      gameArr[num].onclick = function(){
        game_banner.style.display = 'block'
        let game = document.getElementsByClassName('gameName')[num].textContent
        findGame.then((res)=>{
          res.forEach((item)=>{
            if(item.name == game){
              info_part.innerHTML = `
                <img src="${item.imgUrl}" alt="">
                <div>
                    <h3>${item.name}</h3>
                    <P>发行日期:${item.issue.slice(0,10)}</P>
                    <div id="tags">
                        <p>宫崎英高的阴谋</p>
                        <p>恋爱模拟</p>
                        <p>魂系</p>
                        <p>开放世界</p>
                    </div>
                    <p>评分:${item.score}</p>
                </div>
              `
            }
          })
        })
        findComment.then((res)=>{
          comment_part.innerHTML = ''
          res.forEach((item)=>{
            if (item.gameName == game) {
              comment_part.innerHTML += `
                <p>${item.info}</p>
              `
            }
            
          })
        })
      }
    }
  },1000)

  
}