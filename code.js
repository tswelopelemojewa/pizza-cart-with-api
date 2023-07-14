document.addEventListener('alpine:init', () => {
  Alpine.data('pizzaCartWithAPIWidget', function () {
    return {
      scount: 0, mcount: 0, lcount: 0, message: '', amount: 0, show: false, open: false,
      username: '',
      hideCart: false,
      hideLogin: false,
      featureLength: 0,
      bought: false,
      name: '',
      text: '',
      loader: '',
      pizzas: [],
      displayfeaturedpizzas: [],
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
      logout() {
        // confirm("Are you sure you wanna Sign out..?");

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
    
      },

      createCart() {

        if (!this.username) {
          this.cart_id = "Enter Username to create a cart";

          return;
        }

        const cart_id = localStorage['cart_id'];
        const username = localStorage['username'];
 

        if (cart_id && username) {
          this.cart_id = cart_id;
          this.username = username;
        }
        else {
          return axios
            .get(this.base_url + `api/pizza-cart/create?username=${this.username}`)
            .then((result) => {
              this.cart_id = result.data.cart_code;
              console.log(this.cart_id)
              localStorage['cart_id'] = this.cart_id;
              localStorage['username'] = this.username;
              // localStorage['cart_count'] = this.cart_count;
            });
        }
      },

      init() {
        axios
          .get(this.base_url + 'api/pizzas')
          .then(result => {
            // this.myFunction()
            // this.enterUsername();
            // this.postfeaturedPizzas(7)
            this.username = localStorage['username']
            this.cart_id = localStorage['cart_id']

            this.pizzas = result.data.pizzas;
            // this.postfeaturedPizzas(5);
          }).then(() => {

            if (!this.cart_id) {
              this.createCart()
              this.userCart();

            }
          })
          .then(() => {
            this.featuredPizzas()
          })

      },

      featuredPizzas() {
        return axios
          .get(this.base_url + `api/pizzas/featured?username=${this.username}`)
          .then((result) => {

            this.displayfeaturedpizzas = result.data;
            this.featureLength = this.displayfeaturedpizzas.pizzas.length;
            console.log(result.data)
          })
      },

      postfeaturedPizzas(pizza) {

        let data = JSON.stringify({
          "username": this.username,
          "pizza_id": pizza
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: this.base_url + 'api/pizzas/featured',
          headers: {
            'Content-Type': 'application/json'
          },
          data: data
        };

        axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
          }).then(() => {
            return this.featuredPizzas()
          })
          .catch((error) => {
            console.log(error);
          });

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
            this.bought = true;

            this.showCart();
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
            if (this.paymentAmount >= this.cart.total) {
              this.paymentMessage = 'Enjoy your pizza';
              this.change = this.paymentAmount - this.cart.total;

              setTimeout(() => {
                this.cart.total = 0;

                this.name = localStorage['username'];
                this.username = localStorage['username'];
                this.cart_count = 0;
                this.paymentMessage = '';
                this.cart_id = '';
                // localStorage['username'] = localStorage['username'];
                localStorage['cart_id'] = '';
                this.userCartContent = [],
                  this.createCart();
                window.location.reload()
              }, 5000);

            } else if (this.paymentAmount < this.cart.total) {
              this.paymentMessage = 'Sorry, That is not enough cart.total!'
              setTimeout(() => {
                this.paymentMessage = ''
              }, 5000);
            }

          })

      }

    }
  });
})