export const config = {
  screens: {
    home: {
      screens: {
        Social: {
          path: "social",
          screens: {
            SocialHome: "socialhome",
            Notification: "notification",
            PostDetails: "postdetails/:postId",
            FriendProfile: "friend/:friendId",
          },
        },
        Home: {
          path: "home",
          screens: {
            Index: "index",
            Menu: "foodlist/:id/:isOpen",
            Restaurant: "singleRestaurent/:id",
            Location: "makeOrder",
            UserLocation: "yourLocation",
            Filter_product: "filter_by_dishtype/:name",
          },
        },
        Cart: {
          path: "cart",
          screens: {
            CartItem: "yourCart",
            EmptyCart: "emptyCart",
          },
        },
        AddItem: {
          path: "addfood",
          screens: {
            Emptyfoodaddscreen: "nofood",
            AddFood: "adddish",
            AddPost: "addpost",
            SelectChoice: "choice",
          },
        },
        User: {
          path: "user",
          screens: {
            Login: "login",
            Profile: "myaccount/:userId",
            BusinessForm: "businessform",
            MyRestaurent: "myrestaurent/:id",
            MyMenu: "myfoodlist/:id",
            MyOrder: "myorder",
            About: "aboutus",
            PrivecyPolicy: "privecypolicy",
            RefundPolicy: "refundpolicy",
          },
        },
      },
    },
  },
};
