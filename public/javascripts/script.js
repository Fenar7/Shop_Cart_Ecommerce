function addToCart(proId){
    console.log('added')
    $.ajax({
      url:'/add-to-cart/'+proId,
      method:'get',
      success:(response)=>{
        alert(response)
      }
    })
  }