// const { default: axios } = require("axios");
// {id: 1, size: 'large', type: 'chicken', flavour: 'Chicken & Mushroom', price: 104.99,},
// {id: 2, size: 'large', type: 'meaty', flavour: 'Regina', price: 106.99,},
// {id: 3, size: 'large', type: 'meaty', flavour: 'Four Season', price: 107.99}

/*
document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function () {
        return {
            allPizzas: '',
            featuredPizzas: '',
            postFeaturedPizza: '',
            cart_id: '',
            getCart: '',
            userCart: [],
            userActiveCart: '',
            pizza: '',
            username: 'tswelopele',
            url: `this.base_url + `,


            // when initializing the code
            init() {

                // load data into the screen here
                const cart_code = '...';


                // list all the pizzas
                axios.get(this.url + `api/pizzas`)
                    .then((result) => {
                        this.allPizzas = result.data.pizzas;

                        console.log(this.allPizzas)
                    })

                // create a cart
                axios.get(this.url + `api/pizza-cart/create/?username=` + this.username)
                    .then((result) => {
                        this.cart_id = result.data.cart_code;
                        console.log(this.cart_id)
                    })

                // featured pizzas [get]
                axios.get(this.url + `api/pizzas/featured`)
                    .then((result) => {
                        this.featuredPizzas = result.data;
                        console.log(this.featuredPizzas)
                    })

                // featured pizzas [post]
                this.postFeaturedPizza = axios.post(this.url + `api/pizzas/featured`)




                // // get cart
                axios.get(this.url + `api/pizza-cart/:cart_code/get`)
                    .then((result) => {
                        this.getCart = result.data;

                        console.log(this.getCart)
                    })


                // get cart for specific user
                axios.get(this.url + `api/pizza-cart/username/:username`)
                    .then((result) => {
                        this.userCart = result.data;

                        console.log(this.userCart)
                    })

                // get user active cart
                // axios.get(this.url + `api/pizza-cart/username/:username/active`)
                //     .then((result) => {
                //         this.userActiveCart = result.data;

                //         console.log(this.userActiveCart)
                //     })

                //get cart
                axios.get(this.url + 'api/pizza-cart/:cart_code/get')
                    .then((result) => {
                        this.myCart = result.data;

                        // console.log(result)
                        console.log(this.myCart)
                    })


                // buy pizza
                axios.post(this.url + `api/pizza-cart/add`, {
                    "cart_code": cart_code,
                    "pizza_id": this.pizza.id
                }).then((result) => {
                    const pizzas = result.data.pizzas;

                    // this.pizzas is declared on you AlpineJS Widget.
                    this.pizzas = pizzas;

                    console.log(result)
                })


                // remove pizza
                // axios.post('http://pizza-api.projectcodex.net/api/pizza-cart/remove', {
                // "cart_code": cart_code,
                // "pizza_id": pizza.id
                // }).then((result) => {
                // const pizzas = result.data.pizzas;
                // 
                // this.pizzas is declared on you AlpineJS Widget.
                // this.pizzas = pizzas;
                // 
                // console.log(result)
                // })


                // pay for pizza
                // axios.post('http://pizza-api.projectcodex.net/api/pizza-cart/pay', {
                //     "cart_code": cart_code,
                //     "amount": 4
                // }).then((result) => {
                //     const pizzas = result.data.pizzas;

                //     // this.pizzas is declared on you AlpineJS Widget.
                //     this.pizzas = pizzas;

                //     console.log(result)
                // })


            }





        }
    })

})
*/

document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function () {
      return {
        scount: 0, mcount: 0, money:0, total:0, lcount: 0, message: '', amount: 0, show: false, open: false,
        username: 'tswelopele',
        pizzas: [],
        featuredpizzas: [],
        userCartContent: '',
        openHistory: false,
        cart_count: 0,
        change: 0,
        cart_id: '',
        cart: { total: 0},
        paymentMessage: '',
        payNow: false,
        paymentAmount: 0,
        base_url: 'https://pizza-api.projectcodex.net/',
  
        init() {
          axios
            .get(this.base_url+'api/pizzas')
            .then((result) => {
              this.pizzas = result.data.pizzas
              console.log(result.data)
            })
            .then(() => {
              this.userCart();
              console.log("cart created")
              return this.createCart();
            })
            .then((result) => {
              this.cart_id = result.data.cart_code;
              console.log(this.cart_id)
            });
        },
  
        featuredPizzas() {
          return axios
            .get(this.base_url + 'api/pizzas/featured')
        },
        
        postfeaturedPizzas() {
          return axios
            .post(this.base_url + 'api/pizzas/featured')
        },
  
        createCart() {
            
          return axios
            .get(this.base_url + 'api/pizza-cart/create?username=' + this.username)
        },
  
        showCart() {
            
          const url = this.base_url + `api/pizza-cart/${this.cart_id}/get`;
  
          axios
            .get(url)
            .then((result) => {

                console.log(this.cart)
              this.cart = result.data;
              
            });
        },
        userCart() {
          let config = {
              method: 'get',
              maxBodyLength: Infinity,
              url: `https://pizza-api.projectcodex.net/api/pizza-cart/username/${this.username}`,
              headers: {}
          };

          axios.request(config)
              .then((response) => {
                  this.userCartContent = response.data;
                  console.log(JSON.stringify(response.data));
              })
              .catch((error) => {
                  console.log(error);
              });
      },
  
  
        add(pizza) {
  
          axios
            .post(this.base_url + 'api/pizza-cart/add', {
                cart_code: this.cart_id,
                pizza_id: pizza
              })
            .then(() => {
                this.cart_count++;
                
              this.message = "Pizza added to " + this.cart_id
              this.showCart();
            })
            .then(() => {
  
              return this.featuredPizzas();
  
            })
            .then(() => {
              return this.postfeaturedPizzas();
            })
            .catch(err => alert(err));
  
        },
        remove(pizza) {

          axios
            .post(this.base_url + 'api/pizza-cart/remove', {
                cart_code: this.cart_id,
                pizza_id: pizza
              })
            .then(() => {
                this.cart_count--;
              this.message = "Pizza removed from the cart"
              this.showCart();
            })
            .catch(err => alert(err));
  
        },
        pay(pizza) {

          axios
            .post(this.base_url + 'api/pizza-cart/pay', {
                cart_code: this.cart_id,
              })
            .then(() => {
            if (this.paymentAmount >= this.money) {
                this.paymentMessage = 'Enjoy your pizza';
                this.change = this.paymentAmount - this.money;
                this.message = this.username + " , paid for the pizza(s)!";
                setTimeout(() => {
                  this.money = 0;
                  this.scount = 0;
                  this.mcount = 0;
                  this.lcount = 0;
                  this.cart_count=0;
                  this.paymentMessage = '';
                  window.location.reload()
                }, 5000);
  
              } else if (this.paymentAmount < this.money) {
                this.paymentMessage = 'Sorry, That is not enough money!'
                setTimeout(() => {
                    this.paymentMessage = ''
                  }, 5000);
              }
  
            })
  
        }
  
      }
    });
  })