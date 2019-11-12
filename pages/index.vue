<template>
  <b-container fluid>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand>Check-Mate</b-navbar-brand>
      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto" v-if="user">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>{{ user.displayName }}</em>
            </template>
            <b-dropdown-item @click="signout">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-row>
      <b-col>
        <b-container v-if="user" class=" pt-5">
          <b-row>
            <b-col class="main" sm="9">
              <b-list-group>
                <b-list-group-item :id="item.id" :key="item.id" v-for="item in items">
                  <b-checkbox >{{ item.data.name }}</b-checkbox>
                  <b-list-group>
                    <b-list-group-item :key="child.id" v-for="child in item.childs">
                      <b-checkbox>{{child.data.name}}</b-checkbox>
                    </b-list-group-item>
                  </b-list-group>
                </b-list-group-item>
              </b-list-group>
            </b-col>

            <b-col class="list">
              <ul>
                <li :key="item.id" v-for="item in items">
                  <b-link :href="'#' + item.id">{{item.data.name}}</b-link>
                </li>
              </ul>
            </b-col>
          </b-row>
        </b-container>
        <b-container v-else>
          <b-row>
            <b-col class="aligncenter">
              <button @click="popupLogin">Login or Create Account.</button>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Logo from "~/components/Logo.vue";
import firebase from "~/plugins/firebase";

var provider = new firebase.auth.GoogleAuthProvider();

let db = firebase.firestore();

export default {
  data() {
    return {
      user: null,
      items: []
    };
  },
  methods: {
    signout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          // Sign-out successful.
          this.user = null;
        })
        .catch(error => {
          // An error happened.
        });
    },
    popupLogin() {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          // ...
        })
        .catch(error => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
    }
  },
  async mounted() {
    await firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        // User is signed in.
        this.user = user;

        await db
          .collection("items-parent")
          .where("uid", "==", this.user.uid)
          .get()
          .then(snapshot => {
            var items = [];
            snapshot.forEach(doc => {
              var itemschild = [];
              var parentchecked = true;
              console.log(doc.id, "=>", doc.data());
              db.collection("items-child")
                .where("parent", "==", doc.id)
                .get()
                .then(snapshotChild => {
                  snapshotChild.forEach(docchild => {
                    if (!docchild.data().checked) {
                      parentchecked = false;
                    }
                    itemschild.push({
                      id: docchild.id,
                      data: docchild.data()
                    });
                    console.log(docchild.id, "=>", docchild.data());
                  });
                });
              items.push({
                id: doc.id,
                data: doc.data(),
                childs: itemschild,
                checked: parentchecked
              });
            });
            this.items = items;
          })
          .catch(err => {
            console.log("Error getting documents", err);
          });
      } else {
        // User is signed out.
        // ...
        this.user = null;
      }
    });
  }
};
</script>

<style>
.aligncenter {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
