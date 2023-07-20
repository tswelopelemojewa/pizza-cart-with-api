document.addEventListener('alpine:init', () => {
    Alpine.data('historicalWidget', function () {
        return {
              name: '',
              username: localStorage['username'],
              pizzas: [],
              userCartContent: '',
              openUserHistory: false,
              viewPizzas: false,
              viewBtn: false,
              cart_part2: '',
              part1: '',
              


          init() {
            axios
              .get('https://pizza-api.projectcodex.net/api/pizzas')
              .then((result) => {
                this.pizzas = result.data.pizzas
              })
              .then(() => {
                this.UserHistory();
              })
  
          },
          showPizzas(x){
              this.viewPizzas=true;
            
          },
  
          UserHistory(){
            axios.get(`https://pizza-api.projectcodex.net/api/pizza-cart/username/${this.username}`)
            .then((result)=>{
              this.userCartContent = result.data;
              console.log(this.userCartContent)
            })
          },

          showCart2(historyCart) {

            const url = `https://pizza-api.projectcodex.net/api/pizza-cart/${historyCart}/get`;
    
            axios
              .get(url)
              .then((result)=>{
                this.cart_part2 = result.data.pizzas; 
                console.log(this.cart_part2)
              })
            
          },

          logout() {
            if (confirm("Are you sure you wanna Sign out..?") == true) {
              this.cart_id = '';
              this.username = '';
              this.name = '';
              localStorage['username'] = '';
              this.cart_count = 0;
              this.userCartContent = [];
              
            } else {
              this.cart_id = localStorage['cart_id'];
              this.username = localStorage['username'];
            }
        
          }
        }
        
  
  
      })

})
