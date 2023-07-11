document.addEventListener('alpine:init', () => {
  Alpine.data('pizzaCartWithAPIWidget', function () {
    return {
      scount: 0, mcount: 0, money: 0, total: 0, lcount: 0, message: '', amount: 0, show: false, open: false,
      username: '',
      name: '',
      text: '',
      loader: '',
      pizzas: [],
      featuredpizzas: [],
      userCartContent: [],
      openHistory: false,
      cart_count: 0,
      change: 0,
      cart_id: '',
      cart: { total: 0 },
      paymentMessage: '',
      payNow: false,
      paymentAmount: 0,

      base_url: 'https://pizza-api.projectcodex.net/',

      enterUsername() {
        if (this.username.length > 2) {
          this.createCart();
          alert("cart created");
        }
        else {
          alert("Username too short");
        }
      },
      logout(){
        alert("cart cleared...")
        this.cart_id =  '';
        this.username = '';
        this.name= '';

      },
      loadData(){
        window.location.reload()
      },
      myFunction() {
        
        this.username = prompt("Please enter Username:", "");
        if (this.username == null || this.username.length < 2) {
          this.text = "Enter proper name";
          // window.location.reload()

        } else {
          this.text = `Welcome ${this.username}`;
        }
      },

      createCart() {

        if (!this.username) {
          // this.cart_id = "Enter Username to create a cart";
          
          return;
        }

        const cart_id = localStorage['cart_id'];

        if (cart_id) {
          this.cart_id = cart_id;
        }
        else {
          return axios
            .get(this.base_url + `api/pizza-cart/create?username=${this.username}`)
            .then((result) => {
              this.cart_id = result.data.cart_code;
              console.log(this.cart_id)
              localStorage['cart_id'] = this.cart_id;
            });
        }
      },

      init() {
        axios
          .get(this.base_url + 'api/pizzas')
          .then(result => {
            this.myFunction()
            // this.enterUsername();
            this.pizzas = result.data.pizzas
          }).then(() => {
            if (!this.cart_id) {
              this.createCart()
              this.userCart();

            }
          })
          // .then(() =>{
            // if(!this.username){
              // this.enterUsername();
              // this.createCart();
              // this.userCart();
            // }
            
          // })

      },

      featuredPizzas() {
        return axios
          .get(this.base_url + 'api/pizzas/featured')
      },

      postfeaturedPizzas() {
        return axios
          .post(this.base_url + 'api/pizzas/featured')
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
            console.log(this.userCartContent)
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
                this.name = '';
                this.cart_count = 0;
                this.paymentMessage = '';
                this.cart_id = '';
                localStorage['cart_id'] = '';
                this.userCartContent = [],
                  this.createCart();
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